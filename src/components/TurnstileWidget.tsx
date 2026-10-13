import { useEffect, useRef, useState } from "react";

interface TurnstileWidgetProps {
  onTokenChange: (token: string) => void;
  resetKey: number;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_ID = "cloudflare-turnstile-script";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstileScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile failed to load.")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Turnstile failed to load."));
    document.head.appendChild(script);
  });
}

const TurnstileWidget = ({ onTokenChange, resetKey }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useEffect(() => {
    let active = true;
    let widgetId = "";
    onTokenChange("");
    setLoadError(false);

    if (!siteKey) {
      setLoadError(true);
      return () => { active = false; };
    }

    loadTurnstileScript()
      .then(() => {
        if (!active || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onTokenChange(token),
          "expired-callback": () => onTokenChange(""),
          "error-callback": () => {
            onTokenChange("");
            setLoadError(true);
          },
          theme: "light",
        });
      })
      .catch(() => {
        if (active) setLoadError(true);
      });

    return () => {
      active = false;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [onTokenChange, resetKey, siteKey]);

  return (
    <div>
      <div ref={containerRef} />
      {loadError && (
        <p role="alert" className="text-sm text-red-700">
          Security verification is unavailable. Refresh the page or call 443-970-1440.
        </p>
      )}
    </div>
  );
};

export default TurnstileWidget;
