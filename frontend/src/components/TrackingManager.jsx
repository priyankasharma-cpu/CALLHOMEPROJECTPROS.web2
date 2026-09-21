import { useEffect, useState } from "react";
import { getAttribution } from "../utils/tracking";
const env = import.meta.env;
const configured = Boolean(
  env.VITE_GTM_ID ||
  env.VITE_GA_ID ||
  env.VITE_META_PIXEL_ID ||
  env.VITE_MICROSOFT_ADS_ID,
);
function script(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const node = document.createElement("script");
  node.src = src;
  node.async = true;
  document.head.appendChild(node);
}
export default function TrackingManager() {
  const [consent, setConsent] = useState(() => {
    try {
      return localStorage.getItem("chpp_measurement");
    } catch {
      return null;
    }
  });
  useEffect(() => {
    getAttribution();
  }, []);
  useEffect(() => {
    if (consent !== "accepted" || !configured) return;
    window.dataLayer = window.dataLayer || [];
    if (/^GTM-[A-Z0-9]+$/.test(env.VITE_GTM_ID || "")) {
      window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      script(`https://www.googletagmanager.com/gtm.js?id=${env.VITE_GTM_ID}`);
    } else if (/^G-[A-Z0-9]+$/.test(env.VITE_GA_ID || "")) {
      window.gtag =
        window.gtag ||
        function () {
          window.dataLayer.push(arguments);
        };
      script(`https://www.googletagmanager.com/gtag/js?id=${env.VITE_GA_ID}`);
      window.gtag("js", new Date());
      window.gtag("config", env.VITE_GA_ID);
    }
    // Meta and Microsoft IDs are reserved for deployment-specific, approved tag-manager setup.
  }, [consent]);
  const choose = (value) => {
    setConsent(value);
    try {
      localStorage.setItem("chpp_measurement", value);
    } catch {
      /* Choice remains in memory. */
    }
  };
  return configured && !consent ? (
    <div
      className="cookie-panel"
      role="region"
      aria-label="Optional measurement"
    >
      <p>
        Allow optional measurement tools to help us understand how this site is
        used? You can continue without them.
      </p>
      <button className="button secondary" onClick={() => choose("declined")}>
        Decline
      </button>
      <button className="button primary" onClick={() => choose("accepted")}>
        Allow
      </button>
    </div>
  ) : null;
}
