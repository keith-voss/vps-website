import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TurnstileWidget from "@/components/TurnstileWidget";

interface EstimateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SubmissionState = "idle" | "submitting" | "success" | "error";

const fieldLabelClass = "mb-1.5 block text-sm font-semibold text-industrial-black";
const selectClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

function trackingValue(name: string) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

const EstimateModal = ({ open, onOpenChange }: EstimateModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const submissionRef = useRef(0);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadId, setLeadId] = useState("");
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const handleTurnstileToken = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  useEffect(() => {
    if (open) {
      setSubmissionState("idle");
      setErrorMessage("");
      setLeadId("");
      setSubmissionId(crypto.randomUUID());
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    } else {
      submissionRef.current += 1;
      abortRef.current?.abort();
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionState("submitting");
    setErrorMessage("");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const submissionId = submissionRef.current + 1;
    submissionRef.current = submissionId;

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      companyProperty: formData.get("companyProperty"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      serviceNeeded: formData.get("serviceNeeded"),
      propertyType: formData.get("propertyType"),
      projectLocation: formData.get("projectLocation"),
      projectDescription: formData.get("projectDescription"),
      projectTimeline: formData.get("projectTimeline"),
      preferredContactMethod: formData.get("preferredContactMethod"),
      preferredContactTime: formData.get("preferredContactTime"),
      referralSource: formData.get("referralSource"),
      consent: formData.get("consent") === "on",
      website: formData.get("website"),
      submissionId,
      sourcePage: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer,
      utmSource: trackingValue("utm_source"),
      utmMedium: trackingValue("utm_medium"),
      utmCampaign: trackingValue("utm_campaign"),
      turnstileToken,
    };

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);

      if (submissionRef.current !== submissionId) return;

      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.error || "We could not submit your request.");
      }

      setLeadId(result.leadId || "");
      setSubmissionState("success");
      formRef.current?.reset();
    } catch (error) {
      if (submissionRef.current !== submissionId || controller.signal.aborted) return;
      setSubmissionState("error");
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please try again.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        {submissionState === "success" ? (
          <div className="p-8 text-center sm:p-12">
            <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-green-600" aria-hidden="true" />
            <DialogTitle className="mb-3 text-2xl">Estimate request received</DialogTitle>
            <DialogDescription className="mx-auto max-w-lg text-base">
              Thank you. A member of the Voss Property Solutions team will contact you shortly.
            </DialogDescription>
            {leadId && <p className="mt-3 text-xs text-muted-foreground">Reference: {leadId}</p>}
            <Button className="mt-7" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b bg-industrial-black px-6 py-5 text-left sm:px-8">
              <DialogTitle className="text-2xl text-white">Request a Free Estimate</DialogTitle>
              <DialogDescription className="text-gray-300">
                Tell us about your property and project. Required fields are marked with an asterisk.
              </DialogDescription>
            </DialogHeader>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 px-6 pb-8 sm:px-8">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="estimate-website">Website</label>
                <input id="estimate-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <fieldset className="space-y-4">
                <legend className="text-lg font-bold text-industrial-black">Contact information</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-full-name">Full name *</label>
                    <Input id="estimate-full-name" name="fullName" autoComplete="name" maxLength={100} required />
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-company">Company or property name</label>
                    <Input id="estimate-company" name="companyProperty" autoComplete="organization" maxLength={160} />
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-phone">Phone *</label>
                    <Input id="estimate-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} required />
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-email">Email *</label>
                    <Input id="estimate-email" name="email" type="email" autoComplete="email" maxLength={160} required />
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-lg font-bold text-industrial-black">Project details</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-service">Service needed *</label>
                    <select id="estimate-service" name="serviceNeeded" className={selectClass} defaultValue="" required>
                      <option value="" disabled>Select a service</option>
                      <option>Lines & Stenciling</option>
                      <option>Warehouse Safety</option>
                      <option>ADA Compliance</option>
                      <option>Paving & Sealcoating</option>
                      <option>Curbs & Delineators</option>
                      <option>Custom Markings</option>
                      <option>Not sure / Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-property-type">Property type</label>
                    <select id="estimate-property-type" name="propertyType" className={selectClass} defaultValue="">
                      <option value="">Select a property type</option>
                      <option>Parking Lot</option>
                      <option>Warehouse / Industrial</option>
                      <option>Retail / Commercial</option>
                      <option>School / Campus</option>
                      <option>Healthcare Facility</option>
                      <option>Government / Municipal</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor="estimate-location">Project address or city *</label>
                  <Input id="estimate-location" name="projectLocation" autoComplete="street-address" maxLength={200} required />
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor="estimate-description">Brief project description *</label>
                  <Textarea
                    id="estimate-description"
                    name="projectDescription"
                    maxLength={2000}
                    minLength={10}
                    rows={4}
                    placeholder="What work is needed, approximate size, and any deadlines or safety concerns?"
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-timeline">Desired project timeline</label>
                    <select id="estimate-timeline" name="projectTimeline" className={selectClass} defaultValue="">
                      <option value="">Select a timeline</option>
                      <option>As soon as possible</option>
                      <option>Within 30 days</option>
                      <option>1–3 months</option>
                      <option>3+ months</option>
                      <option>Planning / budgeting</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-referral">How did you hear about us?</label>
                    <select id="estimate-referral" name="referralSource" className={selectClass} defaultValue="">
                      <option value="">Select an option</option>
                      <option>Google</option>
                      <option>Referral</option>
                      <option>Existing customer</option>
                      <option>Social media</option>
                      <option>Sign / vehicle</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="text-lg font-bold text-industrial-black">Contact preference</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-contact-method">Preferred contact method</label>
                    <select id="estimate-contact-method" name="preferredContactMethod" className={selectClass} defaultValue="">
                      <option value="">No preference</option>
                      <option>Phone</option>
                      <option>Email</option>
                      <option>Text message</option>
                    </select>
                  </div>
                  <div>
                    <label className={fieldLabelClass} htmlFor="estimate-contact-time">Preferred time to contact</label>
                    <Input id="estimate-contact-time" name="preferredContactTime" maxLength={100} placeholder="e.g. Weekday mornings" />
                  </div>
                </div>
              </fieldset>

              <label className="flex items-start gap-3 rounded-md border bg-muted/30 p-4 text-sm leading-relaxed">
                <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 accent-primary" />
                <span>I agree that Voss Property Solutions may contact me by phone, text, or email about this estimate request. *</span>
              </label>

              <TurnstileWidget onTokenChange={handleTurnstileToken} resetKey={turnstileResetKey} />

              {submissionState === "error" && (
                <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  {errorMessage} If the problem continues, call <a className="font-semibold underline" href="tel:+14439701440">443-970-1440</a>.
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a href="tel:+14439701440" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-industrial-black hover:text-primary">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Prefer to call? 443-970-1440
                </a>
                <Button type="submit" variant="cta" size="lg" disabled={submissionState === "submitting" || !turnstileToken}>
                  {submissionState === "submitting" && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  {submissionState === "submitting" ? "Submitting…" : "Request Free Estimate"}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EstimateModal;
