import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import mongoose from "mongoose";
import { randomUUID } from "node:crypto";
import { submissionController } from "../controllers/submissions.js";
import { leadSchema, validate } from "../middleware/validation.js";
import { config } from "../config/env.js";
import { Lead } from "../models/Lead.js";
import { app } from "../app.js";

const payload = {
  firstName: " Test ",
  lastName: "Homeowner",
  email: "TEST@example.com",
  phone: "(212) 555-0198",
  zip: "10001",
  service: "roofing",
  projectDetails: "Please assess the roof above the garage.",
  projectTimeline: "Within 30 days",
  homeownerStatus: "Homeowner",
  consent: false,
  consentVersion: "",
  utmSource: "test",
  utmMedium: "cpc",
  utmCampaign: "roof",
  utmContent: "hero",
  utmTerm: "roofing",
  gclid: "g-test",
  fbclid: "f-test",
  msclkid: "m-test",
  landingPage: "/quote",
  referrer: "https://example.com",
};

test("Lead targets leadform and preserves false consent without invented wording", () => {
  assert.equal(Lead.collection.collectionName, "leadform");
  assert.equal(Lead.schema.options.timestamps, true);
  const { value, error } = leadSchema.validate(payload);
  assert.equal(error, undefined);
  assert.equal(value.consent, false);
  assert.equal(value.consentVersion, "");
});

test("allowed local origins support JSON and idempotency preflight; other origins denied", async () => {
  for (const origin of ["http://localhost:5173", "http://127.0.0.1:5173"]) {
    const response = await request(app)
      .options("/api/leads")
      .set("Origin", origin)
      .set("Access-Control-Request-Method", "POST")
      .set("Access-Control-Request-Headers", "content-type,idempotency-key");
    assert.equal(response.status, 204);
    assert.equal(response.headers["access-control-allow-origin"], origin);
    assert.match(
      response.headers["access-control-allow-headers"],
      /Idempotency-Key/i,
    );
  }
  assert.equal(
    (
      await request(app)
        .options("/api/leads")
        .set("Origin", "https://untrusted.example")
    ).status,
    403,
  );
});

test("invalid ZIP, email, phone and required fields return useful 400 errors", async () => {
  for (const patch of [
    { zip: "abc" },
    { email: "bad" },
    { phone: "123" },
    { firstName: undefined },
  ]) {
    const response = await request(app)
      .post("/api/leads")
      .set("Idempotency-Key", randomUUID())
      .send({ ...payload, ...patch });
    assert.equal(response.status, 400);
    assert.equal(response.body.success, false);
    assert.ok(response.body.error.fields.includes(Object.keys(patch)[0]));
  }
  assert.equal((await request(app).get("/api/health")).status, 503);
});

test("controller waits for persistence, returns actual record ID, and reuses unchanged retries (model double)", async () => {
  const descriptor = Object.getOwnPropertyDescriptor(
    mongoose.connection,
    "readyState",
  );
  Object.defineProperty(mongoose.connection, "readyState", {
    configurable: true,
    value: 1,
  });
  const previous = {
    leadsEnabled: config.leadsEnabled,
    consentText: config.consentText,
    consentVersion: config.consentVersion,
  };
  Object.assign(config, {
    leadsEnabled: true,
    consentText: "",
    consentVersion: "",
  });
  const records = new Map();
  let writes = 0;
  const Model = {
    modelName: "Lead",
    findOne: ({ idempotencyKey }) => ({
      select: async () => records.get(idempotencyKey),
    }),
    create: async (data) => {
      writes++;
      const record = { ...data, _id: new mongoose.Types.ObjectId() };
      records.set(data.idempotencyKey, record);
      return record;
    },
  };
  const testApp = express();
  testApp.use(express.json());
  testApp.post("/api/leads", validate(leadSchema), submissionController(Model));
  try {
    const key = randomUUID();
    const submit = (data) =>
      request(testApp)
        .post("/api/leads")
        .set("Idempotency-Key", key)
        .send(data);
    const result = await submit(payload);
    assert.equal(result.status, 201);
    assert.equal(result.body.success, true);
    assert.equal(result.body.data.reference, records.get(key)._id.toString());
    assert.equal(records.get(key).phone, "+12125550198");
    assert.equal(records.get(key).consent, false);
    assert.equal(records.get(key).consentText, "");
    assert.equal(records.get(key).consentAt, undefined);
    for (const field of [
      "utmSource",
      "utmMedium",
      "utmCampaign",
      "utmContent",
      "utmTerm",
      "gclid",
      "fbclid",
      "msclkid",
      "landingPage",
      "referrer",
    ])
      assert.equal(records.get(key)[field], payload[field]);
    assert.equal((await submit(payload)).status, 200);
    assert.equal(writes, 1);
    assert.equal((await submit({ ...payload, zip: "10002" })).status, 409);
    config.consentText = "TEST ONLY disclosure fixture";
    config.consentVersion = "test-v1";
    assert.equal((await submit(payload)).status, 409);
  } finally {
    Object.assign(config, previous);
    if (descriptor)
      Object.defineProperty(mongoose.connection, "readyState", descriptor);
    else delete mongoose.connection.readyState;
  }
});
