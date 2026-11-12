import { db } from "../../src/lib/db";

/**
 * The only script in the repository that deletes course content or learner
 * records. It exists so that wiping data is always a deliberate, typed
 * decision rather than a side effect of running a seed or a deploy.
 *
 * Usage:
 *   npx tsx scripts/dev/reset_course_content.mts --progress <student-email>
 *   npx tsx scripts/dev/reset_course_content.mts --content --confirm DELETE-CONTENT
 *
 *   --progress <email>  clears one student's progress, answers, snippet
 *                       attempts, requests, and sessions
 *   --content           deletes every module, phase, stage, quiz, and question
 *                       (wipes progress for everyone)
 */

const args = process.argv.slice(2);

function flag(name: string) {
  return args.includes(name);
}

function value(name: string) {
  const index = args.indexOf(name);
  return index === -1 ? null : (args[index + 1] ?? null);
}

const targetEmail = value("--progress");
const resetContent = flag("--content");
const confirmation = value("--confirm");

if (!resetContent && !targetEmail) {
  console.log(
    "Nothing to do. Pass --progress <student-email> or --content --confirm DELETE-CONTENT.",
  );
  process.exit(1);
}

async function resetStudentProgress(email: string) {
  const student = await db.user.findUnique({ where: { email } });
  if (!student) {
    console.log(`No account with the email ${email}.`);
    return;
  }

  const progress = await db.progressRecord.count({ where: { studentId: student.id } });
  const answers = await db.answerRecord.count({ where: { studentId: student.id } });
  const snippets = await db.snippetAttempt.count({ where: { studentId: student.id } });
  const requests = await db.tutorRequest.count({ where: { studentId: student.id } });

  console.log(`About to clear for ${email}:`);
  console.log(`  progress records : ${progress}`);
  console.log(`  answer records   : ${answers}`);
  console.log(`  snippet attempts : ${snippets}`);
  console.log(`  help requests    : ${requests}`);

  if (confirmation !== "CLEAR-THIS-STUDENT") {
    console.log(
      "\nStopped. Re-run with --confirm CLEAR-THIS-STUDENT to go ahead.",
    );
    process.exit(1);
  }

  await db.answerRecord.deleteMany({ where: { studentId: student.id } });
  await db.snippetAttempt.deleteMany({ where: { studentId: student.id } });
  await db.progressRecord.deleteMany({ where: { studentId: student.id } });
  await db.tutorRequest.deleteMany({ where: { studentId: student.id } });
  await db.message.deleteMany({ where: { senderId: student.id } });
  await db.tutorSession.deleteMany({ where: { studentId: student.id } });

  console.log(`\nCleared. ${email} starts fresh.`);
}

async function resetContentRows() {
  const phases = await db.phase.count({
    where: { module: { courseId: COURSE_ID } },
  });
  const questions = await db.question.count({
    where: { quiz: { phase: { module: { courseId: COURSE_ID } } } },
  });

  console.log("About to delete ALL course content:");
  console.log(`  phases   : ${phases}`);
  console.log(`  questions: ${questions}`);
  console.log(
    "\n  This also removes every learner's progress, answers, and snippet attempts.",
  );

  if (confirmation !== "DELETE-CONTENT") {
    console.log(
      "\nStopped. Re-run with --confirm DELETE-CONTENT to go ahead.",
    );
    process.exit(1);
  }

  await db.answerRecord.deleteMany({
    where: { question: { quiz: { phase: { module: { courseId: COURSE_ID } } } } },
  });
  await db.snippetAttempt.deleteMany({
    where: { question: { quiz: { phase: { module: { courseId: COURSE_ID } } } } },
  });
  await db.progressRecord.deleteMany({
    where: { phase: { module: { courseId: COURSE_ID } } },
  });
  await db.question.deleteMany({
    where: { quiz: { phase: { module: { courseId: COURSE_ID } } } },
  });
  await db.quiz.deleteMany({
    where: { phase: { module: { courseId: COURSE_ID } } },
  });
  await db.stage.deleteMany({
    where: { phase: { module: { courseId: COURSE_ID } } },
  });
  await db.phase.deleteMany({ where: { module: { courseId: COURSE_ID } } });
  await db.module.deleteMany({ where: { courseId: COURSE_ID } });

  console.log("\nCourse content deleted. Run `npm run db:seed` to rebuild it.");
}

const COURSE_ID = "course-frontend-v1";

if (targetEmail) {
  await resetStudentProgress(targetEmail);
}
if (resetContent) {
  await resetContentRows();
}

await db.$disconnect();
