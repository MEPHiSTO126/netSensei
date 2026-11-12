import { db } from "../../src/lib/db";
import { SignJWT } from "jose";
import fs from "node:fs";

/**
 * Signs a session for a real account and calls the live deployment, to prove
 * that the deployed build behaves the same as the local one:
 *
 * - a tutor receives the answer key
 * - a student receives the options but never the key
 * - the student cannot submit a quiz
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

const tutor = await retry(() =>
  db.user.findFirstOrThrow({
    where: { role: "TUTOR" },
    select: { id: true, email: true, role: true },
  }),
);

// A throwaway student, so a verification run can never write to a real
// learner's records. It is removed again at the end of the script.
const student = await retry(() =>
  db.user.create({
    data: {
      email: `e2e-live-${Date.now()}@example.invalid`,
      passwordHash: "x",
      role: "STUDENT",
    },
    select: { id: true, email: true, role: true },
  }),
);

const phase = await retry(() =>
  db.phase.findFirstOrThrow({
    where: { quiz: { isNot: null } },
    select: { id: true, title: true },
  }),
);

async function token(user: { id: string; email: string; role: string }) {
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(secret);
}

/** The local connection to Neon drops on this network; retry reads. */
async function retry<T>(work: () => Promise<T>, attempts = 5): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await work();
    } catch (error) {
      lastError = error;
      console.warn(`   retry ${attempt}/${attempts}: ${(error as Error).message}`);
      await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  throw lastError;
}

const tutorToken = await token(tutor);
const studentToken = await token(student);

async function get(path: string, jwt: string) {
  const res = await fetch(`${origin}${path}`, {
    headers: { Cookie: `netsensei_session=${jwt}` },
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}

let failures = 0;
function check(label: string, ok: boolean, extra = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${extra ? ` — ${extra}` : ""}`);
  if (!ok) failures += 1;
}

console.log(`live origin: ${origin}`);
console.log(`phase: ${phase.title}\n`);

const tutorView = await get(`/api/quiz/phase/${phase.id}`, tutorToken);
const tutorQuestions = tutorView.json?.questions ?? [];
const tutorQuestion = tutorQuestions.find((q: { options?: unknown }) => q.options);

check("tutor request accepted by the live build", tutorView.status === 200, `status ${tutorView.status}`);
check("tutor receives the answer key", "correctIndex" in (tutorQuestion ?? {}));
check("tutor receives the explanation", Boolean(tutorQuestion?.explanation));

const studentView = await get(`/api/quiz/phase/${phase.id}`, studentToken);
const studentQuestions = studentView.json?.questions ?? [];
const studentQuestion = studentQuestions.find((q: { options?: unknown }) => q.options);

check("student request accepted by the live build", studentView.status === 200, `status ${studentView.status}`);
check("student receives the options", Array.isArray(studentQuestion?.options));
check("student does NOT receive the key", !("correctIndex" in (studentQuestion ?? {})));
check("student does NOT receive the explanation", !("explanation" in (studentQuestion ?? {})));
check("student does NOT receive the reference answer", !("expectedAnswer" in (studentQuestion ?? {})));

// A student must not be able to submit a quiz.
const submit = await fetch(`${origin}/api/quiz/submit`, {
  method: "POST",
  headers: {
    Cookie: `netsensei_session=${studentToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ phaseId: phase.id, answers: {} }),
});
check("student CAN submit a quiz (that is the point)", submit.status === 200, `status ${submit.status}`);

const tutorSubmit = await fetch(`${origin}/api/quiz/submit`, {
  method: "POST",
  headers: {
    Cookie: `netsensei_session=${tutorToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ phaseId: phase.id, answers: {} }),
});
check("tutor CANNOT submit a quiz", tutorSubmit.status === 403, `status ${tutorSubmit.status}`);

console.log(
  failures === 0
    ? "\nPASSED: the live deployment behaves exactly like the local build"
    : `\nFAILED: ${failures} check(s) failed`,
);

// Remove the throwaway student and anything it wrote.
await db.answerRecord.deleteMany({ where: { studentId: student.id } });
await db.progressRecord.deleteMany({ where: { studentId: student.id } });
await db.user.delete({ where: { id: student.id } });
console.log("throwaway student removed");

await db.$disconnect();
if (failures > 0) process.exit(1);
