const HEADERS = [
  "Lead ID",
  "Submitted At",
  "Status",
  "Full Name",
  "Company / Property",
  "Phone",
  "Email",
  "Service",
  "Property Type",
  "Project Location",
  "Project Description",
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
  "Consent",
  "Notification Status",
  "Assigned To",
  "Contacted At",
  "Estimate Status",
  "Notes",
];

const NOTIFICATION_COLUMN = HEADERS.indexOf("Notification Status") + 1;
const MAX_RETRIES_PER_RUN = 20;

function doPost(event) {
  try {
    const properties = PropertiesService.getScriptProperties();
    const payload = JSON.parse((event && event.postData && event.postData.contents) || "{}");
    const expectedSecret = properties.getProperty("LEAD_WEBHOOK_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonResponse_({ ok: false, error: "Unauthorized." });
    }

    const lead = payload.lead || {};
    validateLead_(lead);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    let isDuplicate = false;
    let notificationSent = false;
    try {
      const sheet = getLeadSheet_(properties);
      ensureHeaders_(sheet);
      let rowNumber = findLeadRow_(sheet, lead.leadId);
      isDuplicate = rowNumber > 0;

      if (!isDuplicate) {
        sheet.appendRow(leadToRow_(lead, "Pending"));
        rowNumber = sheet.getLastRow();
      }

      const notificationStatus = String(sheet.getRange(rowNumber, NOTIFICATION_COLUMN).getValue() || "");
      if (notificationStatus === "Sent") {
        notificationSent = true;
      } else {
        try {
          sendLeadEmail_(properties, lead, sheet);
          sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue("Sent");
          notificationSent = true;
        } catch (emailError) {
          const failedAt = new Date().toISOString();
          sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue("Failed — " + failedAt);
          console.error("Lead saved but notification email failed.", emailError);
        }
      }
    } finally {
      lock.releaseLock();
    }

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
    const sheet = getLeadSheet_(properties);
    ensureHeaders_(sheet);
    if (sheet.getLastRow() < 2) return;

    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
    let attempts = 0;

    rows.forEach(function (row, index) {
      if (attempts >= MAX_RETRIES_PER_RUN) return;
      const status = String(row[NOTIFICATION_COLUMN - 1] || "");
      if (status === "Sent") return;

      attempts += 1;
      const rowNumber = index + 2;
      try {
        sendLeadEmail_(properties, rowToLead_(row), sheet);
        sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue("Sent");
      } catch (error) {
        sheet.getRange(rowNumber, NOTIFICATION_COLUMN).setValue("Failed — " + new Date().toISOString());
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
  const spreadsheetId = properties.getProperty("SPREADSHEET_ID");
  const sheetName = properties.getProperty("SHEET_NAME") || "Estimate Leads";
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
  if (HEADERS.some(function (header, index) { return existing[index] !== header; })) {
    throw new Error("Sheet headers do not match the expected lead schema.");
  }
}

function findLeadRow_(sheet, leadId) {
  if (sheet.getLastRow() < 2) return 0;
  const match = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(leadId)
    .matchEntireCell(true)
    .findNext();
  return match ? match.getRow() : 0;
}

function validateLead_(lead) {
  const required = [
    "leadId",
    "submittedAt",
    "fullName",
    "phone",
    "email",
    "serviceNeeded",
    "projectLocation",
    "projectDescription",
  ];

  required.forEach(function (field) {
    if (!lead[field] || typeof lead[field] !== "string") {
      throw new Error("Missing required lead field: " + field);
    }
  });

  if (lead.consent !== true) throw new Error("Consent is required.");
}

function leadToRow_(lead, notificationStatus) {
  return [
    safeCell_(lead.leadId),
    safeCell_(lead.submittedAt),
    "New",
    safeCell_(lead.fullName),
    safeCell_(lead.companyProperty),
    safeCell_(lead.phone),
    safeCell_(lead.email),
    safeCell_(lead.serviceNeeded),
    safeCell_(lead.propertyType),
    safeCell_(lead.projectLocation),
    safeCell_(lead.projectDescription),
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
    lead.consent === true ? "Yes" : "No",
    notificationStatus,
    "",
    "",
    "",
    "",
  ];
}

function rowToLead_(row) {
  return {
    leadId: String(row[0] || ""),
    submittedAt: String(row[1] || ""),
    fullName: String(row[3] || ""),
    companyProperty: String(row[4] || ""),
    phone: String(row[5] || ""),
    email: String(row[6] || ""),
    serviceNeeded: String(row[7] || ""),
    propertyType: String(row[8] || ""),
    projectLocation: String(row[9] || ""),
    projectDescription: String(row[10] || ""),
    projectTimeline: String(row[11] || ""),
    preferredContactMethod: String(row[12] || ""),
    preferredContactTime: String(row[13] || ""),
    referralSource: String(row[14] || ""),
    sourcePage: String(row[15] || ""),
    referrer: String(row[16] || ""),
    utmSource: String(row[17] || ""),
    utmMedium: String(row[18] || ""),
    utmCampaign: String(row[19] || ""),
    deviceType: String(row[20] || ""),
    consent: String(row[21] || "") === "Yes",
  };
}

function sendLeadEmail_(properties, lead, sheet) {
  const recipients = properties.getProperty("NOTIFY_EMAILS");
  if (!recipients) throw new Error("NOTIFY_EMAILS is not configured.");

  const subject = "New Voss Estimate Lead — " + lead.fullName + " — " + lead.serviceNeeded;
  const sheetUrl = sheet.getParent().getUrl();
  const plainBody = [
    "A new estimate request was submitted through the Voss website.",
    "",
    "Name: " + lead.fullName,
    "Company / property: " + (lead.companyProperty || "Not provided"),
    "Phone: " + lead.phone,
    "Email: " + lead.email,
    "Service: " + lead.serviceNeeded,
    "Property type: " + (lead.propertyType || "Not provided"),
    "Location: " + lead.projectLocation,
    "Timeline: " + (lead.projectTimeline || "Not provided"),
    "Preferred contact: " + (lead.preferredContactMethod || "No preference"),
    "Preferred time: " + (lead.preferredContactTime || "Not provided"),
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
    ["Company / property", lead.companyProperty || "Not provided"],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["Service", lead.serviceNeeded],
    ["Property type", lead.propertyType || "Not provided"],
    ["Location", lead.projectLocation],
    ["Timeline", lead.projectTimeline || "Not provided"],
    ["Preferred contact", lead.preferredContactMethod || "No preference"],
    ["Preferred time", lead.preferredContactTime || "Not provided"],
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
