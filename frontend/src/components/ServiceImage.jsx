import { serviceImage } from "../data/serviceImages";
export default function ServiceImage({
  slug,
  hero = false,
  className = "",
  size = "large",
}) {
  const large = serviceImage(slug);
  const small = serviceImage(slug, "small");
  return (
    <img
      className={className}
      src={size === "small" ? small.src : large.src}
      srcSet={`${small.src} 640w, ${large.src} 1200w`}
      sizes={
        hero
          ? "(max-width: 760px) 100vw, 50vw"
          : "(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
      }
      alt={large.alt}
      width={1200}
      height={800}
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : undefined}
    />
  );
}
