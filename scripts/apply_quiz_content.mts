import { db } from "../src/lib/db";
import { questionContent } from "../prisma/quiz-content";

const questions = await db.question.findMany({
  include: { quiz: { select: { phase: { select: { title: true } } } } },
});

let updated = 0;
let skipped = 0;
const missing: string[] = [];

for (const question of questions) {
  const content = questionContent[question.prompt];

  if (!content) {
    missing.push(`[${question.quiz.phase.title}] ${question.prompt}`);
    continue;
  }

  const options = content.options ?? null;
  const correctIndex = content.correctIndex ?? null;

  const same =
    JSON.stringify(question.options ?? null) === JSON.stringify(options) &&
    question.correctIndex === correctIndex &&
    question.explanation === content.explanation;

  if (same) {
    skipped += 1;
    continue;
  }

  await db.question.update({
    where: { id: question.id },
    data: {
      options: options as never,
      correctIndex,
      explanation: content.explanation,
    },
  });
  updated += 1;
}

const mcq = questions.filter((q) => questionContent[q.prompt]?.options).length;

console.log(`questions in database : ${questions.length}`);
console.log(`content entries       : ${Object.keys(questionContent).length}`);
console.log(`converted to MCQ      : ${mcq}`);
console.log(`left open-ended       : ${questions.length - mcq}`);
console.log(`updated               : ${updated}`);
console.log(`already up to date    : ${skipped}`);

if (missing.length > 0) {
  console.log(`\nMISSING CONTENT (${missing.length}):`);
  for (const item of missing) console.log(`  - ${item}`);
}

await db.$disconnect();
