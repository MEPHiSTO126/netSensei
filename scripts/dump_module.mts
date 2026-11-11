import { db } from "../src/lib/db";

const phases = await db.phase.findMany({
  where: { module: { title: { contains: "JavaScript Survival Kit" } } },
  orderBy: { order: "asc" },
  include: {
    quiz: {
      include: {
        questions: { orderBy: { order: "asc" } },
      },
    },
  },
});

for (const phase of phases) {
  console.log(`\n### ${phase.title} — ${phase.description ?? ""}`);
  for (const [index, question] of (phase.quiz?.questions ?? []).entries()) {
    console.log(`\n${index + 1}. [${question.type}] ${question.prompt}`);
    console.log(`   ANSW: ${question.expectedAnswer}`);
    console.log(`   GOAL: ${question.fullGoal}`);
    console.log(`   RUBRIC: ${question.rubric}`);
  }
}

await db.$disconnect();
