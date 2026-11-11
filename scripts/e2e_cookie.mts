import { db } from "../src/lib/db";
import { SignJWT } from "jose";
import fs from "node:fs";
function envValue(key: string) {
  const line = fs.readFileSync(".env", "utf8").split("\n").find((l) => l.trim().startsWith(key + "="));
  return (line?.split("=").slice(1).join("=") ?? "").trim().replace(/^["']|["']$/g, "");
}
const secret = new TextEncoder().encode(envValue("JWT_SECRET"));
const email = `e2e-js-${Date.now()}@example.invalid`;
const student = await db.user.create({ data: { email, passwordHash: "x", role: "STUDENT" } });
const token = await new SignJWT({ id: student.id, email: student.email, role: "STUDENT" })
  .setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secret);
const phase = await db.phase.findFirstOrThrow({ where: { title: "Values and Types" }, select: { id: true, moduleId: true, module: { select: { courseId: true } } } });
fs.writeFileSync(process.env.TEMP + "/netsensei_token.txt", token, "utf8");
console.log(`/courses/${phase.module.courseId}/${phase.moduleId}/${phase.id}/quiz`);
await db.$disconnect();
