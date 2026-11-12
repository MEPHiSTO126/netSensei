import { db } from "../../src/lib/db";

const progress = await db.progressRecord.findMany({
  include: {
    phase: { select: { id: true, title: true, module: { select: { title: true } } } },
    student: { select: { email: true } },
  },
});
const answers = await db.answerRecord.findMany({
  include: { question: { select: { prompt: true } } },
});
const sessions = await db.tutorSession.findMany({ select: { id: true, status: true, createdAt: true } });
const requests = await db.tutorRequest.findMany({ select: { id: true, status: true, question: true } });
const snippets = await db.snippetAttempt.count();

const phases = await db.phase.findMany({ select: { id: true, title: true } });
const phaseIds = new Set(phases.map((p) => p.id));
const quizzes = await db.quiz.findMany({ select: { id: true, questions: { select: { id: true, prompt: true } } } });
const questionIds = new Set(quizzes.flatMap((q) => q.questions.map((x) => x.id)));

const orphanProgress = progress.filter((p) => !phaseIds.has(p.phaseId));
const orphanAnswers = answers.filter((a) => !questionIds.has(a.questionId));

console.log("progress records :", progress.length, "(orphaned phaseId:", orphanProgress.length, ")");
console.log("answer records  :", answers.length, "(orphaned questionId:", orphanAnswers.length, ")");
console.log("snippet attempts:", snippets);
console.log("tutor sessions  :", sessions.length, sessions.map((s) => s.status).join(","));
console.log("tutor requests  :", requests.length, requests.map((r) => r.status).join(","));
console.log("\nphases now:", phases.length, "| quizzes:", quizzes.length, "| questions:", questionIds.size);
console.log("\nstudent progress detail:");
for (const p of progress) {
  console.log(
    `  ${p.student.email} · ${p.phase.module.title} > ${p.phase.title} · ${p.score}% · attempt ${p.attemptNumber}`,
  );
}
for (const p of orphanProgress) {
  console.log(`  ORPHAN: ${p.student.email} · ${p.phase.title} (phaseId ${p.phaseId} no longer exists)`);
}

await db.$disconnect();
