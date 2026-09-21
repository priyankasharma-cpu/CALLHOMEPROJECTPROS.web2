import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    topic: { type: String, required: true },
    message: { type: String, required: true },
    consent: { type: Boolean, required: true },
    consentVersion: { type: String, required: true },
    consentText: { type: String, required: true },
    consentAt: { type: Date, required: true },
    userAgent: String,
    idempotencyKey: { type: String, unique: true, required: true },
    payloadHash: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, strict: "throw" },
);
export const Inquiry = mongoose.model("Inquiry", schema);
