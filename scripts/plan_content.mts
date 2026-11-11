import { modules } from "../prisma/seed";
import { questionContent } from "../prisma/quiz-content";

for (const courseModule of modules) {
  console.log(
    `\nMODULE ${courseModule.order}: ${courseModule.title}  (${courseModule.phases.length} phases)`,
  );
  for (const phase of courseModule.phases) {
    const quiz = phase.quiz;
    const withContent = quiz
      ? quiz.questions.filter((q) => questionContent[q.prompt]?.options).length
      : 0;
    const missingContent = quiz
      ? quiz.questions.filter((q) => !questionContent[q.prompt]).length
      : 0;
    console.log(
      `   P${phase.order} ${phase.title} [${phase.stages.length} stages]${
        quiz
          ? ` quiz:${quiz.questions.length}q mcq:${withContent} missingKey:${missingContent}`
          : " (no quiz)"
      }`,
    );
  }
}

const allQuestions = modules.flatMap((m) =>
  m.phases.flatMap((p) => p.quiz?.questions ?? []),
);
const missing = allQuestions.filter((q) => !questionContent[q.prompt]);
console.log(`\ntotal questions in seed: ${allQuestions.length}`);
console.log(`without MCQ/answer-key content: ${missing.length}`);
for (const q of missing) console.log(`  - [${q.type}] ${q.prompt}`);
