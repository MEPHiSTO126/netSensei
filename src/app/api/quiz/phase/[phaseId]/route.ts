import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ phaseId: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { phaseId } = await params;

    const phase = await db.phase.findUnique({
      where: { id: phaseId },
      include: {
        quiz: {
          include: { questions: true },
        },
      },
    });

    if (!phase || !phase.quiz) {
      return NextResponse.json({ questions: [] });
    }

    const isTutor = user.role === "TUTOR";

    const questions = phase.quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      language: q.language,
      prompt: q.prompt,
      fullGoal: q.fullGoal,
      // Students get the choices they can pick from, but never the key.
      options: (q.options as string[] | null) ?? undefined,
      // Tutor-only fields: the answer key and the teaching explanation.
      ...(isTutor
        ? {
            expectedAnswer: q.expectedAnswer,
            rubric: q.rubric,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
          }
        : {}),
    }));

    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
