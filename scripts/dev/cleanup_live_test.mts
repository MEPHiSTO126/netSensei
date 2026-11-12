import { db } from "../../src/lib/db";

/**
 * Removes the empty quiz attempt that a live verification run can leave
 * behind. An empty attempt has no answer content, so it is unambiguous.
 */

const emptyAnswers = await db.answerRecord.findMany({
  where: { content: "" },
  select: {
    id: true,
    studentId: true,
    student: { select: { email: true } },
    question: { select: { quiz: { select: { phaseId: true } } } },
  },
});

const studentIds = [...new Set(emptyAnswers.map((record) => record.studentId))];

console.log(`empty answer records: ${emptyAnswers.length}`);

for (const record of emptyAnswers) {
  console.log(`  ${record.student.email} · phase ${record.question.quiz.phaseId}`);
}

if (emptyAnswers.length > 0) {
  await db.answerRecord.deleteMany({
    where: { id: { in: emptyAnswers.map((record) => record.id) } },
  });

  // A zero-score progress row that exists only because of those empty
  // attempts is test residue too.
  const zeroProgress = await db.progressRecord.findMany({
    where: { studentId: { in: studentIds }, score: 0 },
    select: { id: true, student: { select: { email: true } } },
  });

  if (zeroProgress.length > 0) {
    await db.progressRecord.deleteMany({
      where: { id: { in: zeroProgress.map((record) => record.id) } },
    });
    for (const record of zeroProgress) {
      console.log(`  removed zero-score progress for ${record.student.email}`);
    }
  }

  console.log(`\ncleaned up ${emptyAnswers.length} empty answer records`);
}

console.log(
  `\nremaining: ${await db.answerRecord.count()} answers, ${await db.progressRecord.count()} progress records`,
);

await db.$disconnect();
