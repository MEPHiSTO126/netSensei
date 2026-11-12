import fs from "node:fs";
import { db } from "../../src/lib/db";

const phases = await db.phase.findMany({
  orderBy: [{ module: { order: "asc" } }, { order: "asc" }],
  include: {
    module: { select: { title: true, order: true } },
    stages: { select: { id: true, title: true, type: true, imageUrl: true } },
    quiz: {
      select: {
        _count: { select: { questions: true } },
        questions: {
          select: {
            id: true,
            prompt: true,
            type: true,
            options: true,
            correctIndex: true,
            explanation: true,
          },
        },
      },
    },
  },
});

const problems: string[] = [];

const emptyPhases = phases.filter((p) => p.stages.length === 0);
for (const phase of emptyPhases) {
  problems.push(
    `EMPTY PHASE: ${phase.module.title} > ${phase.title} (no lessons)`,
  );
}

const imageStages = phases.flatMap((p) =>
  p.stages
    .filter((s) => s.type === "IMAGE")
    .map((s) => ({ stage: s, phase: p })),
);
for (const { stage, phase } of imageStages) {
  const url = stage.imageUrl;
  if (!url) {
    problems.push(
      `IMAGE STAGE without an image: ${stage.title} (in ${phase.module.title} > ${phase.title})`,
    );
  } else if (url.startsWith("/") && !fs.existsSync(`public${url}`)) {
    problems.push(`MISSING IMAGE FILE: ${url} used by "${stage.title}"`);
  }
}

const quizzesWithoutQuestions = phases.filter((p) => p.quiz && p.quiz.questions.length === 0);
for (const phase of quizzesWithoutQuestions) {
  problems.push(
    `EMPTY QUIZ: ${phase.module.title} > ${phase.title}`,
  );
}

const phasesWithoutQuiz = phases.filter((p) => !p.quiz);
for (const phase of phasesWithoutQuiz) {
  problems.push(`NO QUIZ: ${phase.module.title} > ${phase.title}`);
}

const badQuestions = phases.flatMap((p) =>
  (p.quiz?.questions ?? [])
    .filter((q) => {
      const options = Array.isArray(q.options) ? (q.options as string[]) : null;
      if (options && options.length > 0) {
        return (
          q.correctIndex === null ||
          q.correctIndex < 0 ||
          q.correctIndex >= options.length ||
          !q.explanation
        );
      }
      return !q.explanation;
    })
    .map((q) => `QUESTION ISSUE: "${q.prompt.slice(0, 60)}" in ${p.module.title} > ${p.title}`) ?? [],
);

problems.push(...badQuestions);

const allQuestions = phases.flatMap((p) => p.quiz?.questions ?? []);
const mcq = allQuestions.filter(
  (q) => Array.isArray(q.options) && q.options.length > 0,
);
const open = allQuestions.filter(
  (q) => !Array.isArray(q.options) || q.options.length === 0,
);

console.log(`phases: ${phases.length} | stages: ${phases.reduce((s, p) => s + p.stages.length, 0)}`);
console.log(`MCQ questions: ${mcq.length} | open-ended: ${open.length}`);
console.log(`image stages: ${imageStages.length} | placeholder exists: ${fs.existsSync("public/uploads/placeholder.svg")}`);
console.log(`\nPROBLEMS (${problems.length}):`);
for (const problem of problems) console.log(`  - ${problem}`);

await db.$disconnect();
