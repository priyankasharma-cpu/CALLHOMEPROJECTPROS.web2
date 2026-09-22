import { useSearchParams } from "react-router-dom";
import { Check, PhoneCall } from "lucide-react";
import LeadForm from "../components/LeadForm";
import CallCTA from "../components/CallCTA";
import SEOHead from "../components/SEOHead";
import { Breadcrumbs } from "../components/Sections";
export default function Quote() {
  const [params] = useSearchParams();
  return (
    <>
      <SEOHead
        title="Request a Home Project Estimate"
        description="Tell us about your home project with our step-by-step estimate request."
        noindex
      />
      <div className="container">
        <Breadcrumbs items={[{ label: "Request an estimate" }]} />
      </div>
      <section className="quote-page section">
        <div className="container quote-layout">
          <aside>
            <span className="eyebrow">A CLEAR NEXT STEP</span>
            <h1>
              Let’s make room
              <br /> for your plans.
            </h1>
            <p>
              Big improvements or everyday repairs. It starts with a little
              information about your home.
            </p>
            <ul className="check-list">
              <li>
                <Check /> One simple project request
              </li>
              <li>
                <Check /> No obligation to hire
              </li>
              <li>
                <Check /> You decide what happens next
              </li>
            </ul>
            <div className="quote-call-box">
              <PhoneCall size={27} />
              <h3>Rather talk it through?</h3>
              <p>Call to discuss your project, location, and next steps.</p>
              <CallCTA location="lead_form_call" />
            </div>
            <img
              className="quote-aside-image"
              src="/images/homeowner-phone.webp"
              alt="Homeowner planning her next steps from the comfort of home"
              width="1000"
              height="750"
              loading="lazy"
            />
          </aside>
          <LeadForm initialService={params.get("service") || ""} />
        </div>
      </section>
    </>
  );
}
