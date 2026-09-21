import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { services } from "../data/services";
export default function ProjectTools() {
  const navigate = useNavigate();
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const tool = {
      name: "start_project_request",
      title: "Start a home project request",
      description:
        "Open the visible quote form with a selected service and ZIP code. Does not submit a lead or grant consent.",
      inputSchema: {
        type: "object",
        properties: {
          service: { type: "string", enum: services.map((s) => s.slug) },
          zip: { type: "string", pattern: "^[0-9]{5}$" },
        },
        required: ["service", "zip"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (
          !input ||
          Object.keys(input).some((k) => !["service", "zip"].includes(k)) ||
          !services.some((s) => s.slug === input.service) ||
          !/^\d{5}$/.test(input.zip)
        )
          throw new Error("Choose a valid service and 5-digit ZIP code.");
        navigate(
          `/quote?service=${encodeURIComponent(input.service)}&zip=${input.zip}`,
        );
        await new Promise((resolve) => requestAnimationFrame(resolve));
        return {
          status: "started",
          service: input.service,
          zip: input.zip,
          submitted: false,
        };
      },
    };
    try {
      Promise.resolve(
        context.registerTool(tool, { signal: lifecycle.signal }),
      ).catch(() => {});
    } catch {
      /* Optional browser capability; regular UI remains available. */
    }
    return () => lifecycle.abort();
  }, [navigate]);
  return null;
}
