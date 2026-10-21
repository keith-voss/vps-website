const DEFAULT_SPREADSHEET_ID = "1fKcPMTqLMdT6iuPp9hTpZ_KQUQgxq03vFGryemMV4-M";
const DEFAULT_SHEET_NAME = "Sheet1";
const DEFAULT_NOTIFY_EMAILS = "keith@vosspropertysolutions.com";

const HEADERS = [
  "Full Name",
  "Phone number",
  "Email",
  "Service needed",
  "City",
  "Brief Project Description",
  "Permission to contact you",
  "Lead ID",
  "Submitted At",
  "Status",
  "Company / Property",
  "Property Type",
  "Project Timeline",
  "Preferred Contact Method",
  "Preferred Contact Time",
  "Referral Source",
  "Source Page",
  "Referrer",
  "UTM Source",
  "UTM Medium",
  "UTM Campaign",
  "Device Type",
  "Notification Status",
  "Assigned To",
  "Contacted At",
  "Estimate Status",
  "Notes",
  "Address",
];

const LEAD_ID_COLUMN = HEADERS.indexOf("Lead ID") + 1;
const NOTIFICATION_COLUMN = HEADERS.indexOf("Notification Status") + 1;
const MAX_RETRIES_PER_RUN = 20;

function doGet(event) {
  const parameters = (event && event.parameter) || {};
  const callback = String(parameters.callback || "");
  const submissionId = String(parameters.submissionId || "").toLowerCase();

  if (parameters.action !== "status" || !/^vpsLeadStatus_[A-Za-z0-9_]+$/.test(callback)) {
    return javascriptResponse_("callback", { stored: false });
  }

  const leadId = leadIdFromSubmissionId_(submissionId);
  if (!leadId) return javascriptResponse_(callback, { stored: false });

  try {
    const key = statusCacheKey_(submissionId);
    const cached = CacheService.getScriptCache().get(key);
    const persisted = cached || PropertiesService.getScriptProperties().getProperty(key);
    if (!persisted) return javascriptResponse_(callback, { stored: false });

    const status = JSON.parse(persisted);
    if (status.expiresAt && status.expiresAt < Date.now()) {
      PropertiesService.getScriptProperties().deleteProperty(key);
      return javascriptResponse_(callback, { stored: false });
    }
    return javascriptResponse_(callback, status);
  } catch (error) {
    console.error(error);
    return javascriptResponse_(callback, { stored: false });
  }
}

function doPost(event) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    const rawLead = payload.lead || {};
    if (cleanText_(rawLead.website)) {
      return jsonResponse_({ ok: true });
    }

    const lead = normalizeLead_(rawLead);
    validateLead_(lead);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    let isDuplicate = false;
    let notificationSent = false;
    let notificationStatus = "Pending";
    try {
      const sheet = getLeadSheet_(properties);
      ensureHeaders_(sheet);
      let rowNumber = findLeadRow_(sheet, lead.leadId);
      isDuplicate = rowNumber > 0;

      if (!isDuplicate) {
        sheet.appendRow(leadToRow_(lead, "Pending"));
        rowNumber = sheet.getLastRow();
      }

      notificationStatus = String(sheet.getRange(rowNumber, NOTIFICATION_COLUMN).getValue() || "");
      if (notificationStatus === "Sent") {
        notificationSent = true;
      } else {
        const leadForNotification = isDuplicate
          ? rowToLead_(sheet.getRange(rowNumber, 1, 1, HEADERS.length).getValues()[0])
          : lead;
        try {
          sendLeadEmail_(properties, leadForNotification, sheet);
          sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue("Sent");
          notificationStatus = "Sent";
          notificationSent = true;
        } catch (emailError) {
          const failedAt = new Date().toISOString();
          notificationStatus = "Failed — " + failedAt;
          sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue(notificationStatus);
          console.error("Lead saved but notification email failed.", emailError);
        }
      }
    } finally {
      lock.releaseLock();
    }

    cacheLeadStatus_(lead.submissionId, lead.leadId, notificationStatus);

    return jsonResponse_({
      ok: true,
      leadId: lead.leadId,
      duplicate: isDuplicate,
      notificationSent: notificationSent,
    });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: "Lead intake failed." });
  }
}

function setupLeadSheet() {
  const properties = PropertiesService.getScriptProperties();
  const sheet = getLeadSheet_(properties);
  ensureHeaders_(sheet);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#f4b400");
  sheet.autoResizeColumns(1, HEADERS.length);
  ensureRetryTrigger_();
}

function retryFailedNotifications() {
  const properties = PropertiesService.getScriptProperties();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    pruneExpiredLeadStatuses_(properties);
    const sheet = getLeadSheet_(properties);
    ensureHeaders_(sheet);
    if (sheet.getLastRow() < 2) return;

    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
    let attempts = 0;

    rows.forEach(function (row, index) {
      if (attempts >= MAX_RETRIES_PER_RUN) return;
      const status = String(row[NOTIFICATION_COLUMN - 1] || "");
      const lead = rowToLead_(row);
      if (!lead.leadId || (status !== "Pending" && status.indexOf("Failed — ") !== 0)) return;

      attempts += 1;
      const rowNumber = index + 2;
      try {
        sendLeadEmail_(properties, lead, sheet);
        sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue("Sent");
        cacheLeadStatus_(submissionIdFromLeadId_(lead.leadId), lead.leadId, "Sent");
      } catch (error) {
        const failedStatus = "Failed — " + new Date().toISOString();
        sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue(failedStatus);
        cacheLeadStatus_(submissionIdFromLeadId_(lead.leadId), lead.leadId, failedStatus);
        console.error("Notification retry failed for row " + rowNumber, error);
      }
    });
  } finally {
    lock.releaseLock();
  }
}

function ensureRetryTrigger_() {
  const exists = ScriptApp.getProjectTriggers().some(function (trigger) {
    return trigger.getHandlerFunction() === "retryFailedNotifications";
  });

  if (!exists) {
    ScriptApp.newTrigger("retryFailedNotifications").timeBased().everyMinutes(15).create();
  }
}

function getLeadSheet_(properties) {
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID") || DEFAULT_SPREADSHEET_ID;
  const sheetName = properties.getProperty("SHEET_NAME") || DEFAULT_SHEET_NAME;
  if (!spreadsheetId) throw new Error("SPREADSHEET_ID is not configured.");

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  return spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    return;
  }

  const existing = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (HEADERS.some(function (header, index) {
    return existing[index] !== "" && existing[index] !== header;
  })) {
    throw new Error("Sheet headers do not match the expected lead schema.");
  }
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
}

function findLeadRow_(sheet, leadId) {
  if (sheet.getLastRow() < 2) return 0;
  const match = sheet
    .getRange(2, LEAD_ID_COLUMN, sheet.getLastRow() - 1, 1)
    .createTextFinder(leadId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function normalizeLead_(rawLead) {
  const submissionId = cleanText_(rawLead.submissionId).toLowerCase();
  const leadId = leadIdFromSubmissionId_(submissionId);
  if (!leadId) throw new Error("Invalid submission reference.");

  return {
    submissionId: submissionId,
    leadId: leadId,
    submittedAt: new Date().toISOString(),
    status: "New",
    fullName: limitedText_(rawLead.fullName, 100),
    companyProperty: limitedText_(rawLead.companyProperty, 160),
    phone: limitedText_(rawLead.phone, 40),
    email: limitedText_(rawLead.email, 160).toLowerCase(),
    serviceNeeded: limitedText_(rawLead.serviceNeeded, 100),
    propertyType: limitedText_(rawLead.propertyType, 100),
    projectLocation: limitedText_(rawLead.projectLocation, 200),
    projectDescription: limitedText_(rawLead.projectDescription, 2000),
    projectTimeline: limitedText_(rawLead.projectTimeline, 100),
    preferredContactMethod: limitedText_(rawLead.preferredContactMethod, 30),
    preferredContactTime: limitedText_(rawLead.preferredContactTime, 100),
    referralSource: limitedText_(rawLead.referralSource, 100),
    sourcePage: limitedText_(rawLead.sourcePage, 500),
    referrer: limitedText_(rawLead.referrer, 500),
    utmSource: limitedText_(rawLead.utmSource, 200),
    utmMedium: limitedText_(rawLead.utmMedium, 200),
    utmCampaign: limitedText_(rawLead.utmCampaign, 200),
    deviceType: /^(Desktop|Mobile|Tablet)$/.test(rawLead.deviceType) ? rawLead.deviceType : "Unknown",
    consent: rawLead.consent === true,
  };
}

function leadIdFromSubmissionId_(submissionId) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) {
    return "";
  }
  return "VPS-" + submissionId.toUpperCase();
}

function submissionIdFromLeadId_(leadId) {
  const submissionId = String(leadId || "").replace(/^VPS-/i, "").toLowerCase();
  return leadIdFromSubmissionId_(submissionId) ? submissionId : "";
}

function statusCacheKey_(submissionId) {
  return "lead-status:" + submissionId;
}

function cacheLeadStatus_(submissionId, leadId, notificationStatus) {
  if (!submissionId || !leadId) return;
  const key = statusCacheKey_(submissionId);
  const value = JSON.stringify({
    stored: true,
    leadId: leadId,
    notificationStatus: notificationStatus,
    expiresAt: Date.now() + 21600000,
  });
  CacheService.getScriptCache().put(key, value, 21600);
  PropertiesService.getScriptProperties().setProperty(key, value);
}

function pruneExpiredLeadStatuses_(properties) {
  const now = Date.now();
  const allProperties = properties.getProperties();
  Object.keys(allProperties).forEach(function (key) {
    if (key.indexOf("lead-status:") !== 0) return;
    try {
      const status = JSON.parse(allProperties[key]);
      if (!status.expiresAt || status.expiresAt < now) properties.deleteProperty(key);
    } catch (error) {
      properties.deleteProperty(key);
    }
  });
}

function limitedText_(value, maxLength) {
  return cleanText_(value).slice(0, maxLength);
}

function cleanText_(value) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";
}

function validateLead_(lead) {
  const required = [
    "leadId",
    "submittedAt",
    "fullName",
    "companyProperty",
    "phone",
    "email",
    "projectLocation",
    "projectDescription",
  ];

  required.forEach(function (field) {
    if (!lead[field] || typeof lead[field] !== "string") {
      throw new Error("Missing required lead field: " + field);
    }
  });

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) throw new Error("Invalid email address.");
  const phoneDigits = lead.phone.replace(/\D/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) throw new Error("Invalid phone number.");
  if (lead.projectDescription.length < 10) throw new Error("Brief description must be at least 10 characters.");
}

function leadToRow_(lead, notificationStatus) {
  return [
    safeCell_(lead.fullName),
    safeCell_(lead.phone),
    safeCell_(lead.email),
    safeCell_(lead.serviceNeeded),
    "",
    safeCell_(lead.projectDescription),
    "Contact requested",
    safeCell_(lead.leadId),
    safeCell_(lead.submittedAt),
    "New",
    safeCell_(lead.companyProperty),
    safeCell_(lead.propertyType),
    safeCell_(lead.projectTimeline),
    safeCell_(lead.preferredContactMethod),
    safeCell_(lead.preferredContactTime),
    safeCell_(lead.referralSource),
    safeCell_(lead.sourcePage),
    safeCell_(lead.referrer),
    safeCell_(lead.utmSource),
    safeCell_(lead.utmMedium),
    safeCell_(lead.utmCampaign),
    safeCell_(lead.deviceType),
    notificationStatus,
    "",
    "",
    "",
    "",
    safeCell_(lead.projectLocation),
  ];
}

function rowToLead_(row) {
  return {
    fullName: String(row[0] || ""),
    phone: String(row[1] || ""),
    email: String(row[2] || ""),
    serviceNeeded: String(row[3] || ""),
    projectLocation: String(row[27] || row[4] || ""),
    projectDescription: String(row[5] || ""),
    consent: String(row[6] || "") === "Yes",
    leadId: String(row[7] || ""),
    submittedAt: String(row[8] || ""),
    companyProperty: String(row[10] || ""),
    propertyType: String(row[11] || ""),
    projectTimeline: String(row[12] || ""),
    preferredContactMethod: String(row[13] || ""),
    preferredContactTime: String(row[14] || ""),
    referralSource: String(row[15] || ""),
    sourcePage: String(row[16] || ""),
    referrer: String(row[17] || ""),
    utmSource: String(row[18] || ""),
    utmMedium: String(row[19] || ""),
    utmCampaign: String(row[20] || ""),
    deviceType: String(row[21] || ""),
  };
}

function sendLeadEmail_(properties, lead, sheet) {
  const recipients = properties.getProperty("NOTIFY_EMAILS") || DEFAULT_NOTIFY_EMAILS;
  if (!recipients) throw new Error("NOTIFY_EMAILS is not configured.");

  const subject = "New Voss Estimate Lead — " + lead.fullName + " — " + lead.companyProperty;
  const sheetUrl = sheet.getParent().getUrl();
  const plainBody = [
    "A new estimate request was submitted through the Voss website.",
    "",
    "Name: " + lead.fullName,
    "Company name: " + lead.companyProperty,
    "Phone: " + lead.phone,
    "Email: " + lead.email,
    "Address: " + lead.projectLocation,
    "",
    "Project description:",
    lead.projectDescription,
    "",
    "Source: " + (lead.sourcePage || "Unknown"),
    "Lead ID: " + lead.leadId,
    "",
    "View lead sheet: " + sheetUrl,
  ].join("\n");

  const rows = [
    ["Name", lead.fullName],
    ["Company name", lead.companyProperty],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Address", lead.projectLocation],
    ["Source", lead.sourcePage || "Unknown"],
    ["Lead ID", lead.leadId],
  ].map(function (row) {
    return "<tr><th style=\"padding:6px 12px 6px 0;text-align:left;vertical-align:top\">" + escapeHtml_(row[0]) + "</th><td style=\"padding:6px 0\">" + escapeHtml_(row[1]) + "</td></tr>";
  }).join("");

  const htmlBody = "<p>A new estimate request was submitted through the Voss website.</p>" +
    "<table>" + rows + "</table>" +
    "<h3>Project description</h3><p>" + escapeHtml_(lead.projectDescription).replace(/\n/g, "<br>") + "</p>" +
    "<p><a href=\"" + escapeHtml_(sheetUrl) + "\">View the lead in Google Sheets</a></p>";

  MailApp.sendEmail({
    to: recipients,
    subject: subject,
    body: plainBody,
    htmlBody: htmlBody,
    name: "Voss Property Solutions Website",
    replyTo: lead.email,
  });
}

function safeCell_(value) {
  const text = value == null ? "" : String(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function escapeHtml_(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function javascriptResponse_(callback, body) {
  return ContentService
    .createTextOutput(callback + "(" + JSON.stringify(body) + ");")
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}
