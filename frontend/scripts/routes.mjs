import { services } from "../src/data/services.js";
import { costGuides, resources } from "../src/data/guides.js";
export const routes = [
  {
    path: "/",
    title: "Your Home Project Starts With One Call",
    description:
      "Explore home services, get practical project guidance, and request a free estimate. Your next home improvement starts with a conversation.",
  },
  {
    path: "/services",
    title: "Explore Home Services",
    description:
      "Explore roofing, HVAC, windows, plumbing, remodeling, and more. Plan your home project and request an estimate.",
  },
  ...services.map((s) => ({
    path: `/services/${s.slug}`,
    title: s.seoTitle,
    description: s.seoDescription,
    schema: {
      "@type": "Service",
      name: `${s.title} project connection`,
      description: s.seoDescription,
    },
  })),
  {
    path: "/cost-guides",
    title: "Home Project Cost Guides",
    description:
      "Understand the factors behind home project estimates, compare scopes, and plan without unverified pricing.",
  },
  {
    path: "/resources",
    title: "Homeowner Guides",
    description:
      "Practical guides for planning home improvements, evaluating options, and asking useful questions.",
  },
  ...costGuides.map((g) => ({
    path: `/cost-guides/${g.slug}`,
    title: g.title,
    description: g.intro,
    schema: {
      "@type": "Article",
      headline: g.title,
      description: g.intro,
      author: { "@type": "Organization", name: "Call Home Project Pros" },
    },
  })),
  ...resources.map((g) => ({
    path: `/resources/${g.slug}`,
    title: g.title,
    description: g.intro,
    schema: {
      "@type": "Article",
      headline: g.title,
      description: g.intro,
      author: { "@type": "Organization", name: "Call Home Project Pros" },
    },
  })),
  {
    path: "/about",
    title: "About Call Home Project Pros",
    description:
      "A transparent project connection platform helping homeowners explore services and take the next step.",
  },
  {
    path: "/how-it-works",
    title: "How Project Requests Work",
    description:
      "Learn what to expect when exploring services, requesting an estimate, and speaking with a provider.",
  },
  {
    path: "/contact",
    title: "Contact Call Home Project Pros",
    description:
      "Explore phone assistance, project requests, and general inquiry options.",
  },
  {
    path: "/faq",
    title: "Frequently Asked Questions",
    description:
      "Answers about estimate requests, project services, provider availability, and the connection process.",
  },
  {
    path: "/quote",
    title: "Request a Home Project Estimate",
    description: "A step-by-step request for your next home project.",
    noindex: true,
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    description:
      "Policy publication status and business-specific details awaiting finalization.",
    noindex: true,
  },
  {
    path: "/terms",
    title: "Terms of Use",
    description:
      "Platform terms publication status and business-specific details awaiting finalization.",
    noindex: true,
  },
  {
    path: "/404",
    title: "Page Not Found",
    description: "Find your way back to home services and homeowner guides.",
    noindex: true,
  },
];
