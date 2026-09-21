import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TrackingManager from "./components/TrackingManager";
import SEOHead from "./components/SEOHead";
import ProjectTools from "./components/ProjectTools";
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Quote = lazy(() => import("./pages/Quote"));
const Guides = lazy(() => import("./pages/Guides"));
const Information = lazy(() => import("./pages/Information"));
const NotFound = lazy(() => import("./pages/NotFound"));
export default function App() {
  return (
    <>
      <TrackingManager />
      <ProjectTools />
      <Suspense
        fallback={
          <div className="route-loading" role="status">
            Loading your next step…
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <>
                  <SEOHead
                    title="Your Home Project Starts With One Call"
                    description="Explore home services, get practical project guidance, and request a free estimate. Your next home improvement starts with a conversation."
                  />
                  <Home />
                </>
              }
            />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="quote" element={<Quote />} />
            {["cost-guides", "resources"].map((path) => (
              <React.Fragment key={path}>
                <Route path={path} element={<Guides />} />
                <Route path={`${path}/:slug`} element={<Guides />} />
              </React.Fragment>
            ))}
            {[
              "about",
              "contact",
              "faq",
              "how-it-works",
              "privacy-policy",
              "terms",
            ].map((path) => (
              <Route path={path} element={<Information />} key={path} />
            ))}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
