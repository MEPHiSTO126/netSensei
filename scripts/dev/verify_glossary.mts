import { db } from "../../src/lib/db";
import { GLOSSARY } from "../../src/data/glossary";

/**
 * Checks that every glossary entry still matches the course:
 *
 * - the module and stage it names still exist
 * - that stage still contains the term
 * - no earlier stage in the course mentions the term, so the explanation
 *   still arrives the first time a learner meets it
 *
 * A renamed stage fails here instead of quietly losing its explanation.
 */

const courses = await db.course.findMany({
  select: { id: true, title: true },
});

let failures = 0;
function fail(message: string) {
  failures += 1;
  console.log(`  FAIL  ${message}`);
}

for (const course of courses) {
  const stages = await db.stage.findMany({
    where: { phase: { module: { courseId: course.id } } },
    orderBy: [
      { phase: { module: { order: "asc" } } },
      { phase: { order: "asc" } },
      { order: "asc" },
    ],
    select: {
      id: true,
      title: true,
      content: true,
      phase: { select: { title: true, module: { select: { title: true } } } },
    },
  });

  const moduleOf = new Map<string, string>();
  for (const stage of stages) moduleOf.set(stage.title, stage.phase.module.title);

  console.log(`\n${course.title} — ${stages.length} stages, ${GLOSSARY.length} terms`);

  for (const entry of GLOSSARY) {
    const target = stages.find(
      (stage) =>
        stage.title === entry.stage &&
        stage.phase.module.title === entry.module,
    );

    if (!target) {
      fail(`${entry.term}: no stage "${entry.stage}" in module "${entry.module}"`);
      continue;
    }

    // The term must be visible in that stage, outside fenced code blocks.
    const visible = target.content.replace(/```[\s\S]*?```/g, " ");
    const pattern = new RegExp(
      `(?<![\\w$@])${entry.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`,
      "i",
    );
    if (!pattern.test(visible)) {
      fail(`${entry.term}: stage "${entry.stage}" no longer mentions it`);
      continue;
    }

    // No earlier stage may mention it, or the explanation arrives too late.
    const index = stages.indexOf(target);
    const earlier = stages.slice(0, index).find((stage) => {
      const text = stage.content.replace(/```[\s\S]*?```/g, " ");
      return pattern.test(text);
    });
    if (earlier) {
      fail(
        `${entry.term}: first appears earlier, in "${earlier.title}" (${earlier.phase.module.title})`,
      );
      continue;
    }

    console.log(`  ok    ${entry.term} → ${entry.module} › ${entry.stage}`);
  }
}

console.log(
  failures === 0
    ? "\nPASSED: every glossary entry matches the course"
    : `\nFAILED: ${failures} problem(s)`,
);

await db.$disconnect();
if (failures > 0) process.exit(1);
