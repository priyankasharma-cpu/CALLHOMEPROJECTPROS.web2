import mongoose from "mongoose";
import dns from "node:dns";

import "./env.js";

function configureDnsServers() {
  const configuredServers = process.env.DNS_SERVERS?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  if (!configuredServers?.length) {
    return;
  }

  try {
    dns.setServers(configuredServers);

    console.info(
      `Custom DNS servers configured: ${configuredServers.join(", ")}`,
    );
  } catch {
    console.warn("Could not configure custom DNS servers. Using system DNS.");
  }
}

export async function connectDatabase() {
  if (!process.env.MONGODB_URI?.trim()) {
    throw new Error(
      "MONGODB_URI is missing. Add it to backend/.env and restart the backend.",
    );
  }

  configureDnsServers();

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "callinglead",
      serverSelectionTimeoutMS: 10000,
    });

    await Promise.all(
      Object.values(mongoose.models).map((model) => model.init()),
    );

    console.info("MongoDB connected successfully");
  } catch (error) {
    await mongoose.disconnect();

    // Driver messages may contain connection details. Report only safe categories.
    if (
      ["ECONNREFUSED", "ENOTFOUND", "ETIMEOUT", "ESERVFAIL"].includes(
        error?.code,
      )
    ) {
      throw new Error(
        "MongoDB DNS lookup failed. Check DNS_SERVERS in backend/.env and network access to those resolvers.",
      );
    }

    throw new Error(
      "MongoDB connection failed. Check backend/.env, DNS configuration, Atlas Network Access, and database credentials, then restart the backend.",
    );
  }
}
