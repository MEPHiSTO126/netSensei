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

const base = "http://localhost:3000";
const secret = new TextEncoder().encode(envValue("JWT_SECRET"));

function check(label: string, condition: boolean, extra = "") {
  console.log(`${condition ? "PASS" : "FAIL"}  ${label}${extra ? ` — ${extra}` : ""}`);
  if (!condition) process.exitCode = 1;
}

async function token(user: { id: string; email: string; role: string }) {
  return new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);
}

// ── Throwaway student so real student data is untouched ────────────────
const email = `e2e-quiz-check-${Date.now()}@example.invalid`;
const student = await db.user.create({
  data: {
    email,
    passwordHash: "not-a-real-hash",
    role: "STUDENT",
  },
});
const tutor = await db.user.findFirstOrThrow({
  where: { role: "TUTOR" },
});

const studentToken = await token(student);
const tutorToken = await token(tutor);

const phase = await db.phase.findFirstOrThrow({
  where: { quiz: { isNot: null } },
  include: { quiz: { include: { questions: true } } },
});

const mcq = phase.quiz!.questions.find((q) => q.options);
const open = phase.quiz!.questions.find((q) => !q.options);

async function api(path: string, jwt: string, init?: RequestInit) {
  const res = await fetch(base + path, {
    ...init,
    headers: {
      Cookie: `netsensei_session=${jwt}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* keep raw */
  }
  return { status: res.status, json, text };
}

console.log(`phase: ${phase.title}\n`);

// 1. Student fetches the quiz: gets choices, never the key.
const studentQuiz = await api(`/api/quiz/phase/${phase.id}`, studentToken);
const studentQuestions = (studentQuiz.json as { questions: Record<string, unknown>[] })
  .questions;
const studentMcq = studentQuestions.find((q) => q.options);

check("student receives 200 for quiz", studentQuiz.status === 200);
check("student receives options", Array.isArray(studentMcq?.options));
check("student does NOT receive correctIndex", !("correctIndex" in (studentMcq ?? {})));
check("student does NOT receive explanation", !("explanation" in (studentMcq ?? {})));
check("student does NOT receive expectedAnswer", !("expectedAnswer" in (studentMcq ?? {})));

// 2. Tutor receives the full key.
const tutorQuiz = await api(`/api/quiz/phase/${phase.id}`, tutorToken);
const tutorQuestions = (tutorQuiz.json as { questions: Record<string, unknown>[] })
  .questions;
const tutorMcq = tutorQuestions.find((q) => q.options);
check("tutor receives correctIndex", "correctIndex" in (tutorMcq ?? {}));
check("tutor receives explanation", "explanation" in (tutorMcq ?? {}));
check("tutor receives expectedAnswer", "expectedAnswer" in (tutorMcq ?? {}));

// 3. Student submits the correct option: full credit + key + why.
const options = mcq!.options as string[];
const correctIndex = mcq!.correctIndex as number;
const correctOption = options[correctIndex];

const rightSubmit = await api("/api/quiz/submit", studentToken, {
  method: "POST",
  body: JSON.stringify({ phaseId: phase.id, answers: { [mcq!.id]: correctOption } }),
});
const rightResults = (
  rightSubmit.json as { results: Array<Record<string, unknown>> }
).results;
const rightOne = rightResults.find((r) => r.questionId === mcq!.id)!;

check("submit returns 200", rightSubmit.status === 200);
check("correct option scores 100", rightOne.score === 100);
check("response includes correctAnswer", Boolean(rightOne.correctAnswer));
check(
  "correctAnswer matches the key",
  rightOne.correctAnswer === correctOption,
  String(rightOne.correctAnswer).slice(0, 40),
);
check("response includes explanation", Boolean(rightOne.explanation));

// 4. Student submits a wrong option: zero, and still gets the key.
const wrongOption = options.find((_, i) => i !== correctIndex)!;
const wrongSubmit = await api("/api/quiz/submit", studentToken, {
  method: "POST",
  body: JSON.stringify({ phaseId: phase.id, answers: { [mcq!.id]: wrongOption } }),
});
const wrongResults = (
  wrongSubmit.json as { results: Array<Record<string, unknown>> }
).results;
const wrongOne = wrongResults.find((r) => r.questionId === mcq!.id)!;
check("wrong option scores 0", wrongOne.score === 0);
check("wrong answer still returns the key", Boolean(wrongOne.correctAnswer));

// 5. Open-ended question still graded and still returns reference + why.
if (open) {
  const openSubmit = await api("/api/quiz/submit", studentToken, {
    method: "POST",
    body: JSON.stringify({
      phaseId: phase.id,
      answers: { [open.id]: "My attempt at answering this question." },
    }),
  });
  const openResults = (
    openSubmit.json as { results: Array<Record<string, unknown>> }
  ).results;
  const openOne = openResults.find((r) => r.questionId === open.id)!;
  check("open question still returns a result", Boolean(openOne));
  check("open question returns reference answer", Boolean(openOne.correctAnswer));
  check("open question returns explanation", Boolean(openOne.explanation));
}

// ── Cleanup: remove the throwaway student and everything it wrote ─────
await db.answerRecord.deleteMany({ where: { studentId: student.id } });
await db.snippetAttempt.deleteMany({ where: { studentId: student.id } });
await db.progressRecord.deleteMany({ where: { studentId: student.id } });
await db.user.delete({ where: { id: student.id } });
console.log(`\ncleaned up throwaway student ${email}`);

await db.$disconnect();
