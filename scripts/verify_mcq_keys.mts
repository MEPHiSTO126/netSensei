import { db } from "../src/lib/db";
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
const base = "http://localhost:3000";

const email = `e2e-jscheck-${Date.now()}@example.invalid`;
const student = await db.user.create({
  data: { email, passwordHash: "x", role: "STUDENT" },
});

const token = await new SignJWT({
  id: student.id,
  email: student.email,
  role: "STUDENT",
})
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime("1h")
  .sign(secret);

async function submit(answers: Record<string, string>) {
  const res = await fetch(`${base}/api/quiz/submit`, {
    method: "POST",
    headers: {
      Cookie: `netsensei_session=${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phaseId: process.env.PHASE_ID, answers }),
  });
  return { status: res.status, json: await res.json() };
}

const phaseId = process.env.PHASE_ID!;
const questions = await db.question.findMany({
  where: { quiz: { phaseId } },
  orderBy: { order: "asc" },
});

let checked = 0;
let failures = 0;

for (const question of questions) {
  const options = question.options as string[] | null;
  if (!options || question.correctIndex === null) continue;

  const correct = options[question.correctIndex];

  // Submit the authored key: it must score 100.
  const right = await submit({ [question.id]: correct });
  const rightResult = right.json?.results?.find(
    (r: { questionId: string }) => r.questionId === question.id,
  );

  // Submit a wrong option: it must score 0 and still return the key.
  const wrong = options.find((_, i) => i !== question.correctIndex)!;
  const bad = await submit({ [question.id]: wrong });
  const badResult = bad.json?.results?.find(
    (r: { questionId: string }) => r.questionId === question.id,
  );

  const ok =
    rightResult?.score === 100 &&
    rightResult?.correctAnswer === correct &&
    !!rightResult?.explanation &&
    badResult?.score === 0 &&
    badResult?.correctAnswer === correct;

  checked += 1;
  if (!ok) {
    failures += 1;
    console.log(`FAIL  ${question.prompt.slice(0, 70)}`);
    console.log(`      right=${rightResult?.score} wrong=${badResult?.score}`);
  }
}

console.log(`\nMCQ questions checked: ${checked}, failures: ${failures}`);

await db.answerRecord.deleteMany({ where: { studentId: student.id } });
await db.progressRecord.deleteMany({ where: { studentId: student.id } });
await db.user.delete({ where: { id: student.id } });
console.log("test student removed");

await db.$disconnect();
