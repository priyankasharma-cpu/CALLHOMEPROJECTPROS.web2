// Development-only visual fixture. This HTML entry is not included in production builds.
import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ThankYouModal from "../src/components/ThankYouModal/ThankYouModal";
import "@fontsource/plus-jakarta-sans/latin-400.css";
import "@fontsource/plus-jakarta-sans/latin-700.css";
import "../src/styles/global.css";
import "../src/styles/premium.css";
import "../src/styles/typography.css";
import { applyPreferences, readPreferences } from "../src/utils/readability";
applyPreferences(readPreferences());
function Preview() {
  const [open, setOpen] = useState(false);
  return (
    <main className="container section">
      <h1>Confirmation UI test</h1>
      <p>TEST DATA ONLY. No API request is made and no lead is saved.</p>
      <button className="button primary" onClick={() => setOpen(true)}>
        Preview confirmation
      </button>
      <ThankYouModal
        open={open}
        onClose={() => setOpen(false)}
        project={{
          firstName: "Priyanka",
          service: "roofing",
          zip: "10001",
          projectTimeline: "Within 30 days",
        }}
      />
    </main>
  );
}
const root = import.meta.hot?.data.root || createRoot(document.getElementById("root"));
if (import.meta.hot) import.meta.hot.data.root = root;
root.render(
  <BrowserRouter>
    <Preview />
  </BrowserRouter>,
);
