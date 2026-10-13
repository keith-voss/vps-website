import { randomUUID as cryptoRandomUUID } from "node:crypto";

const REQUIRED_TEXT_FIELDS = [
  ["fullName", "Full name", 2, 100],
  ["phone", "Phone", 7, 40],
  ["email", "Email", 5, 160],
  ["serviceNeeded", "Service needed", 2, 100],
  ["projectLocation", "Project location", 2, 200],
  ["projectDescription", "Project description", 10, 2000],
];

const OPTIONAL_LIMITS = {
  companyProperty: 160,
  propertyType: 100,
  preferredContactMethod: 30,
  preferredContactTime: 100,
  projectTimeline: 100,
  referralSource: 100,
};

const METADATA_LIMITS = {
  sourcePage: 500,
  referrer: 500,
  utmSource: 200,
  utmMedium: 200,
  utmCampaign: 200,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const URL_SPAM_PATTERN = /(?:https?:\/\/|www\.)/gi;

const cleanText = (value) => typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

export function validateEstimatePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Invalid request body." };
  }

  if (cleanText(payload.website)) {
    return { ok: false, error: "Invalid submission.", isSpam: true };
  }

  const data = {};

  const submissionId = cleanText(payload.submissionId);
  if (!UUID_PATTERN.test(submissionId)) {
    return { ok: false, error: "Invalid submission reference." };
  }
  for (const [key, label, min, max] of REQUIRED_TEXT_FIELDS) {
    const value = cleanText(payload[key]);
    if (value.length < min) {
      return { ok: false, error: `${label} is required.` };
    }
    if (value.length > max) {
      return { ok: false, error: `${label} is too long.` };
    }
    data[key] = value;
  }

  data.email = data.email.toLowerCase();
  if (!EMAIL_PATTERN.test(data.email)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const phoneDigits = data.phone.replace(/\D/g, "");
  if (phoneDigits.length < 7 || phoneDigits.length > 15) {
    return { ok: false, error: "Enter a valid phone number." };
  }

  if (payload.consent !== true) {
    return { ok: false, error: "Consent is required so Voss can respond to your request." };
  }
  data.consent = true;

  for (const [key, max] of Object.entries(OPTIONAL_LIMITS)) {
    const value = cleanText(payload[key]);
    if (value.length > max) {
      return { ok: false, error: `${key} is too long.` };
    }
    data[key] = value;
  }

  for (const [key, max] of Object.entries(METADATA_LIMITS)) {
    data[key] = cleanText(payload[key]).slice(0, max);
  }

  const linkCount = (data.projectDescription.match(URL_SPAM_PATTERN) || []).length;
  if (linkCount > 1) {
    return { ok: false, error: "Invalid submission.", isSpam: true };
  }

  return {
    ok: true,
    data,
    submissionId: submissionId.toLowerCase(),
    turnstileToken: cleanText(payload.turnstileToken).slice(0, 2048),
  };
}

function detectDevice(userAgent = "") {
  if (/tablet|ipad/i.test(userAgent)) return "Tablet";
  if (/mobile|iphone|android/i.test(userAgent)) return "Mobile";
  return "Desktop";
}

export function buildLead(data, options = {}) {
  const now = options.now || new Date();
  const submissionId = options.submissionId || cryptoRandomUUID();

  return {
    leadId: `VPS-${submissionId.toUpperCase()}`,
    submittedAt: now.toISOString(),
    status: "New",
    ...data,
    deviceType: detectDevice(options.userAgent),
  };
}
