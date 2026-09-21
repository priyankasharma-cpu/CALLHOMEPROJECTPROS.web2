import { Link } from "react-router-dom";
import { ArrowUpRight, Clock3 } from "lucide-react";
import ServiceImage from "./ServiceImage";
export const guideMinutes = (guide) =>
  Math.max(
    1,
    Math.ceil(
      (guide.intro + " " + guide.sections.flat().join(" ")).split(/\s+/)
        .length / 220,
    ),
  );
export default function GuideCard({
  guide,
  base = "/resources",
  featured = false,
}) {
  return (
    <Link
      className={`editorial-card ${featured ? "featured" : ""}`}
      to={`${base}/${guide.slug}`}
    >
      <div className="editorial-image">
        {guide.service ? (
          <ServiceImage slug={guide.service} />
        ) : (
          <img
            src="/images/contractors.webp"
            alt="Home improvement professionals reviewing a renovation project"
            loading="lazy"
            width="1000"
            height="700"
          />
        )}
        <span className="image-category">
          {guide.category || "Project cost guide"}
        </span>
        <span className="image-arrow">
          <ArrowUpRight size={22} />
        </span>
      </div>
      <div className="editorial-body">
        <span className="article-meta">
          <Clock3 size={14} />
          {guideMinutes(guide)} min read <i /> HOMEOWNER KNOW-HOW
        </span>
        <h3>{guide.title}</h3>
        <p>{guide.intro}</p>
        <span className="text-link">
          Read the guide <ArrowUpRight size={17} />
        </span>
      </div>
    </Link>
  );
}
