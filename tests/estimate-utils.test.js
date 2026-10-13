import test from "node:test";
import assert from "node:assert/strict";

import {
  buildLead,
  validateEstimatePayload,
} from "../api/estimate-utils.js";

const validPayload = {
  fullName: "  Jane Doe  ",
  phone: " (443) 555-0123 ",
  email: " JANE@EXAMPLE.COM ",
  serviceNeeded: "Warehouse Safety",
  projectLocation: "Baltimore, MD",
  projectDescription: "Repaint pedestrian lanes and loading zones.",
  consent: true,
  companyProperty: "Acme Distribution",
  propertyType: "Warehouse / Industrial",
  preferredContactMethod: "Phone",
  preferredContactTime: "Weekday mornings",
  projectTimeline: "Within 30 days",
  referralSource: "Google",
  sourcePage: "/services",
  referrer: "https://google.com/",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "warehouse-safety",
  website: "",
  submissionId: "11111111-2222-4333-8444-555555555555",
  turnstileToken: "verified-browser-token",
};

test("accepts and normalizes a valid estimate", () => {
  const result = validateEstimatePayload(validPayload);

  assert.equal(result.ok, true);
  assert.equal(result.data.fullName, "Jane Doe");
  assert.equal(result.data.email, "jane@example.com");
  assert.equal(result.data.phone, "(443) 555-0123");
  assert.equal(result.turnstileToken, "verified-browser-token");
});

test("rejects missing required fields and invalid consent", () => {
  const result = validateEstimatePayload({ ...validPayload, email: "", consent: false });

  assert.equal(result.ok, false);
  assert.match(result.error, /email/i);
});

test("rejects invalid email addresses", () => {
  const result = validateEstimatePayload({ ...validPayload, email: "not-an-email" });

  assert.equal(result.ok, false);
  assert.match(result.error, /email/i);
});

test("silently flags the honeypot", () => {
  const result = validateEstimatePayload({ ...validPayload, website: "spam.example" });

  assert.equal(result.ok, false);
  assert.equal(result.isSpam, true);
});

test("does not discard legitimate fast or autofilled submissions", () => {
  const result = validateEstimatePayload({ ...validPayload, formStartedAt: Date.now() });
  assert.equal(result.ok, true);
});

test("truncates oversized tracking metadata without blocking the lead", () => {
  const result = validateEstimatePayload({
    ...validPayload,
    sourcePage: "/services?campaign=" + "x".repeat(1_000),
    referrer: "https://example.com/" + "y".repeat(1_000),
  });

  assert.equal(result.ok, true);
  assert.equal(result.data.sourcePage.length, 500);
  assert.equal(result.data.referrer.length, 500);
});

test("buildLead creates a stable idempotent lead reference without the challenge token", () => {
  const validated = validateEstimatePayload(validPayload);
  assert.equal(validated.ok, true);

  const lead = buildLead(validated.data, {
    now: new Date("2026-10-13T15:00:00.000Z"),
    submissionId: validated.submissionId,
    userAgent: "Mozilla/5.0 (iPhone)",
  });

  assert.equal(lead.leadId, "VPS-11111111-2222-4333-8444-555555555555");
  assert.equal(lead.submittedAt, "2026-10-13T15:00:00.000Z");
  assert.equal(lead.status, "New");
  assert.equal(lead.deviceType, "Mobile");
  assert.equal("turnstileToken" in lead, false);
});

test("rejects a malformed idempotency reference", () => {
  const result = validateEstimatePayload({ ...validPayload, submissionId: "not-a-uuid" });
  assert.equal(result.ok, false);
  assert.match(result.error, /reference/i);
});
