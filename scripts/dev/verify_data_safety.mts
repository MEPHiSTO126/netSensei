import { db } from "../../src/lib/db";
import fs from "node:fs";

/**
 * Proves that a learner's records survive everything the deploy pipeline and
 * the content tooling can do:
 *
 *   setup  -> writes a progress record and an answer record for a throwaway
 *             student, and saves the ids to a temp file
 *   check  -> runs after the seed, the migration and the client generation,
 *             and asserts the records are still there
 *
 * Run it as separate commands so the pipeline steps are real processes:
 *
 *   npx tsx scripts/dev/verify_data_safety.mts setup
 *   npm run db:seed:production
 *   npx prisma migrate deploy
 *   npx prisma generate
 *   npx tsx scripts/dev/verify_data_safety.mts check
 */

const STATE_FILE = "scripts/dev/.safety-state.json";
const phase = process.argv[2];

async function setup() {
  const email = `safety-${Date.now()}@example.invalid`;
  const student = await db.user.create({
    data: { email, passwordHash: "x", role: "STUDENT" },
  });

  const phaseRow = await db.phase.findFirstOrThrow({
    where: { quiz: { isNot: null } },
    include: {
      module: { select: { courseId: true } },
      quiz: { include: { questions: { orderBy: { order: "asc" } } } },
    },
  });

  const question = phaseRow.quiz!.questions[0];

  await db.progressRecord.create({
    data: {
      studentId: student.id,
      courseId: phaseRow.module.courseId,
      phaseId: phaseRow.id,
      score: 88,
      passed: true,
      attemptNumber: 1,
    },
  });

  await db.answerRecord.create({
    data: {
      questionId: question.id,
      studentId: student.id,
      content: "a test answer",
      type: question.type,
      score: 88,
      aiFeedback: "test",
      attemptNumber: 1,
    },
  });

  fs.writeFileSync(
    STATE_FILE,
    JSON.stringify({
      studentId: student.id,
      email,
      phaseId: phaseRow.id,
      questionId: question.id,
    }),
    "utf8",
  );

  const progress = await db.progressRecord.count({
    where: { studentId: student.id },
  });
  const answers = await db.answerRecord.count({
    where: { studentId: student.id },
  });
  console.log(
    `setup: student ${email} · progress=${progress} answers=${answers} · phase=${phaseRow.id}`,
  );

  await db.$disconnect();
}

async function check() {
  if (!fs.existsSync(STATE_FILE)) {
    console.error("No safety state file. Run the setup phase first.");
    process.exit(1);
  }

  const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));

  const progress = await db.progressRecord.findMany({
    where: { studentId: state.studentId },
  });
  const answers = await db.answerRecord.findMany({
    where: { studentId: state.studentId },
  });

  const phaseStillExists = await db.phase.findUnique({
    where: { id: state.phaseId },
    select: { id: true, title: true },
  });
  const questionStillExists = await db.question.findUnique({
    where: { id: state.questionId },
    select: { id: true },
  });

  console.log("\nRESULT");
  console.log(`  progress records : ${progress.length} (expected 1)`);
  console.log(`  answer records   : ${answers.length} (expected 1)`);
  console.log(
    `  phase id intact  : ${phaseStillExists ? "yes" : "NO - the phase was recreated"}`,
  );
  console.log(
    `  question intact  : ${questionStillExists ? "yes" : "NO - the question was recreated"}`,
  );
  console.log(
    `  score preserved  : ${progress[0]?.score === 88 ? "yes" : "NO"}`,
  );

  const pass =
    progress.length === 1 &&
    answers.length === 1 &&
    Boolean(phaseStillExists) &&
    Boolean(questionStillExists) &&
    progress[0]?.score === 88;

  await db.answerRecord.deleteMany({ where: { studentId: state.studentId } });
  await db.progressRecord.deleteMany({ where: { studentId: state.studentId } });
  await db.user.delete({ where: { id: state.studentId } });
  fs.rmSync(STATE_FILE, { force: true });
  console.log("\nthrowaway student removed");

  await db.$disconnect();

  if (!pass) {
    console.error("FAILED: learner data did not survive the pipeline");
    process.exit(1);
  }
  console.log("PASSED: learner data survives the full deploy pipeline");
}

if (phase === "setup") {
  await setup();
} else if (phase === "check") {
  await check();
} else {
  console.log("Usage: verify_data_safety.mts <setup|check>");
  process.exit(1);
}
