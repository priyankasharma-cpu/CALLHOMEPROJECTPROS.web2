import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ShieldCheck, PhoneCall } from "lucide-react";
import Hero from "../components/Hero";
import WhyChooseUs from "../components/WhyChooseUs";
import CallCTA from "../components/CallCTA";
import ServicesGrid from "../components/ServicesGrid";
import GuideCard from "../components/GuideCard";
import {
  SectionHeading,
  TrustStrip,
  CallBanner,
  HowItWorks,
  FinalCTA,
  FAQAccordion,
} from "../components/Sections";
import { homeFAQs } from "../data/content";
import { resources } from "../data/guides";
export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <section className="section discovery-section" id="popular-services">
        <div className="container">
          <SectionHeading
            eyebrow="YOUR HOME. ENDLESS POSSIBILITIES."
            title="What’s next for your home?"
            text="The fix you need. The upgrade you want. Find a place to start."
            action={{ to: "/services", label: "View All Services" }}
          />
          <ServicesGrid />
        </div>
      </section>
      <CallBanner />
      <HowItWorks />
      <WhyChooseUs />
      <section className="quote-teaser section" id="get-quote">
        <div className="container quote-teaser-grid">
          <div>
            <span className="eyebrow">
              A LITTLE INFORMATION. A CLEAR NEXT STEP.
            </span>
            <h2>
              Prefer to start
              <br /> <span className="text-green">with a few clicks?</span>
            </h2>
            <p>
              Tell us where your project is and what you have in mind. We’ll
              guide you through the details, one step at a time.
            </p>
            <div className="quote-alternative">
              <PhoneCall size={24} />
              <div>
                <strong>Prefer to talk?</strong>
                <span>A conversation is always a great starting point.</span>
              </div>
            </div>
            <CallCTA compact location="home_form_call" />
          </div>
          <div className="quote-start-card">
            <div className="quote-card-top">
              <span>YOUR PROJECT STARTS HERE</span>
              <span>01 / 07</span>
            </div>
            <div className="mini-progress">
              <span />
            </div>
            <h3>
              Where’s your
              <br /> home project?
            </h3>
            <p>Start with your ZIP code. We’ll take it from there.</p>
            <form action="/quote" method="get">
              <label htmlFor="hero-zip">ZIP code</label>
              <div className="zip-row">
                <input
                  id="hero-zip"
                  name="zip"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  pattern="[0-9]{5}"
                  maxLength="5"
                  placeholder="Enter your ZIP code"
                  required
                />
                <button className="button primary" type="submit">
                  Get Started <ArrowRight size={19} />
                </button>
              </div>
            </form>
            <small>
              <ShieldCheck size={15} /> No payment details. No obligation to
              hire.
            </small>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="A LITTLE KNOW-HOW GOES A LONG WAY"
          title="Good plans start here."
          text="Practical reading for thoughtful home improvements."
          action={{ to: "/resources", label: "Explore the Guides" }}
        />
        <div className="guide-preview-grid">
          {[resources[3], resources[1], resources[4]].map((g) => (
            <GuideCard key={g.slug} guide={g} />
          ))}
        </div>
      </section>
      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <span className="eyebrow">BEFORE YOU TAKE THE NEXT STEP</span>
            <h2>
              Good questions.
              <br /> <span className="text-green">Clear answers.</span>
            </h2>
            <p>
              A little clarity about us, your project, and what happens next.
            </p>
            <Link className="text-link" to="/faq">
              See all questions <ArrowUpRight size={18} />
            </Link>
            <div className="faq-call-card">
              <PhoneCall size={26} />
              <h3>Still have questions?</h3>
              <p>Let’s talk about your home project.</p>
              <CallCTA compact location="faq_area_call" />
            </div>
          </div>
          <FAQAccordion items={homeFAQs.slice(0, 5)} />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
