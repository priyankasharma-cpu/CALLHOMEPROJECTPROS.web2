import { Link } from "react-router-dom";
import { House, ArrowRight } from "lucide-react";
import SEOHead from "../components/SEOHead";
export default function NotFound() {
  return (
    <>
      <SEOHead
        title="Page Not Found"
        description="Find your way back to home services and project guides."
        noindex
      />
      <section className="not-found container">
        <House size={48} />
        <span className="eyebrow">404 · A SMALL DETOUR</span>
        <h1>Let’s get you back home.</h1>
        <p>
          We couldn’t find that page. Your next home project is still a click
          away.
        </p>
        <Link to="/" className="button primary">
          Back to Home <ArrowRight size={18} />
        </Link>
        <Link to="/services" className="text-link">
          Explore home services
        </Link>
      </section>
    </>
  );
}
