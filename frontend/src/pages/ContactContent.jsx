import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  PhoneCall,
  Mail,
  MessageSquare,
  ShieldCheck,
  ClipboardList,
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
              Tell us what you need help with and where the project is located.
              Call to discuss your project and take the next step toward getting
              the service you need.
            </p>
            <CallCTA location="contact_page_call" variant="section" />
            <span className="contact-hours">
              <ClipboardList size={16} />
              {siteConfig.businessHours ||
                "Have your project type and ZIP code ready so we can better understand your request."}
            </span>
          </div>
          <div className="contact-support-card">
            <MessageSquare size={25} />
            <div>
              <h3>Ready to Get Started?</h3>
              <p>
                Tell us about your home project through our guided request form.
                Share a few project details so your request can be reviewed and
                the appropriate next step can be determined.
              </p>
              <Link to="/quote" className="text-link">
                Start a Project Request <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="contact-support-card">
            <Mail size={25} />
            <div>
              <h3>Questions About Your Project?</h3>
              {siteConfig.supportEmail ? (
                <a
                  className="text-link"
                  href={"mailto:" + siteConfig.supportEmail}
                >
                  {siteConfig.supportEmail}
                </a>
              ) : (
                <p>
                  Have a question before getting started? Send us an inquiry
                  with the details of your project or service needs. For
                  project-specific requests, you can also use our guided project
                  request form.
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
