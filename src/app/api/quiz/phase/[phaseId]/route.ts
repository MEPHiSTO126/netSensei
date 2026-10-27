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

    const questions = phase.quiz.questions.map((q) => ({
      id: q.id,
      type: q.type,
      language: q.language,
      prompt: q.prompt,
      fullGoal: q.fullGoal,
    }));

    return NextResponse.json({ questions });
  } catch {
    return NextResponse.json({ error: "Failed to load quiz" }, { status: 500 });
  }
}
