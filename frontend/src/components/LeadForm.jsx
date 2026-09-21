import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  LockKeyhole,
  LoaderCircle,
} from "lucide-react";
import { services, getService } from "../data/services";
import { siteConfig } from "../config/siteConfig";
import ThankYouModal from "./ThankYouModal/ThankYouModal";
import CallCTA from "./CallCTA";
import "./ThankYouModal/lead-review.css";
import { track, getAttribution } from "../utils/tracking";
const timelines = [
  "As soon as possible",
  "Within 30 days",
  "1–3 months",
  "Just researching",
];
const statuses = [
  "Homeowner",
  "Authorized property manager",
  "Tenant with owner permission",
  "Other",
];
const stepTitles = [
  "Where is your project?",
  "What can we help with?",
  "Tell us a little more.",
  "What’s your timeline?",
  "Your connection to the property?",
  "How can you be reached?",
  "Review Your Request",
];
const initial = {
  zip: "",
  service: "",
  projectDetails: "",
  projectTimeline: "",
  homeownerStatus: "",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  consent: false,
  website: "",
};
export default function LeadForm({ initialService = "" }) {
  const [params] = useSearchParams();
  const [values, setValues] = useState(() => ({
    ...initial,
    zip: params.get("zip") || "",
    service: initialService || params.get("service") || "",
  }));
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reference, setReference] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState(false);
  const completed = useRef(false);
  const confirmedHeading = useRef(null);
  const submitting = useRef(false);
  const requestId = useRef(crypto.randomUUID());
  const lastPayload = useRef(null);
  const heading = useRef();
  const started = useRef(false);
  const touched = useRef(false);
  const hasDisclosure = Boolean(
    siteConfig.consentText && siteConfig.consentVersion,
  );
  useEffect(() => {
    if (touched.current) heading.current?.focus();
  }, [step]);
  const update = (key, value) => {
    if (!started.current) {
      track("quote_started", { service: values.service });
      started.current = true;
    }
    setValues((prev) => ({ ...prev, [key]: value }));
    setError("");
    setSubmitError(false);
  };
  function validate(atStep = step) {
    if (atStep === 0 && !/^\d{5}$/.test(values.zip))
      return "Enter a valid 5-digit ZIP code.";
    if (atStep === 1 && !getService(values.service))
      return "Choose a project type.";
    if (
      atStep === 2 &&
      (values.projectDetails.trim().length < 10 ||
        values.projectDetails.length > 2000)
    )
      return "Add between 10 and 2,000 characters about your project.";
    if (atStep === 3 && !timelines.includes(values.projectTimeline))
      return "Choose the timing that best fits your plans.";
    if (atStep === 4 && !statuses.includes(values.homeownerStatus))
      return "Select your connection to the property.";
    if (atStep === 5) {
      if (!values.firstName.trim() || !values.lastName.trim())
        return "Enter your first and last name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
        return "Enter a valid email address.";
      if (!/^1?[2-9]\d{2}[2-9]\d{6}$/.test(values.phone.replace(/\D/g, "")))
        return "Enter a valid US phone number including its area code.";
    }
    if (atStep === 6 && hasDisclosure && !values.consent)
      return "Read the disclosure and check the consent box to submit.";
    return "";
  }
  async function next(e) {
    e.preventDefault();
    if (submitting.current || completed.current) return;
    const message =
      step === 6
        ? Array.from({ length: 7 }, (_, i) => validate(i)).find(Boolean)
        : validate();
    if (message) {
      setError(message);
      return;
    }
    if (step < 6) {
      track("lead_step_completed", { step: step + 1, service: values.service });
      touched.current = true;
      setStep((s) => s + 1);
      return;
    }
    submitting.current = true;
    setBusy(true);
    setSubmitError(false);
    setError("");
    track("lead_submit", { service: values.service });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const body = JSON.stringify({
        ...values,
        consentVersion: siteConfig.consentVersion,
        ...getAttribution(),
      });
      if (lastPayload.current && lastPayload.current !== body)
        requestId.current = crypto.randomUUID();
      lastPayload.current = body;
      const response = await fetch(`${siteConfig.apiUrl}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestId.current,
        },
        body,
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({
        message: "We could not process the response. Please try again.",
      }));
      if (
        !response.ok ||
        data.success !== true ||
        !/^[a-f0-9]{24}$/i.test(data.data?.reference || "")
      )
        throw new Error(
          data.message || "We couldn’t send your request. Please try again.",
        );
      setReference(data.data?.reference || "");
      completed.current = true;
      setSubmitted({
        firstName: values.firstName.trim(),
        service: values.service,
        zip: values.zip,
        projectTimeline: values.projectTimeline,
      });
      setSuccess(true);
      setModalOpen(true);
      track("lead_success", { service: values.service });
    } catch {
      setSubmitError(true);
      setError(
        "We couldn't submit your request right now. Please try again or call us for assistance.",
      );
    } finally {
      clearTimeout(timeout);
      submitting.current = false;
      setBusy(false);
    }
  }
  if (success)
    return (
      <>
        <div className="form-success" role="status">
          <CheckCircle2 size={55} />
          <span className="eyebrow">REQUEST RECEIVED</span>
          <h2 ref={confirmedHeading} tabIndex={-1}>
            Thanks{submitted.firstName ? ", " + submitted.firstName : ""} — your
            request is in.
          </h2>
          <p>Your project request has been saved.</p>
          {reference && <p className="reference">Reference: {reference}</p>}
          <button className="button primary" onClick={() => setModalOpen(true)}>
            View Confirmation
          </button>
          <Link to="/resources" className="text-link">
            Explore homeowner guides <ArrowRight size={18} />
          </Link>
        </div>
        <ThankYouModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          project={submitted}
          returnFocusRef={confirmedHeading}
        />
      </>
    );
  return (
    <div className="lead-form">
      <div className="progress-label">
        <span>YOUR HOME PROJECT</span>
        <span>Step {step + 1} of 7</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Project request progress"
        aria-valuemin={1}
        aria-valuemax={7}
        aria-valuenow={step + 1}
      >
        <span style={{ width: `${((step + 1) / 7) * 100}%` }} />
      </div>
      <h2 ref={heading} tabIndex={-1} key={step}>
        {stepTitles[step]}
      </h2>
      <p className="form-intro">
        {
          [
            "Start with your ZIP code. Availability varies by service and location.",
            "Choose the main service for this request.",
            "A few useful details help explain what you have in mind. Don’t include sensitive information.",
            "It’s okay if you’re still exploring your options.",
            "This helps clarify who can authorize work on the home.",
            "Use the contact details you want associated with this request.",
            "Please confirm your project details before submitting your request.",
          ][step]
        }
      </p>
      <form onSubmit={next} noValidate aria-busy={busy}>
        {step === 0 && (
          <Field
            label="ZIP code"
            name="zip"
            value={values.zip}
            onChange={update}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="e.g. 90210"
          />
        )}
        {step === 1 && (
          <div className="choice-grid" role="group" aria-label="Project type">
            {services.map((s) => (
              <button
                key={s.slug}
                type="button"
                className={
                  values.service === s.slug ? "choice selected" : "choice"
                }
                aria-pressed={values.service === s.slug}
                onClick={() => update("service", s.slug)}
              >
                {s.title}
                {values.service === s.slug && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <>
            <div className="question-hint">
              <strong>
                Helpful details for{" "}
                {getService(values.service)?.title.toLowerCase()}
              </strong>
              <p>
                {getService(values.service)?.projects.join(", ")}. Is this a
                repair, replacement, or new installation?
              </p>
            </div>
            <label className="field">
              Project details
              <textarea
                name="projectDetails"
                value={values.projectDetails}
                onChange={(e) => update("projectDetails", e.target.value)}
                rows={5}
                minLength={10}
                maxLength={2000}
                placeholder="Describe the project, the issue you’re noticing, and anything a provider should know."
                required
              />
            </label>
            <span className="character-count">
              {values.projectDetails.length}/2,000
            </span>
          </>
        )}
        {step === 3 && (
          <Choices
            options={timelines}
            name="projectTimeline"
            value={values.projectTimeline}
            update={update}
          />
        )}
        {step === 4 && (
          <Choices
            options={statuses}
            name="homeownerStatus"
            value={values.homeownerStatus}
            update={update}
          />
        )}
        {step === 5 && (
          <>
            <div className="fields-row">
              <Field
                label="First name"
                name="firstName"
                value={values.firstName}
                onChange={update}
                autoComplete="given-name"
                maxLength={80}
              />
              <Field
                label="Last name"
                name="lastName"
                value={values.lastName}
                onChange={update}
                autoComplete="family-name"
                maxLength={80}
              />
            </div>
            <Field
              label="Email address"
              name="email"
              type="email"
              value={values.email}
              onChange={update}
              autoComplete="email"
              maxLength={254}
            />
            <Field
              label="Phone number"
              name="phone"
              type="tel"
              value={values.phone}
              onChange={update}
              autoComplete="tel"
              maxLength={25}
            />
          </>
        )}
        {step === 6 && (
          <>
            <dl className="review-details premium-review">
              {[
                ["Project", getService(values.service)?.title],
                ["ZIP Code", values.zip],
                ["Project Details", values.projectDetails],
                ["Timeline", values.projectTimeline],
                ["Property Status", values.homeownerStatus],
                ["Name", values.firstName + " " + values.lastName],
                ["Email", values.email],
                ["Phone", values.phone],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {hasDisclosure && (
              <label className="consent">
                <input
                  type="checkbox"
                  checked={values.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                />
                <span>{siteConfig.consentText}</span>
              </label>
            )}
            <p className="legal-links">
              Read our <Link to="/privacy-policy">Privacy Policy</Link> and{" "}
              <Link to="/terms">Terms of Use</Link>.
            </p>
          </>
        )}
        <div className="honeypot" aria-hidden="true">
          <label>
            Leave this blank
            <input
              tabIndex={-1}
              name="website"
              value={values.website}
              onChange={(e) => update("website", e.target.value)}
              autoComplete="off"
            />
          </label>
        </div>
        {error &&
          (submitError ? (
            <div className="submission-error" role="alert">
              <h3>We couldn't submit your request.</h3>
              <p>{error}</p>
              <div>
                <button
                  type="submit"
                  className="button secondary"
                  disabled={busy}
                >
                  Try Again
                </button>
                <CallCTA
                  compact
                  location="lead_error_call"
                  service={values.service}
                />
              </div>
            </div>
          ) : (
            <p className="form-error" role="alert">
              {error}
            </p>
          ))}
        <div className="form-actions">
          {step > 0 && (
            <button
              className="back-button"
              type="button"
              disabled={busy}
              onClick={() => {
                setError("");
                touched.current = true;
                setStep((s) => s - 1);
              }}
            >
              <ArrowLeft size={17} /> Back
            </button>
          )}
          <button className="button primary" type="submit" disabled={busy}>
            {busy ? (
              <>
                <LoaderCircle className="spinner" size={18} /> Submitting...
              </>
            ) : step === 6 ? (
              "Submit My Request"
            ) : (
              <>
                Continue <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
        <div className="form-privacy">
          <LockKeyhole size={14} /> No payment information needed.
        </div>
      </form>
    </div>
  );
}
function Field({ label, name, value, onChange, ...props }) {
  return (
    <label className="field">
      {label}
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        required
        {...props}
      />
    </label>
  );
}
function Choices({ options, name, value, update }) {
  return (
    <div
      className="choice-list"
      role="group"
      aria-label={
        name === "projectTimeline" ? "Project timing" : "Property relationship"
      }
    >
      {options.map((option) => (
        <button
          type="button"
          key={option}
          className={value === option ? "choice selected" : "choice"}
          aria-pressed={value === option}
          onClick={() => update(name, option)}
        >
          {option}
          {value === option ? (
            <Check size={18} />
          ) : (
            <span className="radio-circle" />
          )}
        </button>
      ))}
    </div>
  );
}
