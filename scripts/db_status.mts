import { db } from "../src/lib/db";

const users = await db.user.findMany({
  select: { email: true, role: true, createdAt: true },
  orderBy: { createdAt: "asc" },
});

console.log("USERS:");
for (const user of users) {
  console.log(`  ${user.role.padEnd(7)} ${user.email}  (${user.createdAt.toISOString()})`);
}

const counts = {
  courses: await db.course.count(),
  modules: await db.module.count(),
  phases: await db.phase.count(),
  stages: await db.stage.count(),
  quizzes: await db.quiz.count(),
  questions: await db.question.count(),
  progressRecords: await db.progressRecord.count(),
  answerRecords: await db.answerRecord.count(),
  snippetAttempts: await db.snippetAttempt.count(),
  tutorRequests: await db.tutorRequest.count(),
  tutorSessions: await db.tutorSession.count(),
  messages: await db.message.count(),
};

console.log("\nROW COUNTS:");
for (const [key, value] of Object.entries(counts)) {
  console.log(`  ${key.padEnd(16)}: ${value}`);
}

const phases = await db.phase.findMany({
  select: {
    title: true,
    order: true,
    _count: { select: { stages: true } },
    module: { select: { title: true } },
  },
  orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
});

console.log("\nPHASES:");
for (const phase of phases) {
  console.log(
    `  ${phase.module.title} > P${phase.order} ${phase.title} [${phase._count.stages} stages]`,
  );
}

await db.$disconnect();
