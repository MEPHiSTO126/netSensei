import { db } from "../../src/lib/db";

const moduleTitles = process.argv.slice(2);

const phases = await db.phase.findMany({
  where: { module: { title: { in: moduleTitles } } },
  orderBy: { order: "asc" },
  include: {
    module: { select: { title: true } },
    quiz: { include: { questions: { orderBy: { order: "asc" } } } },
  },
});

phases.sort((a, b) => a.module.title.localeCompare(b.module.title));

for (const phase of phases) {
  console.log(`\n### ${phase.module.title} > ${phase.title}`);
  for (const [index, question] of (phase.quiz?.questions ?? []).entries()) {
    console.log(`\n${index + 1}. [${question.type}] ${question.prompt}`);
    console.log(`   ANSW: ${question.expectedAnswer}`);
    console.log(`   GOAL: ${question.fullGoal}`);
  }
}

await db.$disconnect();
