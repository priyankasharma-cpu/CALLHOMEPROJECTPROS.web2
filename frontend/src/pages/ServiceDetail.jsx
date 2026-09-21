import { Link, useParams } from "react-router-dom";
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  ShieldCheck,
  CircleHelp,
  Layers,
  MapPin,
} from "lucide-react";
import { getService, relatedServices } from "../data/services";
import CallCTA from "../components/CallCTA";
import ServiceImage from "../components/ServiceImage";
import LeadForm from "../components/LeadForm";
import { ServiceCard } from "../components/ServicesGrid";
import {
  Breadcrumbs,
  TrustStrip,
  HowItWorks,
  CallBanner,
  FAQAccordion,
  FinalCTA,
  SectionHeading,
} from "../components/Sections";
import SEOHead from "../components/SEOHead";
import { siteConfig } from "../config/siteConfig";
import NotFound from "./NotFound";
export default function ServiceDetail() {
  const { slug } = useParams();
  const s = getService(slug);
  if (!s) return <NotFound />;
  const related = relatedServices(s);
  return (
    <>
      <SEOHead
        title={s.seoTitle}
        description={s.seoDescription}
        schema={[
          {
            "@type": "Service",
            name: s.title + " project connection",
            description: s.seoDescription,
            provider: { "@id": siteConfig.siteUrl + "/#organization" },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteConfig.siteUrl + "/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: siteConfig.siteUrl + "/services",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: s.title,
                item: siteConfig.siteUrl + "/services/" + slug,
              },
            ],
          },
        ]}
      />
      <section className="premium-service-hero">
        <div className="container">
          <Breadcrumbs
            items={[{ label: "Services", to: "/services" }, { label: s.title }]}
          />
          <div className="service-editorial-grid">
            <div>
              <span className="service-badge">
                <HouseSymbol /> {s.category}
              </span>
              <h1>
                {s.title}.<br />{" "}
                <span className="gradient-text">
                  A better start
                  <br /> for your home.
                </span>
              </h1>
              <p>
                {s.shortDescription} Tell us what you have in mind and take the
                next step toward a project estimate.
              </p>
              <div className="service-hero-actions">
                <CallCTA
                  variant="service"
                  location={slug + "_page_call"}
                  service={slug}
                />
                <Link className="hero-quote-link" to={"/quote?service=" + slug}>
                  Start online{" "}
                  <strong>
                    Request a Quote <ArrowRight size={17} />
                  </strong>
                </Link>
              </div>
              <div className="hero-assurances">
                <span>
                  <Check /> No-obligation request
                </span>
                <span>
                  <Check /> Your choice, always
                </span>
              </div>
            </div>
            <div className="service-hero-photo">
              <ServiceImage slug={slug} hero />
              <div className="service-photo-label">
                <span>LET’S MAKE A PLAN</span>
                <strong>{s.projects[0]}</strong>
              </div>
              <div className="service-floating-note">
                <ShieldCheck size={27} />
                <div>
                  <strong>Clarity before commitment.</strong>
                  <span>A conversation is a great first step.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <TrustStrip />
      <section className="section container service-overview">
        <div>
          <span className="eyebrow">
            FOR THE HOME YOU HAVE. AND THE HOME YOU WANT.
          </span>
          <h2>
            Let’s talk about
            <br /> your {s.title.toLowerCase()} project.
          </h2>
        </div>
        <div>
          <p>{s.description}</p>
          <Link className="text-link" to={"/quote?service=" + slug}>
            Tell us about your project <ArrowUpRight size={19} />
          </Link>
        </div>
      </section>
      <section className="section service-project-section">
        <div className="container">
          <SectionHeading
            eyebrow="FIND YOUR STARTING POINT"
            title="What does your home need?"
            text={
              "Common " +
              s.title.toLowerCase() +
              " projects to discuss with a provider."
            }
          />
          <div className="visual-project-grid">
            {s.projects.map((p, i) => (
              <Link
                to={"/quote?service=" + slug}
                className="visual-project-card"
                key={p}
              >
                <div className="project-visual">
                  {i === 0 ? (
                    <Layers size={38} />
                  ) : i === 1 ? (
                    <ClipboardList size={38} />
                  ) : (
                    <CircleHelp size={38} />
                  )}
                  <span>0{i + 1}</span>
                </div>
                <div>
                  <h3>{p}</h3>
                  <p>
                    Explore the scope, talk through your priorities, and ask
                    what an assessment includes.
                  </p>
                  <span className="text-link">
                    Discuss your project <ArrowRight size={17} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section container service-considerations">
        <div className="service-secondary-photo">
          <ServiceImage slug={slug} />
          <div>
            <CircleHelp size={27} />
            <strong>
              A closer look can bring
              <br /> a clearer answer.
            </strong>
          </div>
        </div>
        <div>
          <span className="eyebrow">KNOW WHAT TO LOOK FOR</span>
          <h2>
            Small signs.
            <br /> A good reason to ask.
          </h2>
          <p>
            Not every issue needs a major project. These are useful starting
            points for a professional assessment.
          </p>
          <div className="sign-cards">
            {s.signs.map((sign) => (
              <div key={sign}>
                <Check size={20} />
                <strong>{sign}</strong>
              </div>
            ))}
          </div>
          <p className="service-safety-note">
            These observations are not a diagnosis. For immediate hazards,
            contact the appropriate emergency service or utility.
          </p>
          <CallCTA location={slug + "_considerations_call"} service={slug} />
        </div>
      </section>
      <section className="section cost-factor-section">
        <div className="container">
          <div className="cost-factor-header">
            <div>
              <span className="eyebrow">A LITTLE PLANNING GOES A LONG WAY</span>
              <h2>
                Know the details.
                <br /> Understand the estimate.
              </h2>
            </div>
            <p>{s.advice}</p>
          </div>
          <div className="cost-factor-cards">
            {s.factors.map((factor, i) => (
              <div key={factor}>
                <span className="factor-icon">
                  {i === 0 ? (
                    <Layers />
                  ) : i === 1 ? (
                    <ClipboardList />
                  ) : (
                    <MapPin />
                  )}
                </span>
                <span className="factor-label">
                  COST CONSIDERATION 0{i + 1}
                </span>
                <h3>{factor}</h3>
                <p>
                  Ask how this affects the scope, materials, and labor in your
                  written estimate.
                </p>
              </div>
            ))}
          </div>
          <div className="cost-factor-bottom">
            <p>
              Location, property conditions, labor, complexity, and provider
              terms affect pricing. We don’t publish unverified price ranges.
            </p>
            <Link className="text-link" to="/cost-guides">
              Explore cost guides <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      <HowItWorks />
      <CallBanner service={slug} />
      <section className="section service-quote-section" id="request-quote">
        <div className="container quote-layout">
          <aside>
            <span className="eyebrow">READY WHEN YOU ARE</span>
            <h2>
              Your {s.title.toLowerCase()} project.
              <br />{" "}
              <span className="text-green">Let’s take the first step.</span>
            </h2>
            <p>
              Tell us a little about your home, your plans, and your timing.
            </p>
            <div className="quote-call-box">
              <h3>Prefer to talk?</h3>
              <p>Start with a conversation when our phone line is available.</p>
              <CallCTA location={slug + "_form_call"} service={slug} />
            </div>
          </aside>
          <LeadForm key={slug} initialService={slug} />
        </div>
      </section>
      <section className="section faq-section">
        <div className="container faq-grid">
          <div>
            <span className="eyebrow">A LITTLE CLARITY BEFORE YOU BEGIN</span>
            <h2>
              {s.title}
              <br /> questions, answered.
            </h2>
            <p>Know what to expect as you plan your next step.</p>
            <CallCTA compact location={slug + "_faq_call"} service={slug} />
          </div>
          <FAQAccordion items={s.faqs} />
        </div>
      </section>
      {related.length > 0 && (
        <section className="section container">
          <SectionHeading
            eyebrow="WHILE YOU’RE MAKING PLANS"
            title="More possibilities for your home."
            action={{ to: "/services", label: "All Services" }}
          />
          <div className="related-grid">
            {related.map((item) => (
              <ServiceCard service={item} key={item.slug} />
            ))}
          </div>
        </section>
      )}
      <FinalCTA />
    </>
  );
}
function HouseSymbol() {
  return <ShieldCheck size={15} />;
}
