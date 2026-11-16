import { db } from "../../src/lib/db";
import { GLOSSARY } from "../../src/data/glossary";
import { buildGlossaryPattern, type GlossaryEntry } from "../../src/lib/glossary";

/**
 * Uses the very pattern the stage renderer uses, so the check agrees with
 * what a learner actually sees (including plural forms and aliases).
 */
function mentions(entry: GlossaryEntry, text: string) {
  return buildGlossaryPattern(entry).test(text);
}

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
const checked = new Set<string>();
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

  const modulesInCourse = new Set(
    stages.map((stage) => stage.phase.module.title),
  );
  const entries = GLOSSARY.filter((entry) =>
    modulesInCourse.has(entry.module),
  );

  console.log(
    `\n${course.title} — ${stages.length} stages, ${entries.length} terms`,
  );

  for (const entry of entries) {
    checked.add(entry.term);
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
    if (!mentions(entry, visible)) {
      fail(`${entry.term}: stage "${entry.stage}" no longer mentions it`);
      continue;
    }

    // No earlier stage in the same module may mention it, or the
    // explanation arrives too late for that part of the course. An earlier
    // mention in another module is often a different sense of the word —
    // a git "record" is not a DNS record — so it does not count here.
    const index = stages.indexOf(target);
    const earlier = stages.slice(0, index).find((stage) => {
      if (stage.phase.module.title !== entry.module) return false;
      const text = stage.content.replace(/```[\s\S]*?```/g, " ");
      return mentions(entry, text);
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

// An entry whose module name matches no course at all is a typo in the
// glossary, and would otherwise pass simply because no course claimed it.
for (const entry of GLOSSARY) {
  if (!checked.has(entry.term)) {
    fail(`${entry.term}: no course has a module named "${entry.module}"`);
  }
}

console.log(
  failures === 0
    ? "\nPASSED: every glossary entry matches the course"
    : `\nFAILED: ${failures} problem(s)`,
);

await db.$disconnect();
if (failures > 0) process.exit(1);
