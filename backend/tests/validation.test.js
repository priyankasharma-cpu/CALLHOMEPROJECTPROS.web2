import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../app.js";
import { leadSchema } from "../middleware/validation.js";
const valid = {
  firstName: " Alex ",
  lastName: "Example",
  email: "Alex@example.com",
  phone: "(212) 555-0198",
  zip: "10001",
  service: "roofing",
  projectDetails: "Please assess the roof and flashing.",
  projectTimeline: "Within 30 days",
  homeownerStatus: "Homeowner",
  consent: true,
  consentVersion: "test",
};
test("normalize valid lead fields and preserve attribution", () => {
  const { value, error } = leadSchema.validate({
    ...valid,
    utmSource: "search",
    gclid: "sample",
  });
  assert.equal(error, undefined);
  assert.equal(value.firstName, "Alex");
  assert.equal(value.email, "alex@example.com");
  assert.equal(value.phone, "+12125550198");
  assert.equal(value.gclid, "sample");
});
test("reject unknown fields, object injection, markup, honeypots, missing consent state, invalid services", () => {
  for (const patch of [
    { zip: "abc" },
    { phone: { $gt: "" } },
    { service: "not-a-service" },
    { consent: undefined },
    { createdAt: "2020-01-01" },
    { projectDetails: "<script>bad</script>" },
    { website: "bot" },
  ])
    assert.ok(leadSchema.validate({ ...valid, ...patch }).error);
});
test("API errors remain safe and collection is gated", async () => {
  const bad = await request(app).post("/api/leads").send({});
  assert.equal(bad.status, 400);
  assert.equal(bad.body.success, false);
  const disabled = await request(app).post("/api/leads").send(valid);
  assert.equal(disabled.status, 503);
  const origin = await request(app)
    .post("/api/leads")
    .set("Origin", "https://untrusted.example")
    .send(valid);
  assert.equal(origin.status, 403);
  const json = await request(app)
    .post("/api/leads")
    .set("Content-Type", "application/json")
    .send("{");
  assert.equal(json.status, 400);
  const unknown = await request(app).get("/api/private");
  assert.equal(unknown.status, 404);
});
