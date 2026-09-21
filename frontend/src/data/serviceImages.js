export const serviceImages = {
  roofing: {
    id: 38028508,
    alt: "Roofing professionals installing shingles on a residential roof in Texas",
  },
  hvac: {
    id: 7347538,
    alt: "Technician servicing an outdoor air conditioning system",
  },
  "air-conditioning": {
    id: 5463582,
    alt: "Air conditioning technician inspecting cooling equipment",
  },
  windows: {
    id: 5691521,
    alt: "Professional installing a window frame in a bright home interior",
  },
  plumbing: {
    id: 32588548,
    alt: "Plumber using a wrench to repair a pipe connection",
  },
  electrical: {
    id: 21812143,
    alt: "Electrician inspecting wiring inside an electrical panel",
  },
  "bathroom-remodeling": {
    id: 11701114,
    alt: "Remodeled bathroom with marble finishes and a glass shower",
  },
  "kitchen-remodeling": {
    id: 5071145,
    alt: "Bright remodeled kitchen with white cabinets and a large island",
  },
  flooring: {
    id: 4263067,
    alt: "Flooring installer carefully fitting wood laminate planks",
  },
  gutters: { id: 20113440, alt: "Rainwater flowing from a roof gutter" },
  siding: {
    id: 16548655,
    alt: "White home exterior with wood siding and green landscaping",
  },
  "pest-control": {
    id: 4894608,
    alt: "Person wearing protective gear applying a treatment in a garden",
  },
  "water-damage-restoration": {
    id: 29181495,
    alt: "Exposed wall and tile assembly during an interior restoration project",
  },
  "lawn-care": {
    id: 6728925,
    alt: "Lawn mower cutting green grass on a sunny day",
  },
  "home-security": {
    id: 26597080,
    alt: "Indoor security camera installed in a modern home",
  },
  "moving-services": {
    id: 7464687,
    alt: "Moving professionals carrying boxes into a home",
  },
  doors: {
    id: 8353352,
    alt: "Welcoming residential front door framed by brickwork and a garden",
  },
  heating: {
    id: 5691543,
    alt: "Home heating radiator beneath a sunlit window",
  },
  "furnace-services": {
    id: 7347538,
    alt: "Heating and cooling technician inspecting home comfort equipment",
  },
};
export function serviceImage(slug, size = "large") {
  const entry = serviceImages[slug] || serviceImages.roofing;
  const assetSlug = slug === "furnace-services" ? "hvac" : slug;
  return { src: `/images/services/${assetSlug}-${size}.webp`, alt: entry.alt };
}
