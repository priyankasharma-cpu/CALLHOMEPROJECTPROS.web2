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
  const sections = privacy
    ? [
        [
          "Information you provide",
          "Project requests include your name, email, phone number, ZIP code, service category, project description, timing, and relationship to the property. General inquiries include your name, email, optional phone number, inquiry type, and message. Submitted information is saved so we can process your request and support your inquiry. Please do not include payment details or highly sensitive personal or financial information.",
        ],
        [
          "How information is used",
          "We use your information to understand your project or question, review your request, respond to your inquiry, and determine an appropriate next step. Submitting a form is not a commitment to hire a contractor. Any additional disclosure presented with a request explains the contact permissions you are being asked to provide.",
        ],
        [
          "Technical and referral information",
          "Project requests may include the page where your visit started, referral information, campaign parameters, advertising click identifiers, and browser information. Inquiries include the starting page, referrer, and browser information. This information helps us understand how requests reach the website and support the request process.",
        ],
        [
          "Website preferences and measurement",
          "Your readability choices are saved in your browser so they continue across pages and visits. Referral information is kept in session storage during your visit. When optional measurement tools are configured, they load after you choose to allow measurement. Your measurement choice is saved on your device. You can clear saved website data through your browser settings.",
        ],
        [
          "Processing and access",
          "Form information is processed through the website?s application and database services. Hosting and database service providers process information as part of operating those services. A form submission does not automatically send your details to a contractor. If a next step involves sharing your information with a service provider, review the information-sharing details presented for that step.",
        ],
        [
          "Questions about your information",
          "Use our contact form and select Privacy inquiry to ask about information you have submitted, request a correction or deletion, or ask about retention and handling. Include enough information to identify your request without sending sensitive documents. We may need to confirm your identity before addressing a request.",
        ],
      ]
    : [
        [
          "Using this website",
          "Call Home Project Pros helps homeowners and property decision-makers describe home projects and take the next step through phone conversations and online requests. Provide accurate contact and project information and only submit details you are authorized to share. Do not use forms for unlawful content, automated spam, or sensitive financial information.",
        ],
        [
          "Project requests and inquiries",
          "Submitting a project request or inquiry sends your information for review. A confirmation means your submission was received; it does not confirm a contractor booking, a service appointment, or acceptance of a project. You can call our team to discuss your request and next steps.",
        ],
        [
          "Independent service providers",
          "Call Home Project Pros is a project connection platform, not a contractor. Provider availability, response times, pricing, and outcomes vary. Any work must be agreed directly with the provider you choose. Verify qualifications, insurance, permits, and written terms before authorizing work.",
        ],
        [
          "Estimate requests and costs",
          "There is no charge to submit an estimate request through this website and no obligation to hire. Providers set their own prices. Ask about assessment, visit, diagnostic, material, and labor costs before scheduling or agreeing to work.",
        ],
        [
          "Planning information",
          "Service descriptions and resource guides provide general planning information. They are not a substitute for an on-site evaluation or a provider?s written estimate. Project requirements vary by property, location, materials, and scope. This website is not an emergency service; contact the appropriate emergency service or utility if there is an immediate danger.",
        ],
        [
          "Contact and privacy",
          "For questions about this website or a submitted request, use the contact form or call our home project team. Our Privacy Policy explains how form information and website preferences are handled.",
        ],
      ];
  return (
    <section className="section container narrow legal-page prose">
      <span className="eyebrow">CLEAR INFORMATION. INFORMED CHOICES.</span>
      <h1>{privacy ? "Privacy Policy" : "Terms of Use"}</h1>
      <p>
        {privacy
          ? "How Call Home Project Pros handles information provided through this website."
          : "What to expect when using Call Home Project Pros."}
      </p>
      {sections.map(([heading, copy]) => (
        <section key={heading}>
          <h2>{heading}</h2>
          <p>{copy}</p>
        </section>
      ))}
      <Link className="text-link" to="/contact">
        Contact our team <ArrowRight size={17} />
      </Link>
      <p>
        <Link to={privacy ? "/terms" : "/privacy-policy"}>
          {privacy ? "Terms of Use" : "Privacy Policy"}
        </Link>
      </p>
    </section>
  );
}
