import { SignJWT } from "jose";
import fs from "node:fs";
import { db } from "../../src/lib/db";

/**
 * Read-only check: does the deployed site see the same learner records the
 * local scripts read? Signs a tutor session and reads the tutor desk.
 */

function envValue(key: string) {
  const line = fs
    .readFileSync(".env", "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith(`${key}=`));
  return (line?.split("=").slice(1).join("=") ?? "").trim().replace(/^["']|["']$/g, "");
}

const secret = new TextEncoder().encode(envValue("JWT_SECRET"));
const origin = process.env.LIVE_ORIGIN ?? "https://netsensei.vercel.app";

const tutor = await db.user.findFirstOrThrow({
  where: { role: "TUTOR" },
  select: { id: true, email: true, role: true },
});

const token = await new SignJWT({ id: tutor.id, email: tutor.email, role: tutor.role })
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("10m")
  .sign(secret);

const res = await fetch(`${origin}/tutor/students`, {
  headers: { Cookie: `netsensei_session=${token}` },
});
const html = await res.text();

console.log(`live /tutor/students -> ${res.status}`);
const stripped = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
console.log(`mentions joshuaawe010: ${stripped.includes("joshuaawe010@gmail.com")}`);
console.log(`mentions olaoluwaolusolailugbaro: ${stripped.includes("olaoluwaolusolailugbaro@gmail.com")}`);
const attemptMatches = stripped.match(/(\d+) attempts?/g);
console.log(`attempt counts on the page: ${attemptMatches ? attemptMatches.join(", ") : "none"}`);
const scoreMatches = stripped.match(/(\d+)%/g);
console.log(`percentages on the page: ${scoreMatches ? [...new Set(scoreMatches)].join(", ") : "none"}`);

await db.$disconnect();
