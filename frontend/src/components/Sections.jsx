import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  PhoneCall,
  ClipboardList,
  MessagesSquare,
  Check,
  ShieldCheck,
  House,
  Clock3,
} from "lucide-react";
import CallCTA from "./CallCTA";
import { visibleTrustClaims } from "../config/trustClaims";
export function SectionHeading({ eyebrow, title, text, action }) {
  return (
    <div className="section-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {text && <p>{text}</p>}
      </div>
      {action && (
        <Link className="button section-link" to={action.to}>
          {action.label}
          <ArrowUpRight size={19} />
        </Link>
      )}
    </div>
  );
}
const claimIcons = {
  phone: PhoneCall,
  shield: ShieldCheck,
  home: House,
  check: Check,
  clock: Clock3,
};
export function TrustStrip() {
  return (
    <div className="container trust-ribbon">
      {visibleTrustClaims().map((claim) => {
        const Icon = claimIcons[claim.icon] || ShieldCheck;
        return (
          <div key={claim.label}>
            <span className="trust-symbol">
              <Icon size={25} />
            </span>
            <span>
              <strong>{claim.value}</strong>
              <small>{claim.label}</small>
            </span>
          </div>
        );
      })}
    </div>
  );
}
export function HowItWorks() {
  return (
    <section className="section process-section" id="how-it-works">
      <div className="container">
        <div className="process-heading">
          <div>
            <span className="eyebrow">
              ONE CONVERSATION CAN CHANGE WHAT’S NEXT
            </span>
            <h2>
              From “where do I start?”
              <br /> to <span className="text-green">“let’s get started.”</span>
            </h2>
          </div>
          <p>
            No complicated starting point.
            <br /> Just a simple path from your idea to a project conversation.
          </p>
        </div>
        <div className="process-track">
          {[
            [
              PhoneCall,
              "01",
              "Tell us about your project",
              "A quick call or a few details online. Tell us what your home needs and what you have in mind.",
            ],
            [
              ClipboardList,
              "02",
              "We help match your needs",
              "Your location, service, and priorities guide the next step, where providers are available.",
            ],
            [
              MessagesSquare,
              "03",
              "Discuss your estimate",
              "Talk through the scope, ask your questions, and choose what works for you.",
            ],
          ].map(([Icon, n, title, text]) => (
            <div className="process-step" key={n}>
              <div className="process-step-top">
                <span className="process-number">{n}</span>
                <span className="process-icon">
                  <Icon size={28} />
                </span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <div className="process-bottom">
          <span>
            <ShieldCheck size={20} /> A project request is a first step. The
            decision is always yours.
          </span>
          <CallCTA compact location="how_it_works_call" />
        </div>
      </div>
    </section>
  );
}
export function CallBanner({ service }) {
  return (
    <section className="section call-feature-wrap">
      <div className="container call-feature">
        <div className="call-feature-copy">
          <span className="eyebrow">LET’S TALK IT THROUGH</span>
          <span className="feature-call-symbol">
            <PhoneCall size={35} />
          </span>
          <h2>
            Big plans?
            <br /> Small repair?
            <br /> <span>We’re all ears.</span>
          </h2>
          <p>
            Not sure where to start? A conversation is a good place. Tell us
            what’s on your home project list.
          </p>
          <CallCTA
            location={
              service ? service + "_midpage_call" : "after_services_call"
            }
            service={service}
            label="Talk About Your Project"
          />
          <span className="call-feature-note">
            <Check size={15} /> Your project. Your priorities. No pressure.
          </span>
        </div>
        <div className="call-feature-image">
          <img
            src="/images/homeowner-phone.webp"
            width="1000"
            height="750"
            loading="lazy"
            alt="Woman at home with a phone and coffee, ready to plan her next project"
          />
          <div className="consultation-note">
            <PhoneCall size={23} />
            <span>
              A little guidance.<strong>A whole new possibility.</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
export function FinalCTA() {
  return (
    <section className="final-cta premium-final">
      <div className="container final-grid">
        <div>
          <span className="eyebrow">THE NEXT CHAPTER OF YOUR HOME</span>
          <h2>
            You bring the idea.
            <br /> <span>Let’s find your next step.</span>
          </h2>
          <p>From everyday fixes to the projects you’ve been saving for.</p>
          <div className="cta-row">
            <CallCTA location="final_cta_call" />
            <Link to="/quote" className="final-quote">
              Get Free Quotes <ArrowUpRight size={20} />
            </Link>
          </div>
          <span className="final-note">
            <Check size={16} /> No obligation to hire. Your choice, always.
          </span>
        </div>
        <div className="final-photo">
          <img
            src="/images/kitchen.webp"
            width="800"
            height="600"
            loading="lazy"
            alt="Light-filled remodeled kitchen with space for everyday life"
          />
          <span>
            <House size={19} /> GOOD THINGS START AT HOME
          </span>
        </div>
      </div>
    </section>
  );
}
export function FAQAccordion({ items }) {
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <details key={item.question}>
          <summary>
            <span className="faq-number">{String(i + 1).padStart(2, "0")}</span>
            <strong>{item.question}</strong>
            <span className="faq-plus">+</span>
          </summary>
          <div className="faq-answer">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {items.map((item, i) => (
        <span key={item.label}>
          <span aria-hidden="true">/</span>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current={i === items.length - 1 ? "page" : undefined}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
