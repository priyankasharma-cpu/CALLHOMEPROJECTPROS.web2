import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import AccessibilityMenu from "../src/components/AccessibilityMenu/AccessibilityMenu";
import { preferenceKey, readPreferences } from "../src/utils/readability";
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }));
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
it("persists preferences, restores focus and scrolling, and resets saved choices", () => {
  const view = render(<AccessibilityMenu />);
  const trigger = screen.getByRole("button", { name: "Readability settings" });
  fireEvent.click(trigger);
  expect(document.body.style.overflow).toBe("hidden");
  expect(screen.getByText(/device’s reduced-motion/)).toBeTruthy();
  for (const name of ["Largest", "High", "Wide", "Reduced"])
    fireEvent.click(screen.getByRole("button", { name, exact: true }));
  expect({ ...document.documentElement.dataset }).toMatchObject({
    textSize: "largest",
    contrast: "high",
    letterSpacing: "wide",
    motion: "reduced",
  });
  fireEvent(
    screen.getByRole("dialog"),
    new Event("cancel", { bubbles: true, cancelable: true }),
  );
  expect(document.body.style.overflow).toBe("");
  expect(document.activeElement).toBe(trigger);
  view.unmount();
  render(<AccessibilityMenu />);
  fireEvent.click(screen.getByRole("button", { name: "Readability settings" }));
  expect(
    screen
      .getByRole("button", { name: "Largest" })
      .getAttribute("aria-pressed"),
  ).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "Reset to Default" }));
  expect(readPreferences()).toEqual({
    textSize: "normal",
    contrast: "standard",
    letterSpacing: "standard",
    motion: "normal",
  });
});
it("ignores malformed and unsupported stored preferences", () => {
  localStorage.setItem(preferenceKey, "{broken");
  expect(readPreferences().textSize).toBe("normal");
  localStorage.setItem(
    preferenceKey,
    JSON.stringify({ textSize: "huge", contrast: "high" }),
  );
  expect(readPreferences()).toEqual({
    textSize: "normal",
    contrast: "high",
    letterSpacing: "standard",
    motion: "normal",
  });
});
