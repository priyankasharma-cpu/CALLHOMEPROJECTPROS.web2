import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { config } from "./config/env.js";
import { Lead } from "./models/Lead.js";
import { Inquiry } from "./models/Inquiry.js";
import {
  validate,
  leadSchema,
  inquirySchema,
} from "./middleware/validation.js";
import { submissionController } from "./controllers/submissions.js";
import { errorHandler } from "./middleware/errors.js";
export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", config.trustProxy);
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.origins.includes(origin))
        return callback(null, true);
      const error = new Error("Origin denied");
      error.code = "ORIGIN_DENIED";
      callback(error);
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Idempotency-Key"],
  }),
);
app.use(express.json({ limit: "20kb", strict: true }));
const limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    error: { code: "RATE_LIMITED" },
  },
});
app.get("/api/health", (req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({
    success: ready,
    message: ready ? "Service ready" : "Database unavailable",
    data: { status: ready ? "ready" : "unavailable" },
  });
});
app.post("/api/leads", limit, validate(leadSchema), submissionController(Lead));
app.post(
  ["/api/contact", "/api/inquiries"],
  limit,
  validate(inquirySchema),
  submissionController(Inquiry),
);
app.use((req, res) =>
  res.status(404).json({
    success: false,
    message: "Endpoint not found.",
    error: { code: "NOT_FOUND" },
  }),
);
app.use(errorHandler);
