import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  PhoneCall,
  HeartHandshake,
  ShieldCheck,
  Check,
} from "lucide-react";
import CallCTA from "../components/CallCTA";
import WhyChooseUs from "../components/WhyChooseUs";
import { ServiceCard } from "../components/ServicesGrid";
import { getService } from "../data/services";
import {
  Breadcrumbs,
  TrustStrip,
  SectionHeading,
  HowItWorks,
  CallBanner,
  FinalCTA,
} from "../components/Sections";
export default function AboutContent() {
  return (
    <>
      <section className="about-editorial-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: "About us" }]} />
          <div className="about-editorial-grid">
            <div>
              <span className="eyebrow">
                HOME IS PERSONAL. SO IS THE NEXT STEP.
              </span>
              <h1>
                Good things
                <br /> start <span className="gradient-text">at home.</span>
              </h1>
              <p>
                We believe finding a starting point for your home project should
                feel simple, human, and clear.
              </p>
              <CallCTA location="about_hero_call" variant="hero" />
              <div className="hero-assurances">
                <span>
                  <Check /> Your home. Your project. Your choice.
                </span>
              </div>
            </div>
            <div className="about-photo-composition">
              <img
                src="/images/contractors.webp"
                alt="Home renovation professionals working through project plans together"
                width="1000"
                height="700"
                fetchPriority="high"
              />
              <div className="about-photo-note">
                <HeartHandshake size={30} />
                <strong>
                  Built around people.
                  <br /> <span>And the places they call home.</span>
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TrustStrip />
      <section className="section container purpose-section">
        <span className="purpose-number">01 / OUR PURPOSE</span>
        <div>
          <span className="eyebrow">
            A LITTLE GUIDANCE. A LOT OF POSSIBILITY.
          </span>
          <h2>
            Make the first step
            <br /> <span className="text-green">the easy part.</span>
          </h2>
        </div>
        <div>
          <p>
            A leaking roof. A kitchen you’ve outgrown. A heating system that
            needs attention. Every project begins with a question: where do I
            start?
          </p>
          <p>
            Call Home Project Pros brings useful information, home service
            categories, and a simple project request process together—so you can
            begin with a clearer picture.
          </p>
        </div>
      </section>
      <section className="about-mission-band">
        <div className="container mission-grid">
          <img
            src="/images/kitchen.webp"
            alt="Bright remodeled kitchen that makes everyday home life more comfortable"
            width="800"
            height="600"
            loading="lazy"
          />
          <div>
            <span className="eyebrow">HOW WE HELP HOMEOWNERS</span>
            <h2>
              A connection.
              <br /> A conversation.
              <br /> <span>A choice that’s yours.</span>
            </h2>
            <p>
              Explore your options, tell us what matters, and take a considered
              next step toward the right provider where available.
            </p>
            <div className="mission-points">
              <div>
                <PhoneCall />
                <span>
                  <strong>Talk it through</strong>A conversation gives you room
                  to explain.
                </span>
              </div>
              <div>
                <ShieldCheck />
                <span>
                  <strong>Understand the process</strong>Clear information
                  before commitment.
                </span>
              </div>
            </div>
            <Link to="/how-it-works" className="text-link">
              See how it works <ArrowUpRight size={19} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow="FROM EVERYDAY REPAIRS TO BIGGER PLANS"
          title="One home. Many possibilities."
          text="Explore services for the spaces and systems you rely on."
          action={{ to: "/services", label: "All Home Services" }}
        />
        <div className="related-grid">
          {["roofing", "hvac", "bathroom-remodeling"].map((slug) => (
            <ServiceCard key={slug} service={getService(slug)} />
          ))}
        </div>
      </section>
      <HowItWorks />
      <WhyChooseUs />
      <section className="container platform-transparency">
        <ShieldCheck size={35} />
        <div>
          <span className="eyebrow">A CLEAR UNDERSTANDING</span>
          <h2>
            A project connection platform.
            <br /> Not a contractor.
          </h2>
          <p>
            We do not perform or supervise contractor work. You choose whether
            to hire and agree directly with the provider on scope, price, and
            terms. Verify qualifications and review the written proposal before
            proceeding. Availability and response times vary.
          </p>
        </div>
        <Link to="/faq" className="button secondary">
          Your questions, answered <ArrowUpRight size={18} />
        </Link>
      </section>
      <CallBanner />
      <FinalCTA />
    </>
  );
}
