import fs from "node:fs";
import nextEnv from "@next/env";
import { PrismaClient } from "@prisma/client";
import { SignJWT } from "jose";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const db = new PrismaClient();
const tutor = await db.user.findFirst({
  where: { role: "TUTOR" },
  select: { id: true, email: true, role: true },
});

if (!tutor) {
  throw new Error("No tutor account found.");
}

const secret = process.env.JWT_SECRET?.trim();
if (!secret) {
  throw new Error("JWT_SECRET missing.");
}

const token = await new SignJWT({
  id: tutor.id,
  email: tutor.email,
  role: tutor.role,
})
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("2h")
  .sign(new TextEncoder().encode(secret));

fs.writeFileSync(
  "public/_preview.html",
  `<!doctype html><meta charset="utf-8"><title>Preview</title><script>
document.cookie = "netsensei_session=${token}; path=/; max-age=7200; samesite=lax";
location.replace("/tutor");
</script>`,
  "utf8",
);

console.log(JSON.stringify({ email: tutor.email, id: tutor.id }));
await db.$disconnect();
