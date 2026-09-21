import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    zip: { type: String, required: true },
    service: { type: String, required: true },
    projectDetails: { type: String, required: true },
    projectTimeline: { type: String, required: true },
    homeownerStatus: { type: String, required: true },
    consent: { type: Boolean, required: true },
    consentVersion: { type: String, default: "" },
    consentText: { type: String, default: "" },
    consentAt: Date,
    landingPage: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String,
    utmContent: String,
    utmTerm: String,
    gclid: String,
    fbclid: String,
    msclkid: String,
    userAgent: String,
    idempotencyKey: { type: String, required: true, unique: true },
    payloadHash: { type: String, required: true },
  },
  {
    collection: "leadform",
    timestamps: true,
    strict: "throw",
    bufferCommands: false,
  },
);
schema.index({ createdAt: -1 });
export const Lead = mongoose.model("Lead", schema);
