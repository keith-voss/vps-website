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
  phone: "443-555-0123",
  email: "JANE@EXAMPLE.COM",
  serviceNeeded: "Warehouse Safety",
  projectLocation: "Baltimore, MD",
  projectDescription: "Repaint pedestrian lanes and loading zones.",
  consent: true,
  companyProperty: "Acme Distribution",
  propertyType: "Warehouse / Industrial",
  projectTimeline: "Within 30 days",
  preferredContactMethod: "Phone",
  preferredContactTime: "Weekday mornings",
  referralSource: "Google",
  sourcePage: "/services",
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

test("matches the existing seven Sheet columns before operational fields", () => {
  const lead = context.normalizeLead_(rawLead);
  const row = context.leadToRow_(lead, "Pending");

  assert.deepEqual(Array.from(row.slice(0, 7)), [
    "Jane Doe",
    "443-555-0123",
    "jane@example.com",
    "Warehouse Safety",
    "Baltimore, MD",
    "Repaint pedestrian lanes and loading zones.",
    "Yes",
  ]);
  assert.equal(row[7], "VPS-11111111-2222-4333-8444-555555555555");
  assert.equal(row[22], "Pending");
});

test("round-trips rows for notification retries", () => {
  const lead = context.normalizeLead_(rawLead);
  const restored = context.rowToLead_(context.leadToRow_(lead, "Failed"));

  assert.equal(restored.leadId, lead.leadId);
  assert.equal(restored.fullName, lead.fullName);
  assert.equal(restored.projectLocation, lead.projectLocation);
  assert.equal(restored.consent, true);
});
