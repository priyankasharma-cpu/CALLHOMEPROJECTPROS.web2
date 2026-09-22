import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import {
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  X,
  ArrowRight,
} from "lucide-react";
import CallCTA from "../CallCTA";
import {
  isWithinCooldown,
  recordDismissal,
  OPEN_EVENT,
} from "./callPopupControl";
import "./call-popup.css";

export default function CallPopup() {
  const { pathname } = useLocation();
  const previousPath = useRef(pathname);
  const phaseRef = useRef("closed");
  const [phase, setPhase] = useState("closed");
  const dialog = useRef(null);
  const closeButton = useRef(null);
  const exitUsed = useRef(false);
  const backdropStart = useRef(false);
  const titleId = useId();
  const descriptionId = useId();
  const visible = phase !== "closed";

  const open = useCallback((manual = false) => {
    if (phaseRef.current !== "closed" || document.querySelector("dialog[open]"))
      return false;
    if (
      !manual &&
      (isWithinCooldown() ||
        document.visibilityState === "hidden" ||
        document.activeElement?.matches(
          "input, textarea, select, [contenteditable=true]",
        ))
    )
      return false;
    phaseRef.current = "open";
    setPhase("open");
    return true;
  }, []);
  const dismiss = useCallback(() => {
    if (phaseRef.current !== "open") return;
    recordDismissal();
    exitUsed.current = false;
    phaseRef.current = "closing";
    setPhase("closing");
  }, []);

  useEffect(() => {
    const navigation = previousPath.current !== pathname;
    previousPath.current = pathname;
    exitUsed.current = false;
    if (isWithinCooldown()) return;
    const timer = window.setTimeout(() => open(), navigation ? 800 : 1200);
    return () => window.clearTimeout(timer);
  }, [pathname, open]);

  useEffect(() => {
    const desktop = window.matchMedia("(hover: hover) and (pointer: fine)");
    const exit = (event) => {
      if (
        !desktop.matches ||
        event.relatedTarget ||
        event.clientY > 0 ||
        event.clientX <= 0 ||
        event.clientX >= window.innerWidth ||
        exitUsed.current
      )
        return;
      if (open()) exitUsed.current = true;
    };
    const manual = () => open(true);
    document.addEventListener("mouseout", exit);
    window.addEventListener(OPEN_EVENT, manual);
    return () => {
      document.removeEventListener("mouseout", exit);
      window.removeEventListener(OPEN_EVENT, manual);
    };
  }, [open]);

  useEffect(() => {
    if (!visible) return;
    const element = dialog.current;
    const previousFocus = document.activeElement;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    element.showModal();
    closeButton.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      if (previousFocus?.isConnected)
        previousFocus.focus({ preventScroll: true });
    };
  }, [visible]);

  useEffect(() => {
    if (phase !== "closing") return;
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      document.documentElement.dataset.motion === "reduced";
    const timer = window.setTimeout(
      () => {
        phaseRef.current = "closed";
        setPhase("closed");
      },
      reduced ? 0 : 240,
    );
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!visible || typeof document === "undefined") return null;
  const outside = (event) => {
    if (event.target !== event.currentTarget) return false;
    const bounds = event.currentTarget.getBoundingClientRect();
    return (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    );
  };
  return createPortal(
    <dialog
      ref={dialog}
      className={`call-popup ${phase === "closing" ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
      onPointerDown={(event) => {
        backdropStart.current = outside(event);
      }}
      onClick={(event) => {
        if (backdropStart.current && outside(event)) dismiss();
        backdropStart.current = false;
      }}
    >
      <button
        ref={closeButton}
        className="call-popup-close"
        type="button"
        aria-label="Close call popup"
        onClick={dismiss}
      >
        <X size={20} />
      </button>
      <div className="call-popup-content">
        <div className="call-popup-visual" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>
            <PhoneCall size={30} />
          </span>
        </div>
        <span className="call-popup-eyebrow">
          NEED HELP WITH A HOME PROJECT?
        </span>
        <h2 id={titleId}>Let’s Talk About Your Project</h2>
        <p id={descriptionId}>
          Tell us what you need help with and where the project is located. A
          quick call is an easy way to discuss your project and take the next
          step.
        </p>
        <div className="call-popup-process">
          <span>
            <ShieldCheck size={19} />
            Clear Next Steps
          </span>
          <span>
            <PhoneCall size={19} />
            Direct Conversation
          </span>
          <span>
            <CheckCircle2 size={19} />
            Simple Project Request
          </span>
        </div>
        <CallCTA
          location="global_call_popup"
          variant="popup-cta"
          label="Call About Your Project"
        />
        <Link className="call-popup-request" to="/quote" onClick={dismiss}>
          Start a Project Request <ArrowRight size={16} />
        </Link>
        <p className="call-popup-note">
          <ShieldCheck size={16} />
          Have your project type and ZIP code ready so we can better understand
          your request.
        </p>
      </div>
    </dialog>,
    document.body,
  );
}
