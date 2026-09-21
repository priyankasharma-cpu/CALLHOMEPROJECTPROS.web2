# Final submission experience

The existing seven-step LeadForm submits to POST /api/leads. A confirmation is shown only for an HTTP success response containing `success: true` and the persisted MongoDB reference returned by the existing controller. HTTP failures, network failures, malformed JSON, and incomplete success responses show the retry/call card instead.

In-flight clicks are guarded synchronously and buttons are disabled. Unchanged retries reuse the idempotency key; edited payloads get a new key. A completed form cannot submit again. Opening or closing the confirmation does not fire another `lead_success` event. Existing attribution fields and server validation remain intact.

The native modal dialog provides background isolation and keyboard focus containment. X and Escape close it, body scrolling is restored, and focus returns to the confirmation heading or reopening button. The shared CallCTA uses the configured number, now (888) 240-1827, including the confirmation and error states.

## Configuration before live collection

- Set `MONGODB_URI` in `backend/.env`; `.env.example` intentionally leaves it empty.
- Supply business-approved `CONSENT_TEXT` and `CONSENT_VERSION`, with matching `VITE_CONSENT_TEXT` and `VITE_CONSENT_VERSION`. The example files mark these as placeholders without inventing legal language.
- Backend `LEADS_ENABLED` defaults to true and may be set to false to pause collection. Without configured disclosure wording, submitted consent state/version are retained as-is. When a disclosure is configured, acceptance and matching versions are enforced. The frontend never grants consent on the user's behalf.
- Configure `VITE_API_URL` for a separately hosted API; local development defaults to `http://localhost:5000` and Vite also proxies relative `/api` requests to port 5000.

## Independent UI verification

Run `npm run test --workspace frontend` for controlled-response tests covering all form steps, validation, retained edits, duplicate prevention, pending state, full attribution, failed/malformed responses, retry identity, personalized confirmation, phone link, close/Escape handling, scroll restoration, and one success event.

For visual inspection only, run the development server and visit `/tests/preview.html`. This explicitly labeled fixture uses synthetic project data, sends no API request, and is not included in the production build. The real `/quote` route contains no simulated-success option.

MongoDB persistence requires the connection the owner will configure locally. UI tests use controlled responses and do not establish live database persistence.
