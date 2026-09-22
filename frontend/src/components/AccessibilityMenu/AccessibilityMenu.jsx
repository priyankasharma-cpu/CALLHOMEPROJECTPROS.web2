import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ALargeSmall, X, RotateCcw } from "lucide-react";
import {
  applyPreferences,
  defaultPreferences,
  preferenceKey,
  preferenceOptions,
  readPreferences,
  savePreferences,
} from "../../utils/readability";
import "./accessibility.css";
const labels = {
  textSize: "Text size",
  contrast: "Contrast",
  letterSpacing: "Letter spacing",
  motion: "Motion",
};
export default function AccessibilityMenu() {
  const [preferences, setPreferences] = useState(readPreferences);
  const [open, setOpen] = useState(false);
  const [osReduced, setOsReduced] = useState(false);
  const trigger = useRef(null);
  const dialog = useRef(null);
  const close = useRef(null);
  const id = useId();
  useEffect(() => {
    applyPreferences(preferences);
  }, [preferences]);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setOsReduced(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);
    const storage = (event) => {
      if (event.key === preferenceKey || event.key === null)
        setPreferences(readPreferences());
    };
    window.addEventListener("storage", storage);
    return () => {
      motion.removeEventListener("change", updateMotion);
      window.removeEventListener("storage", storage);
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    close.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <>
      <div className="readability-dock">
        <button
          ref={trigger}
          type="button"
          className="readability-trigger"
          aria-label="Readability settings"
          title="Reading Options"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(true)}
        >
          <ALargeSmall size={25} />
          <span className="readability-tooltip">Reading Options</span>
        </button>
      </div>
      {open &&
        createPortal(
          <dialog
            ref={dialog}
            id={id}
            className="readability-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-description`}
            onCancel={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <button
              ref={close}
              type="button"
              className="readability-close"
              aria-label="Close readability settings"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
            <span className="readability-label">READING OPTIONS</span>
            <h2 id={`${id}-title`}>Make this page easier to read</h2>
            <p id={`${id}-description`}>
              Adjust the display to make content more comfortable for you.
            </p>
            {Object.entries(labels).map(([key, label]) => (
              <fieldset key={key}>
                <legend>{label}</legend>
                <div className="readability-segments">
                  {preferenceOptions[key].map((value) => (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={preferences[key] === value}
                      onClick={() =>
                        setPreferences(
                          savePreferences({ ...preferences, [key]: value }),
                        )
                      }
                    >
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
            {osReduced && (
              <p className="readability-os-note">
                Your device’s reduced-motion setting is always respected.
              </p>
            )}
            <button
              className="readability-reset"
              type="button"
              onClick={() =>
                setPreferences(savePreferences(defaultPreferences))
              }
            >
              <RotateCcw size={17} />
              Reset to Default
            </button>
          </dialog>,
          document.body,
        )}
    </>
  );
}
