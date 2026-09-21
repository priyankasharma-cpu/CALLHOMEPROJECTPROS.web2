import mongoose from "mongoose";
import { app } from "./app.js";
import { config } from "./config/env.js";
import { connectDatabase } from "./config/db.config.js";
if (
  config.production &&
  config.origins.some((origin) => !origin.startsWith("https://"))
) {
  console.error("Production FRONTEND_URL values must use HTTPS.");
  process.exit(1);
}
if (Boolean(config.consentVersion) !== Boolean(config.consentText)) {
  console.error(
    "Configure CONSENT_TEXT and CONSENT_VERSION together, or leave both empty.",
  );
  process.exit(1);
}
try {
  await connectDatabase();
} catch (error) {
  console.error(error.message);
  console.info(
    "API will report database unavailable until configured and restarted.",
  );
}
try {
  const server = app.listen(config.port, () =>
    console.info(`Lead API listening on port ${config.port}`),
  );
  let stopping = false;
  async function stop() {
    if (stopping) return;
    stopping = true;
    const timer = setTimeout(() => process.exit(1), 10000).unref();
    server.close(async () => {
      await mongoose.disconnect();
      clearTimeout(timer);
      process.exit(0);
    });
  }
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
} catch (error) {
  console.error("API startup failed:", error.name);
  process.exit(1);
}
