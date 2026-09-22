import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    inquiryType: { type: String, required: true },
    phone: String,
    landingPage: String,
    referrer: String,
    message: { type: String, required: true },
    consent: { type: Boolean, default: false },
    consentVersion: { type: String, default: "" },
    consentText: { type: String, default: "" },
    consentAt: Date,
    userAgent: String,
    idempotencyKey: { type: String, unique: true, required: true },
    payloadHash: { type: String, required: true },
  },
  {
    collection: "contactinquiries",
    timestamps: true,
    strict: "throw",
    bufferCommands: false,
  },
);
export const Inquiry = mongoose.model("Inquiry", schema);
