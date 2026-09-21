import { PhoneCall, ArrowUpRight } from "lucide-react";
import { phoneHref, siteConfig } from "../config/siteConfig";
import { track } from "../utils/tracking";

export default function CallCTA({
  location = "page_call",
  service,
  compact = false,
  variant,
  label = "Call for a Free Estimate",
  className = "",
  numberFirst = false,
}) {
  const style =
    variant ||
    (location === "navbar_call"
      ? "navbar"
      : location === "mobile_sticky_call"
        ? "mobile"
        : location === "footer_call"
          ? "footer"
          : compact
            ? "navbar"
            : "section");
  const content = (
    <>
      <span className="call-icon">
        <PhoneCall size={style === "hero" ? 29 : 23} />
      </span>
      <span className="call-text">
        <strong>
          {numberFirst && phoneHref
            ? siteConfig.phoneNumber
            : compact
              ? "Call Now"
              : label}
        </strong>
        <small>
          {phoneHref
            ? numberFirst
              ? "Talk to a Home Project Specialist"
              : siteConfig.phoneNumber
            : "Phone line coming soon"}
        </small>
      </span>
      {!compact && <ArrowUpRight className="call-arrow" size={20} />}
    </>
  );
  const classes = `call-cta call-${style} ${compact ? "compact" : ""} ${className}`;
  return phoneHref ? (
    <a
      href={phoneHref}
      className={classes}
      aria-label={`${label}: ${siteConfig.phoneNumber}`}
      onClick={() => {
        track("phone_click", { location, service });
        if (location === "hero_call")
          track("hero_phone_click", { location, service });
        if (location === "mobile_sticky_call")
          track("sticky_phone_click", { location, service });
      }}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      className={classes}
      disabled
      aria-label="Phone assistance is not available yet"
    >
      {content}
    </button>
  );
}
