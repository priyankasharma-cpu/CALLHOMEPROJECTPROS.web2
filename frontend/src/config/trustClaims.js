// Enable a claim only after the business supplies evidence and approves the wording.
export const trustClaims = [
  {
    value: "Call-first",
    label: "Project assistance",
    icon: "phone",
    verified: true,
    enabled: true,
  },
  {
    value: "Your choice",
    label: "No obligation to hire",
    icon: "shield",
    verified: true,
    enabled: true,
  },
  {
    value: "One place",
    label: "Multiple home services",
    icon: "home",
    verified: true,
    enabled: true,
  },
  {
    value: "Clear steps",
    label: "From idea to request",
    icon: "check",
    verified: true,
    enabled: true,
  },
  {
    value: "Available now",
    label: "Agents ready to help",
    icon: "phone",
    verified: false,
    enabled: false,
  },
  {
    value: "Under 60 seconds",
    label: "Average wait",
    icon: "clock",
    verified: false,
    enabled: false,
  },
  {
    value: "12,400+",
    label: "Screened pros",
    icon: "shield",
    verified: false,
    enabled: false,
  },
  {
    value: "50 states",
    label: "Service availability",
    icon: "home",
    verified: false,
    enabled: false,
  },
  {
    value: "Up to 40% off",
    label: "Eligible projects",
    icon: "check",
    verified: false,
    enabled: false,
  },
];
export const visibleTrustClaims = () =>
  trustClaims.filter((claim) => claim.enabled && claim.verified);
