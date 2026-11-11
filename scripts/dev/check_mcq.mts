import { db } from "../../src/lib/db";

const questions = await db.question.findMany({
  select: { id: true, prompt: true, quizId: true },
});

const byPrompt = new Map<string, string[]>();
for (const question of questions) {
  const list = byPrompt.get(question.prompt) ?? [];
  list.push(question.id);
  byPrompt.set(question.prompt, list);
}

const duplicates = [...byPrompt.entries()].filter(([, ids]) => ids.length > 1);
console.log(`questions: ${questions.length}`);
console.log(`distinct prompts: ${byPrompt.size}`);
console.log(`duplicate prompts: ${duplicates.length}`);
for (const [prompt, ids] of duplicates) {
  console.log(`  "${prompt.slice(0, 70)}" x${ids.length}`);
}

// Sanity check: every MCQ question has options, an in-range key, and a reason.
const allMcqCandidates = await db.question.findMany({
  select: { prompt: true, options: true, correctIndex: true, explanation: true },
});

const mcq = allMcqCandidates.filter(
  (question) => Array.isArray(question.options) && question.options.length > 0,
);

let bad = 0;
for (const question of mcq) {
  const options = question.options as string[];
  const problems: string[] = [];

  if (!Array.isArray(options) || options.length < 2) problems.push("bad options");
  if (question.correctIndex === null) problems.push("no key");
  else if (question.correctIndex < 0 || question.correctIndex >= options.length)
    problems.push("key out of range");
  if (!question.explanation) problems.push("no explanation");
  if (new Set(options).size !== options.length) problems.push("duplicate options");

  if (problems.length) {
    bad += 1;
    console.log(`  BAD: ${question.prompt.slice(0, 60)} -> ${problems.join(", ")}`);
  }
}

console.log(`\nMCQ questions: ${mcq.length}, malformed: ${bad}`);

await db.$disconnect();
