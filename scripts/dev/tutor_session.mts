import { db } from "../../src/lib/db";
import { SignJWT } from "jose";
import fs from "node:fs";

function envValue(key: string) {
  const line = fs
    .readFileSync(".env", "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith(`${key}=`));
  return (line?.split("=").slice(1).join("=") ?? "").trim().replace(/^["']|["']$/g, "");
}

const secret = new TextEncoder().encode(envValue("JWT_SECRET"));
const tutor = await db.user.findFirstOrThrow({
  where: { role: "TUTOR" },
  select: { id: true, email: true, role: true },
});

const token = await new SignJWT({
  id: tutor.id,
  email: tutor.email,
  role: tutor.role,
})
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("2h")
  .sign(secret);

fs.writeFileSync(
  "public/_tutor_session.html",
  `<!doctype html><meta charset="utf-8"><script>
document.cookie = "netsensei_session=${token}; path=/; max-age=7200; samesite=lax";
location.replace("/tutor/solutions");
</script>`,
  "utf8",
);

console.log("tutor session page ready -> /tutor/solutions");
await db.$disconnect();
