import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import { app } from "../app.js";
import { config } from "../config/env.js";
import { Lead } from "../models/Lead.js";
import { Inquiry } from "../models/Inquiry.js";
let mongo;
const payload = {
  firstName: "Alex",
  lastName: "Example",
  email: "Alex@example.com",
  phone: "(212) 555-0198",
  zip: "10001",
  service: "roofing",
  projectDetails: "Please assess a roof leak near the chimney.",
  projectTimeline: "Within 30 days",
  homeownerStatus: "Homeowner",
  consent: true,
  consentVersion: "test-v1",
  utmSource: "test",
  gclid: "example-click-id",
};
before(async () => {
  if (!process.env.TEST_MONGODB_URI) mongo = await MongoMemoryServer.create();
  await mongoose.connect(process.env.TEST_MONGODB_URI || mongo.getUri(), {
    dbName: "callinglead",
  });
  await Promise.all([Lead.init(), Inquiry.init()]);
  config.leadsEnabled = true;
  config.consentVersion = "test-v1";
  config.consentText = "TEST ONLY: consent fixture; not production disclosure.";
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
test("valid lead is normalized and persisted in MongoDB, with server-recorded consent", async () => {
  const key = randomUUID();
  const r = await request(app)
    .post("/api/leads")
    .set("Idempotency-Key", key)
    .send(payload);
  assert.equal(r.status, 201);
  const lead = await Lead.findById(r.body.data.reference);
  assert.equal(mongoose.connection.name, "callinglead");
  assert.equal(Lead.collection.collectionName, "leadform");
  assert.equal(lead._id.toString(), r.body.data.reference);
  assert.equal(lead.email, "alex@example.com");
  assert.equal(lead.phone, "+12125550198");
  assert.equal(lead.gclid, payload.gclid);
  assert.equal(lead.consentText, config.consentText);
  assert.ok(lead.consentAt);
  assert.ok(lead.createdAt);
  assert.equal(r.body.data.email, undefined);
});
test("concurrent duplicate retries save one record and changed reuse is rejected", async () => {
  const key = randomUUID();
  const results = await Promise.all(
    [1, 2].map(() =>
      request(app).post("/api/leads").set("Idempotency-Key", key).send(payload),
    ),
  );
  assert.ok(results.every((r) => [200, 201].includes(r.status)));
  assert.equal(await Lead.countDocuments({ idempotencyKey: key }), 1);
  const conflict = await request(app)
    .post("/api/leads")
    .set("Idempotency-Key", key)
    .send({ ...payload, zip: "10002" });
  assert.equal(conflict.status, 409);
});
test("invalid, missing-consent and injection payloads are rejected", async () => {
  for (const changes of [
    { zip: "abc" },
    { consent: false },
    { service: "unknown" },
    { projectDetails: "<script>alert(1)</script>" },
  ]) {
    const r = await request(app)
      .post("/api/leads")
      .set("Idempotency-Key", randomUUID())
      .send({ ...payload, ...changes });
    assert.equal(r.status, changes.consent === false ? 409 : 400);
  }
});
test("origin policy and JSON errors have consistent safe responses", async () => {
  const cors = await request(app)
    .post("/api/leads")
    .set("Origin", "https://untrusted.example")
    .send(payload);
  assert.equal(cors.status, 403);
  const malformed = await request(app)
    .post("/api/leads")
    .set("Content-Type", "application/json")
    .send("{");
  assert.equal(malformed.status, 400);
  assert.equal(malformed.body.error.code, "INVALID_JSON");
});
test("disabled collection cannot save leads", async () => {
  config.leadsEnabled = false;
  const r = await request(app)
    .post("/api/leads")
    .set("Idempotency-Key", randomUUID())
    .send(payload);
  assert.equal(r.status, 503);
  config.leadsEnabled = true;
});
test("rate limit rejects excessive requests", async () => {
  await request(app)
    .post("/api/leads")
    .set("Idempotency-Key", randomUUID())
    .send(payload);
  const r = await request(app)
    .post("/api/leads")
    .set("Idempotency-Key", randomUUID())
    .send(payload);
  assert.equal(r.status, 429);
});
