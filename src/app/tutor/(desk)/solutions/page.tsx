import { BookOpenCheck, CheckCircle2, KeyRound } from "lucide-react";
import { requireTutorPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function TutorSolutionsPage() {
  await requireTutorPage();

  const courses = await db.course.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          phases: {
            orderBy: { order: "asc" },
            where: { quiz: { isNot: null } },
            include: {
              quiz: {
                include: {
                  questions: { orderBy: { order: "asc" } },
                },
              },
            },
          },
        },
      },
    },
  });

  const quizCount = courses.reduce(
    (sum, course) =>
      sum +
      course.modules.reduce((mSum, module) => mSum + module.phases.length, 0),
    0,
  );
  const questionCount = courses.reduce(
    (sum, course) =>
      sum +
      course.modules.reduce(
        (mSum, module) =>
          mSum +
          module.phases.reduce(
            (pSum, phase) => pSum + (phase.quiz?.questions.length ?? 0),
            0,
          ),
        0,
      ),
    0,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Quiz solutions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer keys for every quiz in the course. Tutor view only — students
          never receive these answers.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline">
          {quizCount} quiz{quizCount === 1 ? "" : "zes"}
        </Badge>
        <Badge variant="outline">
          {questionCount} question{questionCount === 1 ? "" : "s"}
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <KeyRound className="h-3.5 w-3.5" />
          Answer key, goal, and rubric for each question
        </span>
      </div>

      {courses.length === 0 || quizCount === 0 ? (
        <Card>
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No quizzes in the published course yet.
          </p>
        </Card>
      ) : (
        <>
          <nav
            aria-label="Quiz index"
            className="rounded-lg border border-border bg-muted/40 p-5"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Jump to a quiz
            </p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
              {courses.flatMap((course) =>
                course.modules.flatMap((module) =>
                  module.phases.map((phase) => (
                    <li key={phase.id}>
                      <a
                        href={`#${phase.id}`}
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        {phase.title}
                      </a>
                    </li>
                  )),
                ),
              )}
            </ul>
          </nav>

          {courses.map((course) =>
            course.modules.map((module) =>
              module.phases.length === 0 ? null : (
                <section key={module.id} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <BookOpenCheck className="h-4 w-4 text-primary" />
                    <SectionTitle>
                      {module.title}
                    </SectionTitle>
                  </div>

                  {module.phases.map((phase) => {
                    const quiz = phase.quiz;
                    if (!quiz) return null;

                    return (
                      <Card key={phase.id} id={phase.id}>
                        <div className="p-6">
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-heading">
                                {phase.title}
                              </h3>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {quiz.passThreshold}% to pass · answer key
                                shown
                              </p>
                            </div>
                            <Badge variant="outline">
                              {quiz.questions.length} question
                              {quiz.questions.length === 1 ? "" : "s"}
                            </Badge>
                          </div>

                          <ol className="space-y-4">
                            {quiz.questions.map((question, index) => {
                              const options =
                                (question.options as string[] | null) ?? null;

                              return (
                                <li
                                  key={question.id}
                                  className="rounded-lg border border-border p-5"
                                >
                                <div className="flex items-start gap-3">
                                  <Badge
                                    variant="outline"
                                    className="mt-0.5 shrink-0"
                                  >
                                    {index + 1}
                                  </Badge>
                                  <div className="min-w-0 flex-1">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs"
                                    >
                                      {question.type === "SNIPPET"
                                        ? `SNIPPET · ${question.language.toUpperCase()}`
                                        : question.type}
                                    </Badge>
                                    <p className="mt-2 text-sm font-medium text-foreground">
                                      {question.prompt}
                                    </p>

                                    {options && options.length > 0 && (
                                      <ul className="mt-3 space-y-1.5">
                                        {options.map((option, optionIndex) => {
                                          const isKey =
                                            question.correctIndex === optionIndex;

                                          return (
                                            <li
                                              key={option}
                                              className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
                                                isKey
                                                  ? "border-emerald-600/40 bg-emerald-500/[0.08] text-foreground"
                                                  : "border-border bg-background text-muted-foreground"
                                              }`}
                                            >
                                              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                                                {isKey ? (
                                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                ) : (
                                                  <span className="h-1.5 w-1.5 rounded-full bg-border" />
                                                )}
                                              </span>
                                              <span className="min-w-0 leading-relaxed">
                                                {option}
                                              </span>
                                              {isKey && (
                                                <span className="ml-auto shrink-0 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
                                                  Key
                                                </span>
                                              )}
                                            </li>
                                          );
                                        })}
                                      </ul>
                                    )}

                                    {question.expectedAnswer && (
                                      <div className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.06] p-3">
                                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">
                                          Solution
                                        </span>
                                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                                          {question.expectedAnswer}
                                        </pre>
                                      </div>
                                    )}

                                    {question.explanation && (
                                      <div className="mt-2 rounded-lg border border-border bg-muted/40 p-3">
                                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                                          Shown to the student after the quiz
                                        </span>
                                        <p className="text-sm leading-relaxed text-foreground">
                                          {question.explanation}
                                        </p>
                                      </div>
                                    )}

                                    {(question.fullGoal || question.rubric) && (
                                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                        {question.fullGoal && (
                                          <p>Goal: {question.fullGoal}</p>
                                        )}
                                        {question.rubric && (
                                          <p>Rubric: {question.rubric}</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </li>
                              );
                            })}
                          </ol>
                        </div>
                      </Card>
                    );
                  })}
                </section>
              ),
            ),
          )}
        </>
      )}
    </div>
  );
}
