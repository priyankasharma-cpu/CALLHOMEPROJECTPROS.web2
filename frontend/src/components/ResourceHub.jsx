import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import GuideCard, { guideMinutes } from "./GuideCard";
import ServiceImage from "./ServiceImage";
import SEOHead from "./SEOHead";
import { Breadcrumbs, SectionHeading, CallBanner } from "./Sections";
import { ServiceCard } from "./ServicesGrid";
import { getService } from "../data/services";
const topics = [
  "All Guides",
  "Roofing",
  "HVAC",
  "Windows",
  "Remodeling",
  "Plumbing",
  "Electrical",
  "Home Maintenance",
];
function topic(guide) {
  return (
    {
      roofing: "Roofing",
      hvac: "HVAC",
      windows: "Windows",
      "bathroom-remodeling": "Remodeling",
      plumbing: "Plumbing",
      electrical: "Electrical",
    }[guide.service] || "Home Maintenance"
  );
}
export default function ResourceHub({ cost, collection }) {
  const [category, setCategory] = useState("All Guides");
  const base = cost ? "/cost-guides" : "/resources";
  const featured = cost
    ? collection[0]
    : collection.find((g) => g.slug === "questions-to-ask-a-contractor") ||
      collection[0];
  const visible = collection.filter(
    (g) => category === "All Guides" || topic(g) === category,
  );
  return (
    <>
      <SEOHead
        title={cost ? "Home Project Cost Guides" : "Home Project Resources"}
        description={
          cost
            ? "Understand what goes into project estimates and learn how to compare costs."
            : "Helpful guides for smarter home improvements. Explore home maintenance, remodeling, and project planning."
        }
      />
      <section className="resource-hero">
        <div className="container">
          <Breadcrumbs
            items={[{ label: cost ? "Cost Guides" : "Resources" }]}
          />
          <div className="resource-heading">
            <div>
              <span className="eyebrow">THE HOMEOWNER’S NOTEBOOK</span>
              <h1>
                {cost ? (
                  <>
                    A clearer view
                    <br /> of{" "}
                    <span className="gradient-text">project costs.</span>
                  </>
                ) : (
                  <>
                    A little know-how.
                    <br />{" "}
                    <span className="gradient-text">A better next step.</span>
                  </>
                )}
              </h1>
            </div>
            <p>
              {cost
                ? "Understand the details behind an estimate. Make a plan with clearer priorities and better questions."
                : "Helpful guides for smarter home improvements. Practical ideas, useful questions, and a little clarity for the home you love."}
            </p>
          </div>
          <Link to={base + "/" + featured.slug} className="featured-story">
            <div className="featured-story-image">
              {featured.service ? (
                <ServiceImage slug={featured.service} hero />
              ) : (
                <img
                  src="/images/contractors.webp"
                  alt="Professionals reviewing renovation details before work begins"
                  width="1000"
                  height="700"
                  fetchPriority="high"
                />
              )}
              <span className="image-category">EDITOR’S PICK</span>
            </div>
            <div className="featured-story-copy">
              <span className="eyebrow">
                {cost ? "UNDERSTANDING YOUR ESTIMATE" : "BEFORE YOU BEGIN"}
              </span>
              <h2>{featured.title}</h2>
              <p>{featured.intro}</p>
              <span className="article-meta">
                <BookOpen size={16} />
                {guideMinutes(featured)} min read
              </span>
              <span className="button primary">
                Read the Guide <ArrowUpRight size={20} />
              </span>
            </div>
          </Link>
        </div>
      </section>
      <section className="section container">
        <SectionHeading
          eyebrow={cost ? "COMPARE MORE THAN THE NUMBER" : "BROWSE BY CATEGORY"}
          title={
            cost
              ? "Know what goes into your project."
              : "Find a little inspiration."
          }
        />
        {cost && (
          <div className="notice guide-notice">
            <strong>Real context. No invented price ranges.</strong>
            <p>
              Costs vary by location, materials, labor, property condition, and
              provider. These guides explain the factors to discuss in a written
              estimate.
            </p>
          </div>
        )}
        <div
          className="filter-tabs resource-filters"
          aria-label="Guide categories"
        >
          {topics.map((t) => (
            <button
              key={t}
              aria-pressed={category === t}
              className={category === t ? "selected" : ""}
              onClick={() => setCategory(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {visible.length ? (
          <div className="guide-preview-grid" key={category}>
            {visible.map((g) => (
              <GuideCard guide={g} base={base} key={g.slug} />
            ))}
          </div>
        ) : (
          <div className="category-service-prompt">
            <ServiceImage slug={category.toLowerCase()} size="small" />
            <div>
              <span className="eyebrow">START WITH THE ESSENTIALS</span>
              <h3>Planning a {category.toLowerCase()} project?</h3>
              <p>
                Explore common projects, considerations, and questions to ask on
                our service page.
              </p>
              <Link
                className="text-link"
                to={"/services/" + category.toLowerCase()}
              >
                Explore {category} <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        )}
      </section>
      <section className="section resource-projects">
        <div className="container">
          <SectionHeading
            eyebrow="FROM READING TO REAL POSSIBILITIES"
            title="What’s on your project list?"
            action={{ to: "/services", label: "All Services" }}
          />
          <div className="related-grid">
            {["roofing", "windows", "kitchen-remodeling"].map((slug) => (
              <ServiceCard key={slug} service={getService(slug)} />
            ))}
          </div>
        </div>
      </section>
      <CallBanner />
    </>
  );
}
