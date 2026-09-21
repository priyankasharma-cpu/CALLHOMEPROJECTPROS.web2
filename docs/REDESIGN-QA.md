# Premium redesign — September 17, 2026

The existing React/Vite application was redesigned in place. Express routes, Mongoose models, request schemas, API payloads, consent gates, and attribution storage were retained.

## Implemented

- Layered homepage and service heroes, shared gradient call buttons, image-driven service discovery, navy conversion panels, visual process, and split-layout benefits.
- Redesigned About, Contact, Resources, cost-guide hub, guide articles, FAQ, quote presentation, footer, and mobile navigation/action bar.
- All 19 service pages use the shared expanded design and service-specific photo mapping. Local WebP assets have small/large variants; below-the-fold images lazy-load.
- Central trust-claim configuration renders only enabled, verified claims. Sample numerical claims remain disabled.
- Existing SEO, prerendering, structured data, and route splitting remain in place. No new UI or animation dependency was added.

## Verification

- Production build and 40-route prerender completed successfully.
- Automated output checks cover one H1 per page, canonical metadata, internal links, image paths, nonempty alt text, service WebP format, and image byte budgets.
- No unused frontend imports detected with Babel scope analysis.
- Three backend validation/API safety tests passed.
- Browser checks covered service filtering, service-card routing, desktop mega-menu/Escape, mobile navigation, FAQ expansion, and all seven quote steps with synthetic data. Back navigation retained entered values; invalid ZIP input produced the expected error.
- No horizontal document overflow on tested home, Contact, service, About, Resources, FAQ, and quote layouts. Expanded checks for service/About/Resources/FAQ/quote covered 320, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px.
- Production-preview homepage and Contact pages loaded without new console errors. An earlier Vite hot-reload root warning was corrected by preserving the development React root.

## Launch dependencies and limits

- A real phone number is not configured. Call buttons remain visibly unavailable; the shared component generates `tel:` links and click events when a valid number is supplied.
- Lead collection remains disabled until the actual consent disclosure/version and enablement configuration are provided. Browser QA reached review without submitting personal data.
- Live MongoDB persistence was not verified. The earlier local memory-server test could not start because the Windows runtime DLL was missing; the proposed runtime repair was declined. Backend persistence code was preserved.
- Lighthouse/Core Web Vitals have not been measured against a deployed production origin. Layout and asset checks are not a substitute for those measurements.

Image sources are recorded in IMAGE-CREDITS.md. Setup and production configuration are described in the root README.md.
