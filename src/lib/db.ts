import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Neon is reached over its HTTP driver instead of raw TCP.
 *
 * Why: the pooled Postgres endpoint resolves to several IPs, and from some
 * networks one of them blackholes the TCP handshake. The client then waits for
 * the connect timeout and fails with "Can't reach database server", which shows
 * up in the UI as a multi-second hang on every navigation. The HTTP driver
 * talks to Neon over HTTPS, so there is no IP lottery and no pool exhaustion on
 * serverless.
 *
 * Migrations still use the direct TCP connection (`directUrl` in the schema).
 * Set `DB_DRIVER=tcp` to fall back to the standard TCP client.
 */
function loadDotEnvFallback() {
  if (process.env.DATABASE_URL) return;

  try {
    const content = fs.readFileSync(".env", "utf8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!match) continue;
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (match[1] === "DATABASE_URL" && !process.env.DATABASE_URL) {
        process.env.DATABASE_URL = value;
      }
    }
  } catch {
    // No .env file (production): the platform provides the variables.
  }
}

function httpConnectionString(): string | null {
  loadDotEnvFallback();

  const raw = process.env.DATABASE_URL;
  if (!raw) return null;
  if (process.env.DB_DRIVER === "tcp") return null;

  try {
    const parsed = new URL(raw);
    if (!parsed.hostname.endsWith(".neon.tech")) return null;

    // TCP-only parameters are rejected by the HTTP driver.
    parsed.searchParams.delete("channel_binding");

    return parsed.toString();
  } catch {
    return null;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const log = process.env.NODE_ENV === "development" ? ["query", "error"] : [];
const connectionString = httpConnectionString();

function createClient() {
  if (connectionString) {
    return new PrismaClient({
      adapter: new PrismaNeon({ connectionString }),
      log: log as never,
    });
  }

  return new PrismaClient({ log: log as never });
}

export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
