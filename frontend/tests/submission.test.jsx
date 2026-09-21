import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LeadForm from "../src/components/LeadForm";
import ThankYouModal from "../src/components/ThankYouModal/ThankYouModal";
import { siteConfig } from "../src/config/siteConfig";
import { track, getAttribution } from "../src/utils/tracking";
vi.mock("../src/utils/tracking", () => ({
  track: vi.fn(),
  getAttribution: vi.fn(),
}));
const attribution = {
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "roofing",
  utmContent: "hero",
  utmTerm: "roof estimate",
  gclid: "g-test",
  fbclid: "f-test",
  msclkid: "m-test",
  landingPage: "/services/roofing",
  referrer: "https://example.com/",
};
const confirmed = {
  ok: true,
  json: async () => ({
    success: true,
    data: { reference: "507f1f77bcf86cd799439011" },
  }),
};
beforeEach(() => {
  vi.clearAllMocks();
  siteConfig.consentText = "TEST FIXTURE: approved disclosure goes here.";
  siteConfig.consentVersion = "test-only-v1";
  getAttribution.mockReturnValue(attribution);
  vi.stubGlobal("fetch", vi.fn());
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
async function review() {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <LeadForm />
    </MemoryRouter>,
  );
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(screen.getByRole("alert").textContent).toContain("5-digit ZIP");
  await user.type(screen.getByLabelText("ZIP code"), "10001");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.click(
    screen.getByRole("button", { name: "Roofing", exact: true }),
  );
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.type(
    screen.getByLabelText("Project details"),
    "Please assess the roof leak near our garage.",
  );
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.click(screen.getByRole("button", { name: "Within 30 days" }));
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.click(
    screen.getByRole("button", { name: "Homeowner", exact: true }),
  );
  await user.click(screen.getByRole("button", { name: "Continue" }));
  for (const [label, value] of [
    ["First name", "Priyanka"],
    ["Last name", "Example"],
    ["Email address", "test@example.com"],
    ["Phone number", "2125550198"],
  ])
    await user.type(screen.getByLabelText(label), value);
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(
    screen.getByRole("heading", { name: "Review Your Request" }),
  ).toBeTruthy();
  expect(screen.queryByText("Online requests are not open yet.")).toBeNull();
  await user.click(screen.getByRole("button", { name: "Back" }));
  expect(screen.getByLabelText("First name").value).toBe("Priyanka");
  await user.click(screen.getByRole("button", { name: "Continue" }));
  await user.click(screen.getByRole("checkbox"));
  return user;
}
describe("final submission", () => {
  it("does not open or lock scrolling without confirmed project data", () => {
    render(
      <MemoryRouter>
        <ThankYouModal open project={null} onClose={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });
  it("requires acceptance of the configured disclosure before sending", async () => {
    const user = await review();
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Submit My Request" }));
    expect(screen.getByRole("alert").textContent).toContain("consent box");
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("handles a network failure without confirming and permits a safe retry", async () => {
    fetch
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValueOnce(confirmed);
    const user = await review();
    await user.click(screen.getByRole("button", { name: "Submit My Request" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Try Again" }).disabled).toBe(
      false,
    );
    expect(
      track.mock.calls.filter(([name]) => name === "lead_success"),
    ).toHaveLength(0);
    await user.click(screen.getByRole("button", { name: "Try Again" }));
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(fetch.mock.calls[0][1].headers["Idempotency-Key"]).toBe(
      fetch.mock.calls[1][1].headers["Idempotency-Key"],
    );
  });
  it("waits for API confirmation, sends once, preserves attribution, personalizes and tracks once", async () => {
    let resolve;
    fetch.mockReturnValue(
      new Promise((r) => {
        resolve = r;
      }),
    );
    const user = await review();
    const submit = screen.getByRole("button", { name: "Submit My Request" });
    await user.dblClick(submit);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Submitting..." }).disabled).toBe(
      true,
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe(`${siteConfig.apiUrl}/api/leads`);
    expect(JSON.parse(options.body)).toMatchObject({
      ...attribution,
      firstName: "Priyanka",
      consent: true,
      consentVersion: "test-only-v1",
    });
    await act(async () => resolve(confirmed));
    const modal = screen.getByRole("dialog");
    expect(
      within(modal).getByRole("heading", { name: "Thanks, Priyanka!" }),
    ).toBeTruthy();
    expect(within(modal).queryByText("test@example.com")).toBeNull();
    expect(
      within(modal)
        .getByRole("link", { name: /Call Our Home Project Team/ })
        .getAttribute("href"),
    ).toBe("tel:+18882401827");
    expect(document.body.style.overflow).toBe("hidden");
    await user.click(
      within(modal).getByRole("heading", { name: "Thanks, Priyanka!" }),
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "Close confirmation" }),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement.textContent).toContain("your request is in");
    await user.click(screen.getByRole("button", { name: "View Confirmation" }));
    fireEvent(
      screen.getByRole("dialog"),
      new Event("cancel", { bubbles: true, cancelable: true }),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement.textContent).toBe("View Confirmation");
    expect(
      track.mock.calls.filter(([name]) => name === "lead_success"),
    ).toHaveLength(1);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: "Submit My Request" }),
    ).toBeNull();
  });
  it.each([
    ["HTTP failure", { ok: false, json: async () => ({ success: false }) }],
    ["false success", { ok: true, json: async () => ({ success: false }) }],
    ["missing reference", { ok: true, json: async () => ({ success: true }) }],
    [
      "invalid JSON",
      {
        ok: true,
        json: async () => {
          throw new Error("invalid");
        },
      },
    ],
  ])(
    "does not confirm %s and retries with the same idempotency key",
    async (_, failure) => {
      fetch.mockResolvedValueOnce(failure).mockResolvedValueOnce(confirmed);
      const user = await review();
      await user.click(
        screen.getByRole("button", { name: "Submit My Request" }),
      );
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(screen.getByRole("alert").textContent).toContain(
        "couldn't submit",
      );
      expect(
        within(screen.getByRole("alert"))
          .getByRole("link")
          .getAttribute("href"),
      ).toBe("tel:+18882401827");
      expect(
        track.mock.calls.filter(([name]) => name === "lead_success"),
      ).toHaveLength(0);
      await user.click(screen.getByRole("button", { name: "Try Again" }));
      expect(fetch.mock.calls[0][1].headers["Idempotency-Key"]).toBe(
        fetch.mock.calls[1][1].headers["Idempotency-Key"],
      );
      expect(screen.getByRole("dialog")).toBeTruthy();
    },
  );
});
