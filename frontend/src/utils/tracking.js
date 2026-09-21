const keys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
];
let attribution;
export function getAttribution() {
  if (typeof window === "undefined") return {};
  if (attribution) return attribution;
  try {
    attribution = JSON.parse(
      sessionStorage.getItem("chpp_attribution") || "null",
    );
  } catch {
    /* Storage can be restricted. */
  }
  if (!attribution) {
    const params = new URLSearchParams(window.location.search);
    attribution = {
      landingPage: window.location.pathname,
      referrer: document.referrer.slice(0, 1000),
    };
    keys.forEach((key) => {
      if (params.has(key))
        attribution[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] =
          params.get(key).slice(0, 500);
    });
    try {
      sessionStorage.setItem("chpp_attribution", JSON.stringify(attribution));
    } catch {
      /* In-memory attribution remains available. */
    }
  }
  return attribution;
}
export function track(event, properties = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page: window.location.pathname,
    ...getAttribution(),
    ...properties,
  });
}
