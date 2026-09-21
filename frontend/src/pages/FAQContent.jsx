import { useState } from "react";
import { PhoneCall, ShieldCheck } from "lucide-react";
import CallCTA from "../components/CallCTA";
import { Breadcrumbs, FAQAccordion, FinalCTA } from "../components/Sections";
import { homeFAQs } from "../data/content";
const groups = {
  "All questions": homeFAQs,
  "Getting started": [homeFAQs[0], homeFAQs[1], homeFAQs[4], homeFAQs[5]],
  "The process": [homeFAQs[2], homeFAQs[3], homeFAQs[7]],
  "Your information": [homeFAQs[6]],
};
export default function FAQContent() {
  const [category, setCategory] = useState("All questions");
  return (
    <>
      <section className="faq-editorial-hero">
        <div className="container">
          <Breadcrumbs items={[{ label: "Frequently asked questions" }]} />
          <span className="eyebrow">LET’S CLEAR A FEW THINGS UP</span>
          <h1>
            Good questions.
            <br />{" "}
            <span className="gradient-text">Straightforward answers.</span>
          </h1>
          <p>What to know about us, your request, and the next step.</p>
          <div className="faq-hero-symbol" aria-hidden="true">
            ?
          </div>
        </div>
      </section>
      <section className="section container faq-hub">
        <aside>
          <span className="eyebrow">FIND YOUR ANSWER</span>
          <div className="faq-category-list">
            {Object.keys(groups).map((group) => (
              <button
                key={group}
                className={category === group ? "selected" : ""}
                onClick={() => setCategory(group)}
                aria-pressed={category === group}
              >
                {group}
                <span>{groups[group].length}</span>
              </button>
            ))}
          </div>
          <div className="faq-call-card">
            <PhoneCall size={29} />
            <h2>Still have questions?</h2>
            <p>Talk with us about your home project.</p>
            <CallCTA compact location="faq_page_call" />
          </div>
        </aside>
        <div>
          <div className="faq-selected-title">
            <ShieldCheck size={23} />
            <h2>{category}</h2>
          </div>
          <FAQAccordion items={groups[category]} />
        </div>
      </section>
      <FinalCTA />
    </>
  );
}
