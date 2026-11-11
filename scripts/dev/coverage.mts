import { db } from "../../src/lib/db";
import { questionContent } from "../../prisma/quiz-content";

const questions = await db.question.findMany({
  select: {
    prompt: true,
    options: true,
    quiz: {
      select: {
        phase: {
          select: { title: true, module: { select: { title: true } } },
        },
      },
    },
  },
});

const byModule = new Map<string, { total: number; mcq: number; open: number }>();

for (const question of questions) {
  const moduleName = question.quiz.phase.module.title;
  const phaseName = question.quiz.phase.title;
  const key = `${moduleName} > ${phaseName}`;

  const entry = byModule.get(key) ?? { total: 0, mcq: 0, open: 0 };
  entry.total += 1;

  const isMcq = Array.isArray(question.options) && question.options.length > 0;
  if (isMcq) entry.mcq += 1;
  else if (questionContent[question.prompt]) entry.open += 1;

  byModule.set(key, entry);
}

const totals = { total: 0, mcq: 0, open: 0, untouched: 0 };

for (const [key, value] of byModule) {
  const untouched = value.total - value.mcq - value.open;
  totals.total += value.total;
  totals.mcq += value.mcq;
  totals.open += value.open;
  totals.untouched += untouched;

  const mark = untouched > 0 ? "  <-- needs keys" : value.open > 0 ? "  (code)" : "";
  console.log(
    `${value.mcq}/${value.total} MCQ  ${key}${mark}`,
  );
}

console.log(
  `\nTOTAL ${totals.total} questions | ${totals.mcq} MCQ | ${totals.open} open-ended with key | ${totals.untouched} still needing keys`,
);

await db.$disconnect();
