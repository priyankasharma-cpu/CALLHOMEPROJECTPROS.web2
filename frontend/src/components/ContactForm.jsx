import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig } from "../config/siteConfig";
export default function ContactForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    topic: "General question",
    message: "",
    consent: false,
    website: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const lock = useRef(false);
  const id = useRef(crypto.randomUUID());
  const enabled =
    siteConfig.leadsEnabled &&
    siteConfig.consentText &&
    siteConfig.consentVersion;
  const update = (e) =>
    setData({
      ...data,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  async function submit(e) {
    e.preventDefault();
    if (lock.current) return;
    if (!enabled) {
      setError("The inquiry form is not open yet.");
      return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const r = await fetch(`${siteConfig.apiUrl}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": id.current,
        },
        body: JSON.stringify({
          ...data,
          consentVersion: siteConfig.consentVersion,
        }),
        signal: controller.signal,
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.message || "Please try again.");
      setSuccess(true);
    } catch (err) {
      setError(
        err.name === "AbortError"
          ? "The request timed out. Please try again."
          : err.message,
      );
    } finally {
      clearTimeout(timeout);
      lock.current = false;
      setBusy(false);
    }
  }
  if (success)
    return (
      <div className="form-success" role="status">
        <CheckCircle2 size={46} />
        <h2>Your inquiry has been saved.</h2>
        <p>
          Thank you for getting in touch. Response timing depends on support
          availability.
        </p>
      </div>
    );
  return (
    <div className="lead-form contact-form">
      <span className="eyebrow">SEND AN INQUIRY</span>
      <h2>How can we help?</h2>
      <p className="form-intro">
        For a project estimate, use the guided project request.
      </p>
      <form onSubmit={submit} aria-busy={busy}>
        <label className="field">
          Your name
          <input
            name="name"
            value={data.name}
            onChange={update}
            required
            maxLength={160}
            autoComplete="name"
          />
        </label>
        <label className="field">
          Email address
          <input
            name="email"
            type="email"
            value={data.email}
            onChange={update}
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
        <label className="field">
          Inquiry type
          <select name="topic" value={data.topic} onChange={update}>
            <option>General question</option>
            <option>Project request support</option>
            <option>Privacy inquiry</option>
          </select>
        </label>
        <label className="field">
          Message
          <textarea
            rows={5}
            name="message"
            value={data.message}
            onChange={update}
            required
            minLength={10}
            maxLength={3000}
          />
        </label>
        <div className="honeypot" aria-hidden="true">
          <input
            name="website"
            value={data.website}
            onChange={update}
            tabIndex={-1}
            aria-label="Leave blank"
          />
        </div>
        {enabled ? (
          <label className="consent">
            <input
              type="checkbox"
              name="consent"
              checked={data.consent}
              onChange={update}
              required
            />
            <span>{siteConfig.consentText}</span>
          </label>
        ) : (
          <div className="notice">
            <strong>Inquiries are not open yet.</strong>
            <p>
              Contact and privacy details are being finalized. Your entries are
              not sent while this form is disabled.
            </p>
          </div>
        )}
        <p className="legal-links">
          <Link to="/privacy-policy">Privacy policy</Link> ·{" "}
          <Link to="/terms">Terms</Link>
        </p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button
          className="button primary"
          type="submit"
          disabled={busy || !enabled}
        >
          {busy ? "Sending…" : "Send Inquiry"}
          <ArrowRight size={17} />
        </button>
      </form>
    </div>
  );
}
