import { db } from "../src/lib/db";
import fs from "node:fs";

const course = await db.course.findFirst({
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
            quiz: {
              select: {
                passThreshold: true,
                _count: { select: { questions: true } },
              },
            },
          },
        },
      },
    },
  },
});

if (!course) throw new Error("No published course found.");

const phases = course.modules.flatMap((m) => m.phases);
const livePhases = phases.filter((p) => p.stages.length > 0);
const quizzes = livePhases.filter((p) => p.quiz);
const totalStages = livePhases.reduce((sum, p) => sum + p.stages.length, 0);
const totalQuestions = quizzes.reduce(
  (sum, p) => sum + (p.quiz?._count.questions ?? 0),
  0,
);

const lines: string[] = [];

lines.push(`# ${course.title} - Course Syllabus`);
lines.push("");
lines.push(`> ${course.description}`);
lines.push("");
lines.push("**Edition:** November 2026  ");
lines.push(
  `**Format:** Self-paced modules on netSensei with tutor support and live sessions  `,
);
lines.push(
  `**Volume:** ${course.modules.length} modules | ${livePhases.length} phases | ${totalStages} lessons | ${quizzes.length} quizzes (${totalQuestions} questions)`,
);
lines.push("");
lines.push("---");
lines.push("");

lines.push("## 1. Learning outcomes");
lines.push("");
lines.push(
  "By the end of this course you will be able to write a standards-based HTML page from a blank file and explain what the browser does with it; style it with predictable CSS using the cascade, the box model, and a deliberate type and spacing system; read a DevTools trace rather than guessing at a bug; and use JavaScript and React to make that page interactive and componentised.",
);
lines.push("");
lines.push(
  "Every unit is written around one idea: understand the mechanism, not just the syntax. You are expected to be able to explain why something happens, not only that it happens.",
);
lines.push("");

lines.push("## 2. How the course is structured");
lines.push("");
lines.push(
  "- **Module** - a subject area. Four modules make up the course.",
);
lines.push(
  "- **Phase** - one topic inside a module, usually taught in one sitting.",
);
lines.push(
  "- **Lesson** - a single stage of reading, ending with a quiz.",
);
lines.push(
  "- **Quiz** - checks the phase, returns the correct answer and the reasoning immediately, and can be retaken as often as you need.",
);
lines.push("");

lines.push("## 3. Curriculum outline");
lines.push("");

for (const courseModule of course.modules) {
  lines.push(`### Module ${courseModule.order}: ${courseModule.title}`);
  lines.push("");
  if (courseModule.description) {
    lines.push(courseModule.description);
    lines.push("");
  }

  for (const phase of courseModule.phases) {
    if (phase.stages.length === 0) {
      lines.push(
        `- **${phase.order}. ${phase.title}** - _in development_${phase.description ? ` - ${phase.description}` : ""}`,
      );
      continue;
    }

    const minutes = phase.stages.length * 20 + 35;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    const estimate = rest > 0 ? `${hours}h ${rest}m` : `${hours}h`;
    const quizNote = phase.quiz
      ? ` - quiz: ${phase.quiz._count.questions} questions, pass at ${phase.quiz.passThreshold}%`
      : "";

    lines.push(
      `- **${phase.order}. ${phase.title}**${phase.description ? ` - ${phase.description}` : ""} _(~${estimate})${quizNote}_`,
    );
    for (const stage of phase.stages) {
      lines.push(`  - ${stage.title}`);
    }
  }
  lines.push("");
}

lines.push("## 4. Assessment");
lines.push("");
lines.push(
  `- Each phase ends with a quiz. ${totalQuestions} questions across the course. Questions are multiple choice wherever a single defensible answer exists; a small number stay open-ended where producing the answer is the point.`,
);
lines.push(
  "- The pass mark is 70% per quiz. Unfinished questions are counted as wrong, so answer everything you can.",
);
lines.push(
  "- Every submission returns the correct answer and a short explanation of why it is correct, so a failed quiz still teaches.",
);
lines.push(
  "- Quizzes may be retaken. A retake re-grades from scratch and updates your phase progress; your best score is kept.",
);
lines.push(
  "- Written answers and code are marked against the rubric for that question, and the mark is returned with the reference answer.",
);
lines.push("");

lines.push("## 5. Tutor support");
lines.push("");
lines.push(
  "You are never expected to be stuck alone. Support is available at three levels, and using them is part of the course, not a favour.",
);
lines.push("");
lines.push(
  "- **Ask on the lesson.** Any lesson has a request-help control. Your question arrives attached to that exact lesson, so the answer can be given against the material you were reading.",
);
lines.push(
  "- **Tutor chat.** A live conversation with a tutor, with the full thread saved so you can refer back to it.",
);
lines.push(
  "- **Sessions.** Live one-to-one time, booked around the working week. Sessions are used for what the platform cannot do: unblocking a stalled line of reasoning, agreeing the direction of a project, and keeping momentum.",
);
lines.push("");

lines.push("## 6. Suggested pace");
lines.push("");
lines.push(
  "One phase is roughly one to two hours of focused work including the quiz. A workable rhythm is two phases a week with a short written recap between them, plus one live session. Spacing the work out matters more than doing more of it - the same material spread across a week is retained far better than the same material crammed into a weekend.",
);
lines.push("");
lines.push(
  "Progress is tracked per phase, so a tutor can see exactly where a gap is and target the next session at it instead of re-teaching what is already solid.",
);
lines.push("");

lines.push("## 7. What you need");
lines.push("");
lines.push(
  "- A code editor (VS Code is fine) and the browser's developer tools, which the course treats as a primary instrument rather than a fallback.",
);
lines.push(
  "- A terminal and Node.js for running a local server. The course works on Windows, macOS, and Linux.",
);
lines.push(
  "- No prior programming experience is assumed for the first two modules. Everything from the terminal onwards is taught in the lessons.",
);
lines.push("");

lines.push("## 8. In development");
lines.push("");
lines.push(
  "The following units are being written and will appear in the course outline as they are published. The order can shift to match a target framework or deadline.",
);
lines.push("");
lines.push("- Flexbox and Grid - one- and two-dimensional layout.");
lines.push("- Responsive layout, positioning, and motion.");
lines.push("- JavaScript fundamentals - the DOM, events, `fetch`, and modules.");
lines.push(
  "- React fundamentals - components, state, effects, and data fetching.",
);
lines.push("");

lines.push("## 9. Course agreements");
lines.push("");
lines.push(
  "- Read the lesson before the quiz and attempt it without notes first. The quiz is a check on understanding, not a memory test.",
);
lines.push(
  "- When something is unclear, ask on that lesson rather than guessing. A question attached to a lesson is answered far faster than one that arrives without context.",
);
lines.push(
  "- Write your own code. Exercises are written to be attempted, not copied; the value is in the attempt and the correction.",
);
lines.push(
  "- Use the request and chat systems for genuine questions about the material.",
);
lines.push("");

lines.push("---");
lines.push("");
lines.push(
  "This syllabus is generated from the live course outline, so it always matches what is actually published.",
);
lines.push("");

fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/syllabus.md", lines.join("\n"), "utf8");
console.log("docs/syllabus.md written");
console.log(
  `${course.modules.length} modules, ${livePhases.length} phases, ${totalStages} lessons, ${quizzes.length} quizzes`,
);

await db.$disconnect();
