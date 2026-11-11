import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CalendarClock,
  Code2,
  GraduationCap,
  HelpCircle,
  ListChecks,
  MessageSquare,
  Monitor,
  Target,
} from "lucide-react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Course Syllabus | netSensei",
  description:
    "Syllabus for the Frontend Development course on netSensei: curriculum, assessments, and how tutor support works.",
};

export const dynamic = "force-dynamic";

function hoursEstimate(stages: number) {
  // ~20 minutes per stage, plus a quiz and review for the phase.
  const stageMinutes = stages * 20;
  const quizMinutes = 35;
  const total = stageMinutes + quizMinutes;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export default async function SyllabusPage() {
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
              _count: { select: { stages: true } },
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

  const phases = course?.modules.flatMap((m) => m.phases) ?? [];
  const totalStages = phases.reduce((sum, p) => sum + p._count.stages, 0);
  const livePhases = phases.filter((p) => p._count.stages > 0);
  const quizzes = phases.filter((p) => p.quiz);
  const totalQuestions = quizzes.reduce(
    (sum, p) => sum + (p.quiz?._count.questions ?? 0),
    0,
  );
  const thresholds = Array.from(
    new Set(quizzes.map((p) => p.quiz?.passThreshold ?? 70)),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      <div>
        <Link
          href="/courses"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Syllabus</Badge>
          <Badge variant="secondary">Frontend Development</Badge>
        </div>
        <h1 className="mt-3 text-3xl font-bold text-heading">
          {course?.title ?? "Frontend Development"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {course?.description ??
            "Learn HTML, CSS, JavaScript, and React from scratch."}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Edition: November 2026 · Review each term before starting a new unit
        </p>
      </div>

      <Card className="p-6 md:p-8 space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              Learning outcomes
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            By the end of this course you will be able to write a standards-based
            HTML page from a blank file and explain what the browser does with
            it; style it with predictable CSS using the cascade, the box model,
            and a deliberate type and spacing system; read a DevTools trace
            rather than guessing at a bug; and use JavaScript and React to make
            that page interactive and componentised.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Every unit is written around one idea: understand the mechanism,
            not just the syntax. You are expected to be able to explain why
            something happens, not only that it happens.
          </p>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <ListChecks className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              How the course is structured
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Modules", value: course?.modules.length ?? 0 },
              { label: "Phases", value: livePhases.length },
              { label: "Lessons", value: totalStages },
              { label: "Quizzes", value: quizzes.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-muted/30 p-4"
              >
                <p className="text-3xl font-bold tabular-nums text-heading">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Module</strong> — a subject
              area. Four modules make up the course.
            </li>
            <li>
              <strong className="text-foreground">Phase</strong> — one topic
              inside a module, usually taught in one sitting.
            </li>
            <li>
              <strong className="text-foreground">Lesson</strong> — a single
              stage of reading, ending with a quiz.
            </li>
            <li>
              <strong className="text-foreground">Quiz</strong> — checks the
              phase, returns the correct answer and the reasoning immediately,
              and can be retaken as often as you need.
            </li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              Curriculum outline
            </h2>
          </div>
          <div className="space-y-5">
            {course?.modules.map((module) => (
              <div key={module.id}>
                <h3 className="text-base font-semibold text-heading">
                  Module {module.order}: {module.title}
                </h3>
                {module.description && (
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {module.description}
                  </p>
                )}
                <ul className="mt-3 space-y-3">
                  {module.phases.map((phase) => {
                    const inDevelopment = phase._count.stages === 0;

                    return (
                      <li
                        key={phase.id}
                        className="rounded-lg border border-border p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              {phase.order}. {phase.title}
                            </p>
                            {phase.description && (
                              <p className="mt-1 text-sm text-muted-foreground">
                                {phase.description}
                              </p>
                            )}
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {inDevelopment ? (
                              <Badge variant="outline">In development</Badge>
                            ) : (
                              <>
                                <Badge variant="secondary">
                                  {phase._count.stages} lessons
                                </Badge>
                                {phase.quiz && (
                                  <Badge variant="outline">
                                    {phase.quiz._count.questions} questions ·{" "}
                                    {phase.quiz.passThreshold}% to pass
                                  </Badge>
                                )}
                                <Badge variant="outline">
                                  ≈{hoursEstimate(phase._count.stages)}
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">Assessment</h2>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              Each phase ends with a quiz of {totalQuestions} questions across the
              course. Questions are multiple choice wherever a single defensible
              answer exists; a small number stay open-ended where producing the
              answer is the point.
            </li>
            <li>
              The pass mark is {thresholds.join("% / ")}% per quiz. Unfinished
              questions are counted as wrong, so answer everything you can.
            </li>
            <li>
              Every submission returns the correct answer and a short
              explanation of why it is correct, so a failed quiz still teaches.
            </li>
            <li>
              Quizzes may be retaken. A retake re-grades from scratch and
              updates your phase progress; your best score is kept.
            </li>
            <li>
              Written answers and code are marked against the rubric for that
              question, and the mark is returned with the reference answer.
            </li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              Tutor support
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You are never expected to be stuck alone. Support is available at
            three levels, and using them is part of the course, not a favour.
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              <strong className="text-foreground">Ask on the lesson.</strong>{" "}
              Any lesson has a request-help control. Your question arrives
              attached to that exact lesson, so the answer can be given against
              the material you were reading.
            </li>
            <li>
              <strong className="text-foreground">Tutor chat.</strong> A live
              conversation with a tutor, with the full thread saved so you can
              refer back to it.
            </li>
            <li>
              <strong className="text-foreground">Sessions.</strong> Live
              one-to-one time, booked around the working week. Sessions are
              used for what the platform cannot do: unblocking a stalled line
              of reasoning, agreeing the direction of a project, and keeping
              momentum.
            </li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              Suggested pace
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            One phase is roughly one to two hours of focused work including
            the quiz. A workable rhythm is two phases a week with a short
            written recap between them, plus one live session. Spacing the
            work out matters more than doing more of it — the same material
            spread across a week is retained far better than the same material
            crammed into a weekend.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Progress is tracked per phase, so a tutor can see exactly where a
            gap is and target the next session at it instead of re-teaching
            what is already solid.
          </p>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              What you need
            </h2>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              A code editor (VS Code is fine) and the browser&apos;s developer
              tools, which the course treats as a primary instrument rather
              than a fallback.
            </li>
            <li>
              A terminal and Node.js for running a local server. The course
              works on Windows, macOS, and Linux.
            </li>
            <li>
              No prior programming experience is assumed for the first two
              modules. Everything from the terminal onwards is taught in the
              lessons.
            </li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              In development
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            The following units are being written and will appear in the
            course outline as they are published. The order can shift to match
            a target framework or deadline.
          </p>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Flexbox and Grid — one- and two-dimensional layout.</li>
            <li>Responsive layout, positioning, and motion.</li>
            <li>
              JavaScript fundamentals — the DOM, events, <code>fetch</code>,
              and modules.
            </li>
            <li>
              React fundamentals — components, state, effects, and data
              fetching.
            </li>
          </ul>
        </section>

        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-heading">
              Course agreements
            </h2>
          </div>
          <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>
              Read the lesson before the quiz and attempt it without notes
              first. The quiz is a check on understanding, not a memory test.
            </li>
            <li>
              When something is unclear, ask on that lesson rather than
              guessing. A question attached to a lesson is answered far
              faster than one that arrives without context.
            </li>
            <li>
              Write your own code. Exercises are written to be attempted, not
              copied; the value is in the attempt and the correction.
            </li>
            <li>
              Use the request and chat systems for genuine questions about the
              material.
            </li>
          </ul>
        </section>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <Code2 className="h-4 w-4" />
          Start the course
        </Link>
        <Link
          href="/tutor/chat"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary hover:underline"
        >
          <MessageSquare className="h-4 w-4" />
          Ask a tutor
        </Link>
      </div>
    </div>
  );
}
