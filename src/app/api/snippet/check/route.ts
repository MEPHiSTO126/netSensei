import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkSnippet } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  questionId: z.string(),
  code: z.string(),
  language: z.string(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { questionId, code, language } = schema.parse(body);

    const question = await db.question.findUnique({
      where: { id: questionId },
      select: { fullGoal: true },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const result = await checkSnippet({
      code,
      language,
      fullGoal: question.fullGoal,
      questionId,
      studentId: user.id,
    });

    // Save snippet attempt
    await db.snippetAttempt.create({
      data: {
        questionId,
        studentId: user.id,
        code,
        language,
        aiFeedback: result.feedback,
        score: result.score,
      },
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Snippet check failed" }, { status: 500 });
  }
}
