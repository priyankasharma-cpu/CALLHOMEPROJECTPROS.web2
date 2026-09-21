import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
export const config = {
  port: Number(process.env.PORT) || 5000,
  origins: (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:5174,http://127.0.0.1:5174"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  production: process.env.NODE_ENV === "production",
  leadsEnabled: process.env.LEADS_ENABLED !== "false",
  consentVersion: process.env.CONSENT_VERSION || "",
  consentText: process.env.CONSENT_TEXT || "",
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
};
