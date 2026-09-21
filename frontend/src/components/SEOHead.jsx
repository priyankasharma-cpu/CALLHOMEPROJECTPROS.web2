import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { siteConfig } from "../config/siteConfig";
export default function SEOHead({
  title,
  description,
  noindex = false,
  schema,
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    const fullTitle = `${title} | ${siteConfig.brandName}`;
    document.title = fullTitle;
    function meta(key, value, property = false) {
      let node = document.head.querySelector(
        `meta[${property ? "property" : "name"}="${key}"]`,
      );
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(property ? "property" : "name", key);
        document.head.appendChild(node);
      }
      node.content = value;
    }
    meta("description", description);
    meta("robots", noindex ? "noindex, follow" : "index, follow");
    meta("og:title", fullTitle, true);
    meta("og:description", description, true);
    meta("og:type", "website", true);
    meta("og:url", siteConfig.siteUrl + pathname, true);
    meta("og:site_name", siteConfig.brandName, true);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href =
      siteConfig.siteUrl +
      pathname.replace(/\/$/, "") +
      (pathname === "/" ? "/" : "");
    document.getElementById("page-schema")?.remove();
    const node = document.createElement("script");
    node.id = "page-schema";
    node.type = "application/ld+json";
    node.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": siteConfig.siteUrl + "/#organization",
          name: siteConfig.brandName,
          url: siteConfig.siteUrl,
          ...(siteConfig.phoneNumber
            ? { telephone: siteConfig.phoneNumber }
            : {}),
        },
        {
          "@type": "WebSite",
          name: siteConfig.brandName,
          url: siteConfig.siteUrl,
        },
        ...(schema ? (Array.isArray(schema) ? schema : [schema]) : []),
      ],
    });
    document.head.appendChild(node);
  }, [title, description, pathname, noindex, JSON.stringify(schema)]);
  return null;
}
