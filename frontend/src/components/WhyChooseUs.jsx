import { Link } from "react-router-dom";
import {
  ArrowRight,
  PhoneCall,
  LayoutGrid,
  HeartHandshake,
  ShieldCheck,
  Check,
} from "lucide-react";
export default function WhyChooseUs() {
  return (
    <section className="section why-section">
      <div className="container premium-why">
        <div className="why-collage">
          <img
            className="why-main-photo"
            src="/images/contractors.webp"
            width="1000"
            height="700"
            loading="lazy"
            alt="Professionals discussing plans at a home renovation site"
          />
          <img
            className="why-detail-photo"
            src="/images/kitchen.webp"
            width="800"
            height="600"
            loading="lazy"
            alt="Thoughtfully remodeled kitchen with a bright, open layout"
          />
          <div className="why-caption">
            <span>
              <Check size={19} />
            </span>
            <strong>
              Less uncertainty.
              <br /> More possibility.
            </strong>
          </div>
          <span className="vertical-label">BUILT AROUND YOUR HOME</span>
        </div>
        <div className="why-content">
          <span className="eyebrow">THE RIGHT START MAKES A DIFFERENCE</span>
          <h2>
            Home projects are personal.
            <br />{" "}
            <span className="text-green">Getting help should be, too.</span>
          </h2>
          <p className="intro">
            It’s more than a roof, a kitchen, or a repair. It’s your home. We
            make the first step feel a little simpler.
          </p>
          <div className="premium-benefits">
            {[
              [
                PhoneCall,
                "A real conversation",
                "Talk through your needs when you’d rather explain than type.",
              ],
              [
                LayoutGrid,
                "Your whole home, covered",
                "Explore a broad range of repair and improvement categories.",
              ],
              [
                HeartHandshake,
                "A choice that stays yours",
                "Ask questions, compare your options, and decide on your terms.",
              ],
              [
                ShieldCheck,
                "A clear, considered process",
                "Know the next step before sharing your project information.",
              ],
            ].map(([Icon, title, text]) => (
              <div key={title}>
                <span>
                  <Icon size={23} />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <Link to="/about" className="text-link">
            Get to know Call Home Project Pros <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
