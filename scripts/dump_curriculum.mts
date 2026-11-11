import { db } from "../src/lib/db";

const courses = await db.course.findMany({
  where: { isPublished: true },
  orderBy: { order: "asc" },
  include: {
    modules: {
      orderBy: { order: "asc" },
      include: {
        phases: {
          orderBy: { order: "asc" },
          include: {
            stages: { orderBy: { order: "asc" }, select: { title: true } },
            quiz: { select: { passThreshold: true, _count: { select: { questions: true } } } },
          },
        },
      },
    },
  },
});

for (const course of courses) {
  console.log(`\n# COURSE: ${course.title}`);
  console.log(`description: ${course.description}`);

  for (const courseModule of course.modules) {
    console.log(`\n## MODULE ${courseModule.order}: ${courseModule.title}`);
    console.log(`   description: ${courseModule.description ?? "-"}`);

    for (const phase of courseModule.phases) {
      const quiz = phase.quiz
        ? `quiz: ${phase.quiz._count.questions} questions, pass ${phase.quiz.passThreshold}%`
        : "quiz: none";
      console.log(`   - P${phase.order} ${phase.title} [${phase.stages.length} stages] (${quiz})`);
      console.log(`     desc: ${phase.description ?? "-"}`);
      for (const stage of phase.stages) {
        console.log(`       * ${stage.title}`);
      }
    }
  }
}

const totals = await db.phase.count();
const stageCount = await db.stage.count();
const questionCount = await db.question.count();
const quizCount = await db.quiz.count();
console.log(`\nTOTALS: phases=${totals} stages=${stageCount} quizzes=${quizCount} questions=${questionCount}`);

await db.$disconnect();
