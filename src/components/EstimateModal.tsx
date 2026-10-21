import { FormEvent, useEffect, useRef, useState } from "react";
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

interface EstimateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SubmissionState = "idle" | "submitting" | "success" | "error";

const fieldLabelClass = "mb-1.5 block text-sm font-semibold text-industrial-black";

function trackingValue(name: string) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

interface LeadStatus {
  stored?: boolean;
  leadId?: string;
}

function jsonpLeadStatus(scriptUrl: string, submissionId: string, signal: AbortSignal) {
  return new Promise<LeadStatus>((resolve, reject) => {
    const callbackName = `vpsLeadStatus_${crypto.randomUUID().replace(/-/g, "")}`;
    const script = document.createElement("script");
    const callbacks = window as unknown as Record<string, unknown>;
    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("Lead-status confirmation timed out."));
    }, 5_000);

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      script.remove();
      delete callbacks[callbackName];
      signal.removeEventListener("abort", handleAbort);
    };
    const handleAbort = () => {
      cleanup();
      reject(new DOMException("Request cancelled", "AbortError"));
    };

    callbacks[callbackName] = (result: LeadStatus) => {
      cleanup();
      resolve(result);
    };
    script.onerror = () => {
      cleanup();
      reject(new Error("Could not confirm the saved request."));
    };
    signal.addEventListener("abort", handleAbort, { once: true });

    const url = new URL(scriptUrl);
    url.searchParams.set("action", "status");
    url.searchParams.set("submissionId", submissionId);
    url.searchParams.set("callback", callbackName);
    script.src = url.toString();
    document.head.appendChild(script);
  });
}

async function confirmLeadSaved(scriptUrl: string, submissionId: string, signal: AbortSignal) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    let result: LeadStatus = {};
    try {
      result = await jsonpLeadStatus(scriptUrl, submissionId, signal);
    } catch (error) {
      if (signal.aborted) throw error;
    }
    if (result.stored && result.leadId) return result;
    await new Promise<void>((resolve, reject) => {
      const handleAbort = () => {
        window.clearTimeout(timer);
        reject(new DOMException("Request cancelled", "AbortError"));
      };
      const timer = window.setTimeout(() => {
        signal.removeEventListener("abort", handleAbort);
        resolve();
      }, 1_000);
      signal.addEventListener("abort", handleAbort, { once: true });
    });
  }
  throw new Error("We could not confirm that your request was saved. Please try again or call 443-970-1440.");
}

function detectDevice() {
  if (/tablet|ipad/i.test(navigator.userAgent)) return "Tablet";
  if (/mobile|iphone|android/i.test(navigator.userAgent)) return "Mobile";
  return "Desktop";
}

const EstimateModal = ({ open, onOpenChange }: EstimateModalProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const submissionRef = useRef(0);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [leadId, setLeadId] = useState("");
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    if (open) {
      setSubmissionState("idle");
      setErrorMessage("");
      setLeadId("");
      setSubmissionId(crypto.randomUUID());
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
    const submissionAttempt = submissionRef.current + 1;
    submissionRef.current = submissionAttempt;

    const scriptUrl = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string | undefined;
    if (!scriptUrl) {
      setSubmissionState("error");
      setErrorMessage("Estimate intake is not configured. Please call 443-970-1440.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const lead = {
      fullName: formData.get("fullName"),
      companyProperty: formData.get("companyProperty"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      projectLocation: formData.get("projectLocation"),
      projectDescription: formData.get("projectDescription"),
      website: formData.get("website"),
      submissionId,
      sourcePage: `${window.location.pathname}${window.location.search}`,
      referrer: document.referrer,
      utmSource: trackingValue("utm_source"),
      utmMedium: trackingValue("utm_medium"),
      utmCampaign: trackingValue("utm_campaign"),
      deviceType: detectDevice(),
    };

    // Dispatch the opaque Apps Script request, then release the visitor immediately.
    // Apps Script may continue persisting the row and sending email after this modal
    // has shown success, so the POST must not be tied to the modal's abort signal.
    const postRequest = fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ lead }),
      mode: "no-cors",
      keepalive: true,
    });

    setSubmissionState("success");
    formRef.current?.reset();

    // Confirmation is useful for attaching the reference number, but it is not
    // allowed to hold the visitor on the form or replace success with a false error.
    void confirmLeadSaved(scriptUrl, submissionId, controller.signal)
      .then((result) => {
        if (submissionRef.current !== submissionAttempt || controller.signal.aborted) return;
        setLeadId(result.leadId || "");
      })
      .catch((error) => {
        if (!controller.signal.aborted) console.warn("Lead confirmation is still pending.", error);
      });

    void postRequest.catch((error) => {
      console.error("Lead dispatch failed after the form was accepted.", error);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        {submissionState === "success" ? (
          <div className="p-8 text-center sm:p-12" role="status" aria-live="polite">
            <CheckCircle2 className="mx-auto mb-5 h-14 w-14 text-green-600" aria-hidden="true" />
            <DialogTitle className="mb-3 text-2xl">Thank you — request received</DialogTitle>
            <DialogDescription className="mx-auto max-w-lg text-base">
              Your estimate request is being processed. A member of the Voss Property Solutions team will get back to you shortly.
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
                    <label className={fieldLabelClass} htmlFor="estimate-company">Company name *</label>
                    <Input id="estimate-company" name="companyProperty" autoComplete="organization" maxLength={160} required />
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
                <legend className="text-lg font-bold text-industrial-black">Work details</legend>
                <div>
                  <label className={fieldLabelClass} htmlFor="estimate-location">Address *</label>
                  <Input id="estimate-location" name="projectLocation" autoComplete="street-address" maxLength={200} required />
                </div>
                <div>
                  <label className={fieldLabelClass} htmlFor="estimate-description">Brief description of work *</label>
                  <Textarea
                    id="estimate-description"
                    name="projectDescription"
                    maxLength={2000}
                    minLength={10}
                    rows={4}
                    placeholder="Tell us what work you need completed."
                    required
                  />
                </div>
              </fieldset>

              <p className="rounded-md border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                By submitting this request, you are asking Voss Property Solutions to contact you about this estimate.
              </p>

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
                <Button type="submit" variant="cta" size="lg" disabled={submissionState === "submitting"}>
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
