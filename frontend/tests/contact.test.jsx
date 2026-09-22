import { afterEach, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ContactForm from "../src/components/ContactForm";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function form() {
  render(
    <MemoryRouter>
      <ContactForm />
    </MemoryRouter>,
  );
  for (const [label, value] of [
    ["Your name", "Contact Test"],
    ["Email address", "contact@example.com"],
    ["Message", "A test inquiry about a roofing project."],
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  return screen.getByRole("button", { name: "Send Inquiry" }).closest("form");
}
it("waits for a saved reference, prevents duplicate clicks, then confirms", async () => {
  let resolve;
  const fetch = vi.fn(
    () =>
      new Promise((r) => {
        resolve = r;
      }),
  );
  vi.stubGlobal("fetch", fetch);
  const element = form();
  fireEvent.submit(element);
  fireEvent.submit(element);
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Message Received")).toBeNull();
  resolve({
    ok: true,
    json: async () => ({
      success: true,
      data: { reference: "507f1f77bcf86cd799439011" },
    }),
  });
  await screen.findByText("Message Received");
  expect(fetch.mock.calls[0][0]).toMatch(/\/api\/contact$/);
  expect(
    screen.getByRole("link", { name: /Call Now:/ }).getAttribute("href"),
  ).toBe("tel:+18882401827");
});
it("rejects false success and preserves safe retries with a new key for edited data", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
  vi.stubGlobal("fetch", fetch);
  const element = form();
  fireEvent.submit(element);
  await screen.findByRole("alert");
  expect(screen.queryByText("Message Received")).toBeNull();
  const key = fetch.mock.calls[0][1].headers["Idempotency-Key"];
  fireEvent.submit(element);
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  await screen.findByRole("alert");
  expect(fetch.mock.calls[1][1].headers["Idempotency-Key"]).toBe(key);
  fireEvent.change(screen.getByLabelText("Message"), {
    target: { value: "Updated project information for a roofing inquiry." },
  });
  fireEvent.submit(element);
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
  expect(fetch.mock.calls[2][1].headers["Idempotency-Key"]).not.toBe(key);
});
