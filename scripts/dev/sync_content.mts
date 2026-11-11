import { db } from "../../src/lib/db";
import { modules } from "../../prisma/seed";
import { questionContent } from "../../prisma/quiz-content";

/**
 * Applies the seed curriculum to the live database without deleting anything.
 *
 * The normal seed wipes and recreates every module, which destroys student
 * progress and answers. This script only creates what is missing and refreshes
 * the answer-key fields on questions that already exist, so it is safe to run
 * against production at any time.
 *
 * Matching is by title inside its parent, so re-running is a no-op.
 */

const COURSE_ID = "course-frontend-v1";

const stats = {
  modulesCreated: 0,
  phasesCreated: 0,
  stagesCreated: 0,
  quizzesCreated: 0,
  questionsCreated: 0,
  answerKeysUpdated: 0,
  unchanged: 0,
};

const course = await db.course.upsert({
  where: { id: COURSE_ID },
  update: {},
  create: {
    id: COURSE_ID,
    title: "Frontend Development",
    description:
      "Learn HTML, CSS, JavaScript, and React from scratch. Build real projects and get AI-powered feedback on your code.",
    order: 1,
    isPublished: true,
  },
});

for (const courseModule of modules) {
  const existingModule = await db.module.findFirst({
    where: { courseId: course.id, title: courseModule.title },
  });

  const targetModule =
    existingModule ??
    (await db.module.create({
      data: {
        courseId: course.id,
        title: courseModule.title,
        order: courseModule.order,
        description: courseModule.description ?? null,
      },
    }));

  if (!existingModule) stats.modulesCreated += 1;

  for (const phase of courseModule.phases) {
    const existingPhase = await db.phase.findFirst({
      where: { moduleId: targetModule.id, title: phase.title },
    });

    const targetPhase =
      existingPhase ??
      (await db.phase.create({
        data: {
          moduleId: targetModule.id,
          title: phase.title,
          order: phase.order,
          description: phase.description ?? null,
        },
      }));

    if (!existingPhase) stats.phasesCreated += 1;

    for (const stage of phase.stages) {
      const existingStage = await db.stage.findFirst({
        where: { phaseId: targetPhase.id, title: stage.title },
      });

      if (!existingStage) {
        await db.stage.create({
          data: {
            phaseId: targetPhase.id,
            title: stage.title,
            type: stage.type,
            content: stage.content,
            order: phase.stages.indexOf(stage),
          },
        });
        stats.stagesCreated += 1;
      }
    }

    if (!phase.quiz) continue;

    const existingQuiz = await db.quiz.findFirst({
      where: { phaseId: targetPhase.id },
    });

    const targetQuiz =
      existingQuiz ??
      (await db.quiz.create({
        data: {
          phaseId: targetPhase.id,
          mode: "NORMAL",
          passThreshold: phase.quiz.passThreshold ?? 70,
        },
      }));

    if (!existingQuiz) stats.quizzesCreated += 1;

    for (const [index, question] of phase.quiz.questions.entries()) {
      const content = questionContent[question.prompt];

      const existingQuestion = await db.question.findFirst({
        where: { quizId: targetQuiz.id, prompt: question.prompt },
      });

      if (!existingQuestion) {
        await db.question.create({
          data: {
            quizId: targetQuiz.id,
            type: question.type,
            language: question.language ?? "javascript",
            prompt: question.prompt,
            fullGoal: question.fullGoal ?? null,
            expectedAnswer: question.expectedAnswer ?? null,
            rubric: question.rubric ?? null,
            options: (content?.options ?? null) as never,
            correctIndex: content?.correctIndex ?? null,
            explanation: content?.explanation ?? null,
            order: index,
            points: question.points ?? 1,
          },
        });
        stats.questionsCreated += 1;
        continue;
      }

      // Existing question: only refresh the answer key, never the prompt.
      const options = (content?.options ?? null) as never;
      const correctIndex = content?.correctIndex ?? null;
      const same =
        JSON.stringify(existingQuestion.options ?? null) ===
          JSON.stringify(content?.options ?? null) &&
        existingQuestion.correctIndex === correctIndex &&
        existingQuestion.explanation === (content?.explanation ?? null);

      if (same) {
        stats.unchanged += 1;
        continue;
      }

      await db.question.update({
        where: { id: existingQuestion.id },
        data: {
          options,
          correctIndex,
          explanation: content?.explanation ?? null,
        },
      });
      stats.answerKeysUpdated += 1;
    }
  }
}

console.log("Content sync complete:");
console.log(`  modules created     : ${stats.modulesCreated}`);
console.log(`  phases created      : ${stats.phasesCreated}`);
console.log(`  stages created      : ${stats.stagesCreated}`);
console.log(`  quizzes created     : ${stats.quizzesCreated}`);
console.log(`  questions created   : ${stats.questionsCreated}`);
console.log(`  answer keys updated : ${stats.answerKeysUpdated}`);
console.log(`  unchanged questions : ${stats.unchanged}`);

const totals = {
  modules: await db.module.count({ where: { courseId: course.id } }),
  phases: await db.phase.count({
    where: { module: { courseId: course.id } },
  }),
  stages: await db.stage.count({
    where: { phase: { module: { courseId: course.id } } },
  }),
  quizzes: await db.quiz.count({
    where: { phase: { module: { courseId: course.id } } },
  }),
  questions: await db.question.count({
    where: { quiz: { phase: { module: { courseId: course.id } } } },
  }),
};

console.log("\nCourse totals now:");
for (const [key, value] of Object.entries(totals)) {
  console.log(`  ${key.padEnd(10)}: ${value}`);
}

await db.$disconnect();
