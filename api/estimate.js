import { buildLead, validateEstimatePayload } from "./estimate-utils.js";

const MAX_BODY_BYTES = 24_000;
const UPSTREAM_TIMEOUT_MS = 10_000;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function sendJson(response, status, body) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json(body);
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { ok: false, error: "Method not allowed." });
  }

  const contentType = request.headers["content-type"] || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return sendJson(response, 415, { ok: false, error: "Content-Type must be application/json." });
  }

  const rawSize = Buffer.byteLength(JSON.stringify(request.body ?? {}), "utf8");
  if (rawSize > MAX_BODY_BYTES) {
    return sendJson(response, 413, { ok: false, error: "Request is too large." });
  }

  const result = validateEstimatePayload(request.body);
  if (!result.ok) {
    if (result.isSpam) {
      return sendJson(response, 200, { ok: true, message: "Your request has been received." });
    }
    return sendJson(response, 400, { ok: false, error: result.error });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  const webhookSecret = process.env.LEAD_WEBHOOK_SECRET;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!scriptUrl || !webhookSecret || !turnstileSecret) {
    console.error("Estimate intake is missing server configuration.");
    return sendJson(response, 503, {
      ok: false,
      error: "Estimate requests are temporarily unavailable. Please call 443-970-1440.",
    });
  }

  if (!result.turnstileToken) {
    return sendJson(response, 400, { ok: false, error: "Complete the security check and try again." });
  }

  try {
    const forwardedFor = request.headers["x-forwarded-for"] || "";
    const remoteIp = String(forwardedFor).split(",")[0].trim();
    const verificationBody = new URLSearchParams({
      secret: turnstileSecret,
      response: result.turnstileToken,
    });
    if (remoteIp) verificationBody.set("remoteip", remoteIp);

    const verification = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verificationBody,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
    const verificationResult = await verification.json().catch(() => null);
    if (!verification.ok || verificationResult?.success !== true) {
      return sendJson(response, 400, { ok: false, error: "Security verification failed. Please try again." });
    }
  } catch (error) {
    console.error("Turnstile verification failed.", {
      name: error instanceof Error ? error.name : "UnknownError",
    });
    return sendJson(response, 502, { ok: false, error: "Security verification is temporarily unavailable." });
  }

  const lead = buildLead(result.data, {
    submissionId: result.submissionId,
    userAgent: request.headers["user-agent"] || "",
  });

  try {
    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: webhookSecret, lead }),
      redirect: "follow",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const upstreamBody = await upstream.json().catch(() => null);
    if (!upstream.ok || upstreamBody?.ok !== true || upstreamBody?.leadId !== lead.leadId) {
      console.error("Google Apps Script rejected estimate lead.", {
        status: upstream.status,
        leadId: lead.leadId,
      });
      return sendJson(response, 502, {
        ok: false,
        error: "We could not save your request. Please try again or call 443-970-1440.",
      });
    }

    if (upstreamBody.notificationSent === false) {
      console.warn("Estimate lead saved; notification email is queued for retry.", {
        leadId: lead.leadId,
      });
    }

    return sendJson(response, 201, {
      ok: true,
      leadId: lead.leadId,
      message: "Your estimate request has been received.",
    });
  } catch (error) {
    console.error("Estimate intake upstream request failed.", {
      name: error instanceof Error ? error.name : "UnknownError",
      leadId: lead.leadId,
    });
    return sendJson(response, 502, {
      ok: false,
      error: "We could not save your request. Please try again or call 443-970-1440.",
    });
  }
}
