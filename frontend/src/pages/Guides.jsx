import { Link, useLocation, useParams } from "react-router-dom";
import GuideCard from "../components/GuideCard";
import ServiceImage from "../components/ServiceImage";
import ResourceHub from "../components/ResourceHub";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { costGuides, resources } from "../data/guides";
import { Breadcrumbs } from "../components/Sections";
import SEOHead from "../components/SEOHead";
import CallCTA from "../components/CallCTA";
import NotFound from "./NotFound";
import { siteConfig } from "../config/siteConfig";
export default function Guides() {
  const location = useLocation();
  const { slug } = useParams();
  const cost = location.pathname.startsWith("/cost-guides");
  const base = cost ? "/cost-guides" : "/resources";
  const collection = cost ? costGuides : resources;
  const label = cost ? "Cost Guides" : "Homeowner Guides";
  const guide = collection.find((g) => g.slug === slug);
  if (slug && !guide) return <NotFound />;
  if (!slug) return <ResourceHub cost={cost} collection={collection} />;
  if (guide)
    return (
      <>
        <SEOHead
          title={guide.title}
          description={guide.intro}
          schema={{
            "@type": "Article",
            headline: guide.title,
            description: guide.intro,
            author: { "@type": "Organization", name: siteConfig.brandName },
            publisher: { "@id": siteConfig.siteUrl + "/#organization" },
            mainEntityOfPage: siteConfig.siteUrl + base + "/" + guide.slug,
          }}
        />
        <div className="container">
          <Breadcrumbs items={[{ label, to: base }, { label: guide.title }]} />
        </div>
        <header className="article-header container narrow">
          <span className="eyebrow">
            {cost ? "UNDERSTAND THE SCOPE BEFORE THE PRICE" : guide.category}
          </span>
          <h1>{guide.title}</h1>
          <p>{guide.intro}</p>
          <div className="article-byline">
            <BookOpen size={17} /> A homeowner planning guide · Call Home
            Project Pros
          </div>
        </header>
        <div className="container article-cover">
          {guide.service ? (
            <ServiceImage slug={guide.service} hero />
          ) : (
            <img
              src="/images/contractors.webp"
              alt="Home renovation professionals discussing a project"
              width="1000"
              height="700"
              fetchPriority="high"
            />
          )}
        </div>
        <div className="container detail-layout article-layout">
          <article className="prose">
            {cost && (
              <div className="notice">
                <strong>Every project has its own price.</strong>
                <p>
                  We do not publish unverified price ranges. Location,
                  materials, property conditions, labor, complexity, and
                  provider terms all affect the final estimate.
                </p>
              </div>
            )}
            <nav className="article-toc" aria-label="In this guide">
              <h2>In this guide</h2>
              {guide.sections.map(([title], i) => (
                <a href={`#section-${i}`} key={title}>
                  {String(i + 1).padStart(2, "0")} <span>{title}</span>
                  <ArrowRight size={16} />
                </a>
              ))}
            </nav>
            {guide.sections.map(([title, body], i) => (
              <section id={`section-${i}`} key={title}>
                <h2>{title}</h2>
                <p>{body}</p>
              </section>
            ))}
            <div className="article-takeaway">
              <span className="eyebrow">YOUR NEXT STEP</span>
              <h2>Bring a clear brief to the conversation.</h2>
              <ul className="check-list">
                <li>
                  <Check /> Write down your goals and questions.
                </li>
                <li>
                  <Check /> Compare the same scope across estimates.
                </li>
                <li>
                  <Check /> Confirm qualifications and terms before hiring.
                </li>
              </ul>
            </div>
            {guide.service && (
              <Link to={`/services/${guide.service}`} className="text-link">
                Explore this home service <ArrowRight size={17} />
              </Link>
            )}
          </article>
          <aside className="detail-sidebar">
            <span className="eyebrow">FROM READING TO PLANNING</span>
            <h3>Have a project in mind?</h3>
            <p>Start with a conversation or tell us what you have planned.</p>
            <CallCTA location="guide_call" service={guide.service} />
            <Link
              className="button secondary"
              to={`/quote${guide.service ? "?service=" + guide.service : ""}`}
            >
              Request a Free Quote <ArrowRight size={17} />
            </Link>
          </aside>
        </div>
        <section className="section container">
          <h2>Keep exploring</h2>
          <div className="guide-preview-grid guide-related">
            {collection
              .filter((g) => g.slug !== slug)
              .slice(0, 3)
              .map((g, i) => (
                <GuideCard guide={g} base={base} index={i} key={g.slug} />
              ))}
          </div>
        </section>
      </>
    );
  return <NotFound />;
}
