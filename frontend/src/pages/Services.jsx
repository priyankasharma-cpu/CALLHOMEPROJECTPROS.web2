import ServicesGrid from "../components/ServicesGrid";
import { Breadcrumbs, FinalCTA } from "../components/Sections";
import SEOHead from "../components/SEOHead";
export default function Services() {
  return (
    <>
      <SEOHead
        title="Explore Home Services"
        description="Explore roofing, HVAC, plumbing, windows, remodeling, and more. Find helpful project information and your next step toward an estimate."
      />
      <div className="page-intro">
        <div className="container">
          <Breadcrumbs items={[{ label: "Services" }]} />
          <span className="eyebrow">EVERY HOME HAS A TO-DO LIST</span>
          <h1>
            Find a starting point
            <br /> for your next project.
          </h1>
          <p>
            From the roof over your head to the rooms you love most. Explore
            home services and plan your next step.
          </p>
        </div>
      </div>
      <section className="section container">
        <ServicesGrid full />
      </section>
      <FinalCTA />
    </>
  );
}
