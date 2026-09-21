import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Breadcrumbs, HowItWorks, FinalCTA } from "../components/Sections";
import SEOHead from "../components/SEOHead";
import AboutContent from "./AboutContent";
import ContactContent from "./ContactContent";
import FAQContent from "./FAQContent";
export default function Information() {
  const { pathname } = useLocation();
  const kind = pathname.slice(1);
  const title = {
    about: "About Call Home Project Pros",
    contact: "Let's Talk About Your Home Project",
    faq: "Frequently Asked Questions",
    "how-it-works": "How Home Project Requests Work",
    "privacy-policy": "Privacy Policy",
    terms: "Terms of Use",
  }[kind];
  return (
    <>
      <SEOHead
        title={title}
        description={
          kind === "faq"
            ? "Answers about estimate requests, availability, phone assistance, and your project connection."
            : "Explore how Call Home Project Pros helps homeowners understand services and take their next step."
        }
        noindex={kind === "privacy-policy" || kind === "terms"}
      />
      {kind === "about" ? (
        <AboutContent />
      ) : kind === "contact" ? (
        <ContactContent />
      ) : kind === "faq" ? (
        <FAQContent />
      ) : kind === "how-it-works" ? (
        <>
          <div className="page-intro">
            <div className="container">
              <Breadcrumbs items={[{ label: "How it works" }]} />
              <span className="eyebrow">ONE STEP AT A TIME</span>
              <h1>
                A clear way
                <br /> <span className="gradient-text">forward.</span>
              </h1>
              <p>
                Learn what to expect before starting your home project request.
              </p>
            </div>
          </div>
          <HowItWorks />
          <section className="section container narrow prose">
            <h2>What helps us understand your project?</h2>
            <ul className="check-list">
              {[
                "Your project's ZIP code and service category",
                "A brief description and preferred timing",
                "Your relationship to the property",
                "Contact details and the consent you choose to provide",
              ].map((text) => (
                <li key={text}>
                  <Check />
                  {text}
                </li>
              ))}
            </ul>
            <h2>What happens next is your choice.</h2>
            <p>
              A request is not a commitment to hire. Provider availability and
              response times vary. Discuss fees before arranging a visit, ask
              for a written scope, and independently evaluate any provider you
              consider.
            </p>
            <Link className="button primary" to="/quote">
              Start a Project Request <ArrowRight size={18} />
            </Link>
          </section>
          <FinalCTA />
        </>
      ) : (
        <>
          <div className="container">
            <Breadcrumbs items={[{ label: title }]} />
          </div>
          <Legal kind={kind} />
        </>
      )}
    </>
  );
}
function Legal({ kind }) {
  const privacy = kind === "privacy-policy";
  return (
    <section className="section container narrow legal-page prose">
      <span className="eyebrow">POLICY PUBLICATION STATUS</span>
      <h1>{privacy ? "Privacy Policy" : "Terms of Use"}</h1>
      <div className="notice">
        <strong>Draft — business-specific details pending.</strong>
        <p>
          This page is a clearly marked configuration placeholder, not a
          finalized legal policy. Online submissions remain disabled until the
          operating business supplies and approves the applicable disclosures.
        </p>
      </div>
      <h2>
        {privacy
          ? "Information to be finalized"
          : "Operating details to be finalized"}
      </h2>
      <p>
        {privacy
          ? "Before this service opens for requests, this page needs the legal business identity, privacy contact, collected information, purposes of use, service-provider sharing, retention practices, applicable rights, and request procedures."
          : "Before launch, this page needs the legal operator’s identity, contact details, applicable service terms, referral relationships, scope of platform responsibilities, and any jurisdiction-specific provisions reviewed for the actual business."}
      </p>
      <h2>{privacy ? "Current site behavior" : "About the platform"}</h2>
      <p>
        {privacy
          ? "The site keeps referral and campaign information in session storage to preserve the current journey. Form entries stay in browser memory until an enabled form is submitted. If optional analytics are configured, a measurement preference is stored on your device and scripts load only after you allow them. Hosting providers may process technical request data according to their own policies."
          : "Call Home Project Pros is designed as a project connection platform, not a contractor. Service and guide information is general planning content. It does not replace an on-site evaluation or a provider’s written estimate and agreement."}
      </p>
      <h2>
        {privacy
          ? "Project request disclosures"
          : "Independent provider relationships"}
      </h2>
      <p>
        {privacy
          ? "The final request step must describe the actual data-sharing and contact practices before collection is enabled. The approved disclosure and its version must match the backend configuration. No broad marketing consent or partner-sharing terms have been invented for this draft."
          : "Provider availability, response times, pricing, and outcomes are not guaranteed. Any work must be agreed directly with the chosen provider. Homeowners should verify qualifications and review the complete scope and terms before proceeding."}
      </p>
      <h2>Questions</h2>
      <p>
        Support details are configured centrally when supplied by the operating
        business. Visit the contact page for the current availability of contact
        options.
      </p>
      <Link className="text-link" to="/contact">
        Contact information <ArrowRight size={17} />
      </Link>
    </section>
  );
}
