import { db } from "../src/lib/db";

const matches = await db.question.findMany({
  where: { prompt: "What is the difference between map and filter?" },
  select: {
    expectedAnswer: true,
    fullGoal: true,
    quiz: { select: { phase: { select: { title: true } } } },
  },
});

for (const match of matches) {
  console.log(`phase: ${match.quiz.phase.title}`);
  console.log(`  goal: ${match.fullGoal}`);
  console.log(`  answer: ${match.expectedAnswer}\n`);
}

await db.$disconnect();
