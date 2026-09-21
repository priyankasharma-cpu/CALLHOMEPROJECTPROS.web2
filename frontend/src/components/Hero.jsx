import { Link } from "react-router-dom";
import { ArrowRight, Check, House, ShieldCheck, Sparkles } from "lucide-react";
import CallCTA from "./CallCTA";
export default function Hero() {
  return (
    <section className="premium-hero">
      <div className="hero-orbit" aria-hidden="true" />
      <div className="container premium-hero-grid">
        <div className="premium-hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-line" /> HOME PROJECT HELP, MADE SIMPLE
          </span>
          <h1>
            Your Home Project
            <br /> Starts With
            <br /> <span className="gradient-text">One Call.</span>
            <span className="headline-period" aria-hidden="true" />
          </h1>
          <p>
            Big ideas. Everyday repairs. A home that works better for you. Start
            a conversation and take the next step toward the right home service
            professional.
          </p>
          <div className="premium-hero-actions">
            <CallCTA variant="hero" location="hero_call" />
            <Link className="hero-quote-link" to="/quote">
              Prefer to start online?{" "}
              <strong>
                Get Free Quotes <ArrowRight size={18} />
              </strong>
            </Link>
          </div>
          <div className="hero-assurances">
            <span>
              <Check /> Simple project requests
            </span>
            <span>
              <Check /> No obligation to hire
            </span>
          </div>
        </div>
        <div className="hero-editorial">
          <div className="hero-photo-frame">
            <img
              src="/images/home-hero.webp"
              alt="White American home with a covered porch, blue sky, and landscaped front yard"
              width="1100"
              height="1000"
              fetchPriority="high"
            />
            <div className="photo-gradient" />
            <div className="hero-photo-caption">
              <span>THE PLACE YOU CALL HOME</span>
              <strong>
                Make your next
                <br /> chapter a great one.
              </strong>
            </div>
          </div>
          <div className="hero-project-note">
            <span className="note-symbol">
              <House size={27} />
            </span>
            <div>
              <strong>Your home project, simplified.</strong>
              <p>One call. Smarter possibilities.</p>
            </div>
            <ArrowUp />
          </div>
          <div className="hero-trust-note">
            <ShieldCheck size={24} />
            <div>
              <strong>Your home. Your choice.</strong>
              <span>A clear next step, without the pressure.</span>
            </div>
          </div>
          <div className="hero-mini-photo">
            <img
              src="/images/kitchen.webp"
              alt="Finished kitchen with white cabinetry and a generous island"
              width="260"
              height="180"
            />
            <span>
              <Sparkles size={13} /> ROOM FOR SOMETHING NEW
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
function ArrowUp() {
  return (
    <span className="note-arrow">
      <ArrowRight size={19} />
    </span>
  );
}
