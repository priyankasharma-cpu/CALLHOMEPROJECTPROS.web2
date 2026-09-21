import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  PhoneCall,
  Mail,
  MessageSquare,
  ShieldCheck,
  Clock3,
} from "lucide-react";
import CallCTA from "../components/CallCTA";
import ContactForm from "../components/ContactForm";
import { Breadcrumbs, FAQAccordion } from "../components/Sections";
import { siteConfig } from "../config/siteConfig";
import { homeFAQs } from "../data/content";
export default function ContactContent() {
  return (
    <>
      <section className="contact-editorial-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: "Contact" }]} />
          <div>
            <span className="eyebrow">
              A CONVERSATION IS A GREAT PLACE TO START
            </span>
            <h1>
              Need help with
              <br /> <span className="gradient-text">a home project?</span>
            </h1>
            <p>
              We’re here to help you get started.
              <br /> Choose the right starting point for your question.
            </p>
          </div>
          <img
            src="/images/homeowner-phone.webp"
            alt="Woman at home considering her plans with her phone in hand"
            width="1000"
            height="750"
            fetchPriority="high"
          />
        </div>
      </section>
      <section className="section container premium-contact-layout">
        <div className="contact-information">
          <div className="contact-call-panel">
            <span className="contact-phone-symbol">
              <PhoneCall size={34} />
            </span>
            <span className="eyebrow">PREFER A CONVERSATION?</span>
            <h2>
              Let’s talk
              <br /> about your home.
            </h2>
            <p>
              Explain what you have in mind. Ask a question. Find a clearer next
              step.
            </p>
            <CallCTA location="contact_page_call" variant="section" />
            <span className="contact-hours">
              <Clock3 size={16} />
              {siteConfig.businessHours ||
                "Phone availability will be shown when our line opens."}
            </span>
          </div>
          <div className="contact-support-card">
            <MessageSquare size={25} />
            <div>
              <h3>Ready to describe your project?</h3>
              <p>Our guided request helps you share the right details.</p>
              <Link to="/quote" className="text-link">
                Start a Project Request <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="contact-support-card">
            <Mail size={25} />
            <div>
              <h3>General support</h3>
              {siteConfig.supportEmail ? (
                <a
                  className="text-link"
                  href={"mailto:" + siteConfig.supportEmail}
                >
                  {siteConfig.supportEmail}
                </a>
              ) : (
                <p>
                  Support contact details are being finalized. Inquiries will
                  open once those details and our privacy information are ready.
                </p>
              )}
            </div>
          </div>
          <div className="contact-privacy">
            <ShieldCheck size={20} />
            <p>
              Only share what’s needed to describe your question. Please leave
              out payment details and sensitive personal information.
            </p>
          </div>
        </div>
        <ContactForm />
      </section>
      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <span className="eyebrow">A FEW QUICK ANSWERS</span>
            <h2>
              Before you
              <br /> get in touch.
            </h2>
            <Link to="/faq" className="text-link">
              All questions <ArrowUpRight size={18} />
            </Link>
          </div>
          <FAQAccordion items={[homeFAQs[0], homeFAQs[2], homeFAQs[7]]} />
        </div>
      </section>
    </>
  );
}
