import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Check, House, LockKeyhole, ShieldCheck, X } from "lucide-react";
import CallCTA from "../CallCTA";
import { getService } from "../../data/services";
import { phoneHref } from "../../config/siteConfig";
import { visibleTrustClaims } from "../../config/trustClaims";
import "./thank-you-modal.css";

export default function ThankYouModal({
  open,
  onClose,
  project,
  returnFocusRef,
}) {
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const canOpen = Boolean(open && project);
  useEffect(() => {
    if (!canOpen) return;
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    element.showModal();
    closeButton.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      const target =
        previousFocus?.isConnected && previousFocus !== document.body
          ? previousFocus
          : returnFocusRef?.current;
      target?.focus({ preventScroll: true });
    };
  }, [canOpen, returnFocusRef]);
  if (!canOpen || typeof document === "undefined") return null;
  const noObligation = visibleTrustClaims().some(
    (c) => c.label === "No obligation to hire",
  );
  return createPortal(
    <dialog
      ref={dialog}
      className="thank-you-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <button
        ref={closeButton}
        className="confirmation-close"
        type="button"
        aria-label="Close confirmation"
        onClick={onClose}
      >
        <X size={22} />
      </button>
      <div className="confirmation-content">
        <div className="confirmation-success" aria-hidden="true">
          <span>
            <Check size={38} strokeWidth={3} />
          </span>
          <i />
          <i />
          <i />
          <i />
        </div>
        <span className="confirmation-eyebrow">THANK YOU!</span>
        <h2 id={titleId}>
          {project.firstName
            ? `Thanks, ${project.firstName}!`
            : "Your request is in."}
        </h2>
        <p className="confirmation-received" id={descriptionId}>
          Your request has been submitted successfully.
        </p>
        <p className="confirmation-explanation">
          We've received your project information. Our team will review your
          request and help with the next step based on the details you provided.
        </p>
        <dl className="confirmation-summary">
          <div>
            <dt>Project</dt>
            <dd>{getService(project.service)?.title || project.service}</dd>
          </div>
          <div>
            <dt>ZIP</dt>
            <dd>{project.zip}</dd>
          </div>
          <div>
            <dt>Timeline</dt>
            <dd>{project.projectTimeline}</dd>
          </div>
        </dl>
        <div className="confirmation-status">
          <span>
            <Check />
            <strong>
              Request
              <br />
              Received
            </strong>
          </span>
          <span>
            <House />
            <strong>
              Home Project
              <br />
              Support
            </strong>
          </span>
          <span>
            <ShieldCheck />
            <strong>
              Your Home.
              <br />
              Your Choice.
            </strong>
          </span>
        </div>
        <p className="confirmation-privacy">
          <LockKeyhole size={14} />
          <span>
            Your information is handled according to our{" "}
            <Link to="/privacy-policy" onClick={onClose}>
              Privacy Policy
            </Link>
            .
          </span>
        </p>
        <section
          className="confirmation-call-panel"
          aria-label="Phone assistance"
        >
          <span className="confirmation-eyebrow">
            {phoneHref
              ? "WANT TO SPEAK WITH SOMEONE NOW?"
              : "PREFER A CONVERSATION?"}
          </span>
          <h3>Call Our Home Project Team</h3>
          <p>
            {phoneHref
              ? "We're here to help you discuss your home project."
              : "Explore our service guides for help planning your project."}
          </p>
          <CallCTA
            variant="confirmation"
            numberFirst
            location="thank_you_call"
            service={project.service}
            label="Call Our Home Project Team"
          />
          <div className="confirmation-benefits">
            <span>
              <Check />
              Easy to Get Started
            </span>
            <span>
              <Check />
              {noObligation ? "No Obligation to Hire" : "Your Choice"}
            </span>
            <span>
              <Check />
              Home Project Guidance
            </span>
          </div>
        </section>
        <p className="confirmation-brand">
          Thanks for choosing <strong>Call Home Project Pros.</strong>
        </p>
      </div>
    </dialog>,
    document.body,
  );
}
