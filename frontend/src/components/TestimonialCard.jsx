// Render only business-supplied, publication-approved testimonials.
export default function TestimonialCard({ testimonial }) {
  if (!testimonial?.approved || !testimonial.quote || !testimonial.name)
    return null;
  return (
    <figure className="testimonial-card">
      <blockquote>{testimonial.quote}</blockquote>
      <figcaption>
        {testimonial.name}
        {testimonial.project && ` · ${testimonial.project}`}
      </figcaption>
    </figure>
  );
}
