# Call Home Project Pros

React/Vite + Express/Mongoose home-services project connection website. JavaScript throughout; no Next.js or TypeScript.

## Run locally

Requires Node 20.19+ (Node 24 tested), npm, and a MongoDB instance.

```sh
npm ci
npm run dev
```

The frontend is at `http://127.0.0.1:5173`. In development its centralized API URL defaults to `http://localhost:5000`; Vite also proxies relative `/api` requests there.

The local `backend/.env` has been created with an empty `MONGODB_URI`. Add your complete URI there and restart with `npm run dev:api`. The backend explicitly loads this file regardless of the command's working directory. It uses database `callinglead` and collection `leadform`. Never place database credentials in `VITE_` values. `FRONTEND_URL` is a comma-separated CORS allowlist; both localhost and 127.0.0.1 on port 5173 are included for local development.

```sh
npm run build
npm run check
npm test
```

The build creates `dist/` with 40 prerendered routes, per-page metadata, JSON-LD, `sitemap.xml`, and `robots.txt`. `npm test` runs database-independent validation, security, and controller contract tests. `npm run test:integration --workspace backend` runs real MongoDB persistence tests. It uses `TEST_MONGODB_URI` if supplied (only use a dedicated test cluster; tests write synthetic records in `callinglead`), otherwise a temporary MongoDB instance. On Windows the downloaded MongoDB binary requires the Microsoft Visual C++ x64 runtime.

## Architecture

- `frontend/src/config/siteConfig.js`: brand, phone, support, lead and consent settings.
- `frontend/src/data/`: service descriptions, guide content, FAQs.
- `frontend/src/components/`: navigation, call actions, forms, sections, SEO, tracking.
- `frontend/src/pages/`: route-level pages loaded separately.
- `frontend/scripts/`: prerendering and static output validation.
- `backend/models/`: Lead and Inquiry schemas, unique request identifiers.
- `backend/controllers/`: persistence and idempotent submissions.
- `backend/middleware/`: validation and consistent error handling.
- `backend/app.js`: security headers, CORS, rate limits, API routes.
- `backend/server.js`: database connection, index initialization, graceful shutdown.

## API

- `POST /api/leads`: validates and persists a project request.
- `POST /api/inquiries`: validates and persists a support inquiry.
- `GET /api/health`: returns 200 only while MongoDB is connected.

Both POST routes require a UUID v4 `Idempotency-Key`. An identical retry returns the existing reference. Reusing the key with a different payload returns 409. No lead read/export endpoint is publicly exposed. A saved request does not mean a provider has been contacted: no invented CRM or provider-routing integration is included.

## Launch configuration

Shared call CTAs use the supplied business number `(888) 240-1827`. `VITE_PHONE_NUMBER` can override it centrally.

The lead form sends real requests to the API; its confirmation modal opens only after the API confirms a saved ObjectId. Lead collection defaults to enabled, with `LEADS_ENABLED=false` available to pause it. Without a configured disclosure, the backend records the submitted consent boolean/version without granting consent or inventing wording. If approved consent text/version are configured, the backend requires acceptance and a matching version, then records the server-side wording and timestamp. The separate inquiry form retains its disclosure and frontend enablement requirements. There is no demo/localStorage fallback in the real lead route.

Run `npm run test --workspace frontend` for submission UI regression tests. See `docs/SUBMISSION-EXPERIENCE.md` for the isolated visual fixture and configuration details.

Before public launch:

1. Supply the real telephone number, support email, operator identity, business hours where applicable, and actual provider-routing model.
2. Replace the clearly labeled Privacy Policy and Terms drafts with approved business-specific content. Update the FAQ and contact disclosures to match actual operations. Remove legal-page noindex only when those pages are finalized.
3. Set matching consent text/version and enable lead collection in both environments. If inquiries have a different purpose, supply a separate approved inquiry disclosure before enabling that form.
4. Deploy the Express API to a Node host with MongoDB connectivity. Set the production CORS allowlist and accurate `TRUST_PROXY` for that hosting topology. Use a persistent/shared rate-limit store if deploying multiple instances.
5. Prefer a same-origin `/api` reverse proxy. If using a separate API origin, set `VITE_API_URL` and add its exact HTTPS origin to `connect-src` in `frontend/public/_headers` before rebuilding.
6. Configure backups, access controls, retention/deletion procedures, monitoring, and the real lead handling workflow. No admin portal or notification recipient has been assumed.
7. Connect the production domain and verify calls, a real authorized lead submission, and provider/support handling before buying traffic.

## Hosting

The Sites manifest deploys the static frontend only. Sites’ Worker runtime does not host a persistent Express/Mongoose server or direct MongoDB TCP connection. The included backend must run separately; the private site preview deliberately leaves collection disabled. For another static host, serve the generated route directories and `404.html` with an actual 404 status for unknown URLs. `_headers` contains a CSP and cache rules for compatible hosts; configure equivalent headers elsewhere.

## Tracking

First-touch UTM and click IDs persist in session storage for the current journey. Tracking helpers push events without contact details into `window.dataLayer`. Calls record CTA location, route, selected service where supplied, and attribution. GTM or direct GA4 load only with configured IDs and affirmative optional-measurement consent; use GTM for Meta and Microsoft deployment-specific tags. No third-party scripts load by default. Configure ad conversions in the relevant account; event hooks alone are not an ad-account integration.

Optional measurement preferences should be accompanied by the finalized privacy/cookie wording for the operating business. Test configured tags against the CSP before enabling them.

## Content and images

19 service pages, four cost-factor guides, and five homeowner guides. No price estimates, reviews, awards, coverage counts, or provider guarantees are invented. Testimonials render only if supplied and explicitly approved. Location pages are intentionally unpublished until coverage and unique local content are supplied. Stock-image sources are in `docs/IMAGE-CREDITS.md`.

## Accessibility and performance

Semantic headings, skip navigation, labeled fields, live errors, keyboard-operable menus/accordions, focus styles, reduced motion, and mobile safe-area spacing. Optimized local WebP assets and self-hosted Latin fonts keep external requests out of the default experience. Routes are split into chunks, with complete static HTML generated for search engines.
