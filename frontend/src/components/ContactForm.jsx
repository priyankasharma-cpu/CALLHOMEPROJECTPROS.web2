import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { siteConfig } from "../config/siteConfig";
import CallCTA from "./CallCTA";
import { getAttribution } from "../utils/tracking";
export default function ContactForm() {
  const [data, setData] = useState({
    name: "",
    email: "",
    inquiryType: "General question",
    phone: "",
    message: "",
    consent: false,
    website: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const lock = useRef(false);
  const id = useRef(crypto.randomUUID());
  const lastPayload = useRef("");
  const update = (e) =>
    setData({
      ...data,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  async function submit(e) {
    e.preventDefault();
    if (lock.current || success) return;

    if (
      data.phone &&
      !/^1?[2-9]\d{2}[2-9]\d{6}$/.test(data.phone.replace(/[\s()+.\-]/g, ""))
    ) {
      setError(
        "Please enter a valid US phone number or leave the optional phone field blank.",
      );
      return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const attribution = getAttribution();
      const payload = JSON.stringify({
        ...data,
        landingPage: attribution.landingPage || window.location.pathname,
        referrer: attribution.referrer || "",
      });
      if (lastPayload.current && lastPayload.current !== payload)
        id.current = crypto.randomUUID();
      lastPayload.current = payload;
      const r = await fetch(`${siteConfig.apiUrl}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": id.current,
        },
        body: payload,
        signal: controller.signal,
      });
      const body = await r.json();
      if (
        !r.ok ||
        body.success !== true ||
        !/^[a-f0-9]{24}$/i.test(body.data?.reference || "")
      )
        throw new Error("Submission failed");
      setSuccess(true);
    } catch {
      setError(
        `We couldn't send your message right now. Please try again or call ${siteConfig.phoneNumber}.`,
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
        <h2>Message Received</h2>
        <p>
          Thank you for reaching out to Call Home Project Pros. Your inquiry has
          been received successfully.
        </p>
        <p>For help with a home project, you can also call our team.</p>
        <CallCTA location="contact_success_call" label="Call Now" />
        <Link className="text-link" to="/quote">
          Start a Project Request <ArrowRight size={17} />
        </Link>
      </div>
    );
  return (
    <div className="lead-form contact-form">
      <span className="eyebrow">SEND AN INQUIRY</span>
      <h2>How Can We Help?</h2>
      <p className="form-intro">
        Have a question about a home project or our services? Send us a message
        and provide a few details so we can better understand your request.
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
          Phone number (optional)
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={data.phone}
            onChange={update}
            maxLength={25}
          />
        </label>
        <label className="field">
          Inquiry type
          <select name="inquiryType" value={data.inquiryType} onChange={update}>
            <option>General question</option>
            <option>Service question</option>
            <option>Project question</option>
            <option>Existing request</option>
            <option>Website support</option>
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
        <p className="legal-links">
          Your information is used to process and respond to your inquiry.
          Please avoid including highly sensitive personal or financial
          information.
        </p>
        <p className="legal-links">
          <Link to="/privacy-policy">Privacy policy</Link> ·{" "}
          <Link to="/terms">Terms</Link>
        </p>
        {error && (
          <div role="alert" className="form-error">
            <p>{error}</p>
            <CallCTA location="contact_error_call" label="Call Now" />
          </div>
        )}
        <button className="button primary" type="submit" disabled={busy}>
          {busy ? "Sending…" : "Send Inquiry"}
          {busy ? (
            <LoaderCircle size={17} className="submission-spinner" />
          ) : (
            <ArrowRight size={17} />
          )}
        </button>
      </form>
    </div>
  );
}
