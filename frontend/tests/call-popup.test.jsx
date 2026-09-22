import { beforeEach, afterEach, expect, it, vi } from "vitest";
import {
  act,
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import CallPopup from "../src/components/CallPopup/CallPopup";
import {
  DISMISSAL_KEY,
  openCallPopup,
} from "../src/components/CallPopup/callPopupControl";
let desktop = true;
let navigate;
function Harness() {
  navigate = useNavigate();
  return (
    <>
      <button>Previous focus</button>
      <CallPopup />
    </>
  );
}
const mount = () =>
  render(
    <MemoryRouter>
      <Harness />
    </MemoryRouter>,
  );
const advance = (ms) => act(() => vi.advanceTimersByTime(ms));
const exit = (x = 100, y = 0) =>
  fireEvent.mouseOut(document, { clientX: x, clientY: y, relatedTarget: null });
const close = () => {
  fireEvent.click(screen.getByRole("button", { name: "Close call popup" }));
  advance(250);
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-09-21T12:00:00Z"));
  sessionStorage.setItem(DISMISSAL_KEY, "0");
  desktop = true;
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query) => ({
      matches: query.includes("pointer: fine") && desktop,
      addEventListener() {},
      removeEventListener() {},
    })),
  );
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
it("opens once after 1200ms and restores scrolling and focus on dismissal", () => {
  mount();
  screen.getByRole("button", { name: "Previous focus" }).focus();
  advance(1199);
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(1);
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(document.body.style.overflow).toBe("hidden");
  exit();
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(
    screen
      .getByRole("link", { name: /Call About Your Project:/ })
      .getAttribute("href"),
  ).toBe("tel:+18882401827");
  close();
  expect(Number(sessionStorage.getItem(DISMISSAL_KEY))).toBeGreaterThan(0);
  expect(document.body.style.overflow).toBe("");
  expect(document.activeElement.textContent).toBe("Previous focus");
});
it("keeps dismissal through navigation and reload and becomes eligible without a timer loop", () => {
  let view = mount();
  advance(1200);
  close();
  act(() => navigate("/services"));
  advance(1000);
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(19000);
  view.unmount();
  view = mount();
  advance(1200);
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(19000);
  exit();
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(50000);
  expect(screen.queryByRole("dialog")).toBeNull();
  act(() => navigate("/about"));
  advance(799);
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(1);
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
});
it("only accepts top-edge desktop exit intent and permits it again after cooldown", () => {
  mount();
  exit(0, 80);
  exit(100, 100);
  expect(screen.queryByRole("dialog")).toBeNull();
  exit();
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  close();
  exit();
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(90000);
  expect(screen.queryByRole("dialog")).toBeNull();
  exit();
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
});
it("does not use mobile exit intent and manual opens bypass the automatic cooldown", () => {
  desktop = false;
  mount();
  exit();
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(1200);
  close();
  act(() => openCallPopup());
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
});
it("Escape and real backdrop clicks dismiss; content clicks do not", () => {
  mount();
  advance(1200);
  fireEvent.click(
    screen.getByRole("heading", { name: "Let’s Talk About Your Project" }),
  );
  expect(screen.getByRole("dialog")).toBeTruthy();
  fireEvent(
    screen.getByRole("dialog"),
    new Event("cancel", { bubbles: true, cancelable: true }),
  );
  advance(250);
  expect(screen.queryByRole("dialog")).toBeNull();
  act(() => openCallPopup());
  const dialog = screen.getByRole("dialog");
  dialog.getBoundingClientRect = () => ({
    left: 100,
    right: 500,
    top: 100,
    bottom: 600,
  });
  fireEvent.pointerDown(dialog, { clientX: 10, clientY: 10 });
  fireEvent.click(dialog, { clientX: 10, clientY: 10 });
  advance(250);
  expect(screen.queryByRole("dialog")).toBeNull();
});
it("cleans rapid-route timers and avoids interrupting another dialog or form entry", () => {
  mount();
  act(() => navigate("/services"));
  advance(400);
  act(() => navigate("/about"));
  advance(400);
  expect(screen.queryByRole("dialog")).toBeNull();
  advance(400);
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  close();
  advance(90000);
  const other = document.createElement("dialog");
  other.open = true;
  document.body.append(other);
  act(() => openCallPopup());
  expect(
    screen.queryByRole("heading", { name: "Let’s Talk About Your Project" }),
  ).toBeNull();
  other.remove();
  act(() => navigate("/contact"));
  advance(800);
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
});
it("unmount restores body styles and cancels pending opens", () => {
  document.body.style.overflow = "auto";
  const view = mount();
  advance(1200);
  view.unmount();
  expect(document.body.style.overflow).toBe("auto");
  document.body.style.overflow = "";
  advance(5000);
  expect(screen.queryByRole("dialog")).toBeNull();
});
it("honors reduced motion when closing and skips automatic opens while typing", () => {
  vi.stubGlobal("matchMedia", (query) => ({
    matches: query.includes("prefers-reduced-motion"),
    addEventListener() {},
    removeEventListener() {},
  }));
  mount();
  const input = document.createElement("input");
  document.body.append(input);
  input.focus();
  advance(1200);
  expect(screen.queryByRole("dialog")).toBeNull();
  input.remove();
  act(() => openCallPopup());
  fireEvent.click(screen.getByRole("button", { name: "Close call popup" }));
  advance(0);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.body.style.overflow).toBe("");
});
