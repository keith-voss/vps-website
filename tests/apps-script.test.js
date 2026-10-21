import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../google-apps-script/Code.gs", import.meta.url), "utf8");
const context = vm.createContext({ console, Date, JSON, RegExp, String });
vm.runInContext(source, context);

const submissionId = "11111111-2222-4333-8444-555555555555";
const rawLead = {
  submissionId,
  fullName: " Jane Doe ",
  companyProperty: "Acme Distribution",
  phone: "443-555-0123",
  email: "JANE@EXAMPLE.COM",
  projectLocation: "100 Main Street, Baltimore, MD",
  projectDescription: "Repaint pedestrian lanes and loading zones.",
  referralSource: "Google",
  sourcePage: "/services",
  referrer: "https://google.com/",
  deviceType: "Mobile",
};

test("creates a stable lead ID from the browser submission UUID", () => {
  assert.equal(
    context.leadIdFromSubmissionId_(submissionId),
    "VPS-11111111-2222-4333-8444-555555555555",
  );
  assert.equal(context.leadIdFromSubmissionId_("not-a-uuid"), "");
});

test("normalizes and validates a direct browser lead", () => {
  const lead = context.normalizeLead_(rawLead);
  context.validateLead_(lead);

  assert.equal(lead.fullName, "Jane Doe");
  assert.equal(lead.email, "jane@example.com");
  assert.equal(lead.leadId, "VPS-11111111-2222-4333-8444-555555555555");
  assert.equal(lead.status, "New");
});

test("accepts Keith's six-field estimate request", () => {
  const lead = context.normalizeLead_({
    submissionId,
    fullName: "Jane Doe",
    companyProperty: "Acme Distribution",
    projectLocation: "100 Main Street, Baltimore, MD",
    phone: "443-555-0123",
    email: "jane@example.com",
    projectDescription: "Restripe the employee parking lot.",
  });

  assert.doesNotThrow(() => context.validateLead_(lead));
  const row = context.leadToRow_(lead, "Pending");
  assert.equal(row[1], "Acme Distribution");
  assert.equal(row[4], "100 Main Street, Baltimore, MD");
  assert.equal(row[15], "Pending");
  assert.equal(row.length, 16);
});

test("enforces the description minimum on direct posts", () => {
  const baseLead = {
    submissionId,
    fullName: "Jane Doe",
    companyProperty: "Acme Distribution",
    projectLocation: "100 Main Street, Baltimore, MD",
    phone: "443-555-0123",
    email: "jane@example.com",
  };

  assert.throws(
    () => context.validateLead_(context.normalizeLead_({ ...baseLead, projectDescription: "123456789" })),
    /at least 10 characters/,
  );
  assert.doesNotThrow(
    () => context.validateLead_(context.normalizeLead_({ ...baseLead, projectDescription: "1234567890" })),
  );
});

test("matches the live sixteen-column Sheet schema", () => {
  const lead = context.normalizeLead_(rawLead);
  const row = context.leadToRow_(lead, "Pending");

  const headers = vm.runInContext("HEADERS", context);
  assert.deepEqual(Array.from(headers), [
    "Full Name",
    "Company Name",
    "Phone number",
    "Email",
    "Address",
    "Brief Project Description",
    "Lead ID",
    "Submitted At",
    "Status",
    "Referral Source",
    "Referrer",
    "UTM Source",
    "UTM Medium",
    "UTM Campaign",
    "Device Type",
    "Notification Status",
  ]);
  assert.deepEqual(Array.from(row), [
    "Jane Doe",
    "Acme Distribution",
    "443-555-0123",
    "jane@example.com",
    "100 Main Street, Baltimore, MD",
    "Repaint pedestrian lanes and loading zones.",
    "VPS-11111111-2222-4333-8444-555555555555",
    lead.submittedAt,
    "New",
    "Google",
    "https://google.com/",
    "",
    "",
    "",
    "Mobile",
    "Pending",
  ]);
});

test("round-trips rows for notification retries", () => {
  const lead = context.normalizeLead_(rawLead);
  const restored = context.rowToLead_(context.leadToRow_(lead, "Failed"));

  assert.equal(restored.leadId, lead.leadId);
  assert.equal(restored.fullName, lead.fullName);
  assert.equal(restored.companyProperty, lead.companyProperty);
  assert.equal(restored.projectLocation, lead.projectLocation);
  assert.equal(restored.referrer, lead.referrer);
});

test("emails all six requested fields", () => {
  let sentEmail;
  context.MailApp = { sendEmail: (message) => { sentEmail = message; } };
  const lead = context.normalizeLead_({
    submissionId,
    fullName: "Jane Doe",
    companyProperty: "Acme Distribution",
    projectLocation: "100 Main Street, Baltimore, MD",
    phone: "443-555-0123",
    email: "jane@example.com",
    projectDescription: "Restripe the employee parking lot.",
  });
  const properties = { getProperty: () => "keith@example.com" };
  const sheet = { getParent: () => ({ getUrl: () => "https://example.com/sheet" }) };

  context.sendLeadEmail_(properties, lead, sheet);

  [lead.fullName, lead.companyProperty, lead.projectLocation, lead.phone, lead.email, lead.projectDescription]
    .forEach((value) => {
      assert.match(sentEmail.body, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      assert.match(sentEmail.htmlBody, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    });
  assert.equal(sentEmail.to, "keith@example.com");
  assert.equal(sentEmail.replyTo, lead.email);
});

test("publishes stored status before starting the notification email", () => {
  const postStart = source.indexOf("function doPost(event)");
  const postEnd = source.indexOf("function setupLeadSheet()", postStart);
  const doPostSource = source.slice(postStart, postEnd);
  const earlyStatus = doPostSource.indexOf("cacheLeadStatus_(lead.submissionId");
  const emailSend = doPostSource.indexOf("sendLeadEmail_(properties");

  assert.ok(earlyStatus >= 0, "doPost must publish a stored status");
  assert.ok(emailSend >= 0, "doPost must send the notification email");
  assert.ok(earlyStatus < emailSend, "stored status must be visible before email delivery begins");
});
