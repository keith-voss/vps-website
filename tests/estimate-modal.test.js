import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../src/components/EstimateModal.tsx", import.meta.url), "utf8");

test("shows success without awaiting the Apps Script POST or confirmation", () => {
  const dispatchIndex = source.indexOf("const postRequest = fetch(scriptUrl");
  const successIndex = source.indexOf('setSubmissionState("success")', dispatchIndex);
  const confirmationIndex = source.indexOf("void confirmLeadSaved", dispatchIndex);

  assert.ok(dispatchIndex >= 0, "expected a background POST dispatch");
  assert.ok(successIndex > dispatchIndex, "expected success after dispatch starts");
  assert.ok(confirmationIndex > successIndex, "expected confirmation to run after success is shown");
  assert.doesNotMatch(source, /await\s+fetch\(scriptUrl/);
});

test("keeps the background POST alive when the modal closes", () => {
  const dispatchStart = source.indexOf("const postRequest = fetch(scriptUrl");
  const dispatchEnd = source.indexOf("});", dispatchStart);
  const dispatchBlock = source.slice(dispatchStart, dispatchEnd);

  assert.match(dispatchBlock, /keepalive:\s*true/);
  assert.doesNotMatch(dispatchBlock, /signal:\s*controller\.signal/);
});

test("uses the requested customer-facing success message", () => {
  assert.match(source, /Thank you — request received/);
  assert.match(source, /will get back to you shortly/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
});

test("validates phone and email before dispatching the lead", () => {
  const validationIndex = source.indexOf("phoneInput.setCustomValidity");
  const dispatchIndex = source.indexOf("const postRequest = fetch(scriptUrl");

  assert.ok(validationIndex >= 0, "expected contact validation");
  assert.ok(validationIndex < dispatchIndex, "contact validation must run before dispatch");
  assert.match(source, /isValidUsPhoneNumber\(phone\)/);
  assert.match(source, /isValidEmailAddress\(email\)/);
  assert.match(source, /valid 10-digit U\.S\. phone number/);
  assert.match(source, /valid email address, including the domain/);
});

test("blocks common email-domain typos and suggests the correction", () => {
  assert.match(source, /"gmail\.con": "gmail\.com"/);
  assert.match(source, /domain\.endsWith\("\.con"\)/);
  assert.match(source, /That email domain looks mistyped\. Did you mean/);
});
