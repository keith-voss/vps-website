import test from "node:test";
import assert from "node:assert/strict";

import handler from "../api/estimate.js";

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

function validRequest(overrides = {}) {
  const request = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0",
      "x-forwarded-for": "203.0.113.10",
    },
    body: {
      fullName: "Jane Doe",
      phone: "443-555-0123",
      email: "jane@example.com",
      serviceNeeded: "Warehouse Safety",
      projectLocation: "Baltimore, MD",
      projectDescription: "Repaint pedestrian lanes and loading zones.",
      consent: true,
      website: "",
      submissionId: "11111111-2222-4333-8444-555555555555",
      turnstileToken: "browser-challenge-token",
    },
  };
  return { ...request, ...overrides };
}

async function withConfiguredHandler(fetchImplementation, callback) {
  const originalFetch = globalThis.fetch;
  const previous = {
    GOOGLE_APPS_SCRIPT_URL: process.env.GOOGLE_APPS_SCRIPT_URL,
    LEAD_WEBHOOK_SECRET: process.env.LEAD_WEBHOOK_SECRET,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  };

  process.env.GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/test/exec";
  process.env.LEAD_WEBHOOK_SECRET = "test-secret";
  process.env.TURNSTILE_SECRET_KEY = "turnstile-secret";
  globalThis.fetch = fetchImplementation;

  try {
    await callback();
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

function okJson(body) {
  return {
    ok: true,
    status: 200,
    async json() { return body; },
  };
}

test("rejects unsupported methods", async () => {
  const response = mockResponse();
  await handler({ method: "GET", headers: {} }, response);
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "POST");
});

test("rejects requests without JSON content type", async () => {
  const response = mockResponse();
  await handler(validRequest({ headers: { "content-type": "text/plain" } }), response);
  assert.equal(response.statusCode, 415);
});

test("reports unavailable when server configuration is missing", async () => {
  const previous = {
    GOOGLE_APPS_SCRIPT_URL: process.env.GOOGLE_APPS_SCRIPT_URL,
    LEAD_WEBHOOK_SECRET: process.env.LEAD_WEBHOOK_SECRET,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  };
  delete process.env.GOOGLE_APPS_SCRIPT_URL;
  delete process.env.LEAD_WEBHOOK_SECRET;
  delete process.env.TURNSTILE_SECRET_KEY;

  try {
    const response = mockResponse();
    await handler(validRequest(), response);
    assert.equal(response.statusCode, 503);
    assert.equal(response.body.ok, false);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("requires a browser challenge token", async () => {
  await withConfiguredHandler(async () => {
    throw new Error("fetch should not be called");
  }, async () => {
    const request = validRequest();
    request.body.turnstileToken = "";
    const response = mockResponse();
    await handler(request, response);
    assert.equal(response.statusCode, 400);
    assert.match(response.body.error, /security check/i);
  });
});

test("rejects a failed Turnstile verification", async () => {
  await withConfiguredHandler(async () => okJson({ success: false }), async () => {
    const response = mockResponse();
    await handler(validRequest(), response);
    assert.equal(response.statusCode, 400);
    assert.match(response.body.error, /security verification failed/i);
  });
});

test("forwards a verified lead and returns its reference", async () => {
  let forwardedBody;
  let fetchCount = 0;

  await withConfiguredHandler(async (url, options) => {
    fetchCount += 1;
    if (String(url).includes("turnstile")) return okJson({ success: true });

    forwardedBody = JSON.parse(options.body);
    return okJson({
      ok: true,
      leadId: forwardedBody.lead.leadId,
      notificationSent: true,
    });
  }, async () => {
    const response = mockResponse();
    await handler(validRequest(), response);
    assert.equal(response.statusCode, 201);
    assert.equal(response.body.ok, true);
    assert.equal(response.body.leadId, forwardedBody.lead.leadId);
    assert.equal(forwardedBody.secret, "test-secret");
    assert.equal(forwardedBody.lead.status, "New");
    assert.equal(forwardedBody.lead.leadId, "VPS-11111111-2222-4333-8444-555555555555");
    assert.equal("turnstileToken" in forwardedBody.lead, false);
    assert.equal(fetchCount, 2);
  });
});

test("returns a safe error when Apps Script rejects the lead", async () => {
  await withConfiguredHandler(async (url) => {
    if (String(url).includes("turnstile")) return okJson({ success: true });
    return { ok: false, status: 500, async json() { return { ok: false }; } };
  }, async () => {
    const response = mockResponse();
    await handler(validRequest(), response);
    assert.equal(response.statusCode, 502);
    assert.equal(response.body.ok, false);
    assert.doesNotMatch(response.body.error, /secret|stack|script\.google/i);
  });
});

test("returns a safe error for a malformed Apps Script response", async () => {
  await withConfiguredHandler(async (url) => {
    if (String(url).includes("turnstile")) return okJson({ success: true });
    return { ok: true, status: 200, async json() { throw new Error("invalid json"); } };
  }, async () => {
    const response = mockResponse();
    await handler(validRequest(), response);
    assert.equal(response.statusCode, 502);
    assert.equal(response.body.ok, false);
  });
});

test("returns a safe error when the upstream request times out", async () => {
  let fetchCount = 0;
  await withConfiguredHandler(async (url) => {
    fetchCount += 1;
    if (String(url).includes("turnstile")) return okJson({ success: true });
    const error = new Error("timed out");
    error.name = "TimeoutError";
    throw error;
  }, async () => {
    const response = mockResponse();
    await handler(validRequest(), response);
    assert.equal(response.statusCode, 502);
    assert.equal(response.body.ok, false);
    assert.equal(fetchCount, 2);
  });
});
