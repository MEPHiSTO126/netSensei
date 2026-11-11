export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { QuizClient } from "./QuizClient";

export default async function QuizPage({
  params,
}: {
  params: Promise<{
    courseId: string;
    moduleId: string;
    phaseId: string;
  }>;
}) {
  const { courseId, moduleId, phaseId } = await params;
  const user = await getCurrentUser();
  const isTutor = user?.role === "TUTOR";

  // The questions are fetched here so the page renders with them already in
  // place. Fetching them from the browser afterwards meant the page painted
  // empty and then waited for a second round trip.
  const quiz = await db.quiz.findFirst({
    where: { phase: { id: phaseId } },
    include: { questions: { orderBy: { order: "asc" } } },
  });

  const questions = (quiz?.questions ?? []).map((question) => ({
    id: question.id,
    type: question.type,
    language: question.language,
    prompt: question.prompt,
    fullGoal: question.fullGoal,
    options: (question.options as string[] | null) ?? undefined,
    // The key is only ever sent to a tutor.
    ...(isTutor
      ? {
          expectedAnswer: question.expectedAnswer,
          rubric: question.rubric,
          correctIndex: question.correctIndex,
          explanation: question.explanation,
        }
      : {}),
  }));

  return (
    <QuizClient
      phaseId={phaseId}
      courseId={courseId}
      moduleId={moduleId}
      readOnly={isTutor}
      initialQuestions={questions}
    />
  );
}
