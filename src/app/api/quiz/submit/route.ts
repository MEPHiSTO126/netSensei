import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkSnippet, gradeAnswer } from "@/lib/ai";
import { z } from "zod";

const schema = z.object({
  phaseId: z.string(),
  answers: z.record(z.string(), z.string()), // questionId -> answer
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { phaseId, answers } = schema.parse(body);

    const phase = await db.phase.findUnique({
      where: { id: phaseId },
      include: {
        quiz: {
          include: { questions: true },
        },
        module: {
          include: { course: true },
        },
      },
    });

    if (!phase || !phase.quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const { quiz } = phase;
    let totalScore = 0;
    const maxScore = quiz.questions.length * 100;
    const results: Array<{
      questionId: string;
      score: number;
      feedback: string;
    }> = [];

    for (const question of quiz.questions) {
      const answer = answers[question.id] ?? "";

      const grade = await (question.type === "SNIPPET"
        ? checkSnippet({
            code: answer,
            language: "javascript",
            fullGoal: question.fullGoal,
            questionId: question.id,
            studentId: user.id,
          })
        : gradeAnswer({
            questionType: question.type as "SNIPPET" | "TEXT" | "AUDIO",
            userAnswer: answer,
            questionId: question.id,
            studentId: user.id,
          }));

      // Determine attempt number
      const existing = await db.answerRecord.findFirst({
        where: {
          questionId: question.id,
          studentId: user.id,
        },
        orderBy: { attemptNumber: "desc" },
      });
      const attemptNumber = (existing?.attemptNumber ?? 0) + 1;

      const passed = grade.score >= 70;

      await db.answerRecord.create({
        data: {
          questionId: question.id,
          studentId: user.id,
          content: answer,
          type: question.type,
          score: grade.score,
          aiFeedback: grade.feedback,
          attemptNumber,
        },
      });

      totalScore += grade.score;
      results.push({
        questionId: question.id,
        score: grade.score,
        feedback: grade.feedback,
      });
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passedQuiz = percentage >= quiz.passThreshold;

    // Update or create progress record
    const existingProgress = await db.progressRecord.findFirst({
      where: {
        studentId: user.id,
        courseId: phase.module.courseId,
        phaseId: phase.id,
      },
    });

    if (existingProgress) {
      await db.progressRecord.update({
        where: { id: existingProgress.id },
        data: {
          score: percentage,
          passed: passedQuiz,
          attemptNumber: existingProgress.attemptNumber + 1,
          completedAt: new Date(),
        },
      });
    } else {
      await db.progressRecord.create({
        data: {
          studentId: user.id,
          courseId: phase.module.courseId,
          phaseId: phase.id,
          score: percentage,
          passed: passedQuiz,
          attemptNumber: 1,
        },
      });
    }

    return NextResponse.json({
      passed: passedQuiz,
      percentage,
      passThreshold: quiz.passThreshold,
      results,
    });
  } catch (err) {
    console.error("Quiz submit error:", err);
    return NextResponse.json({ error: "Quiz submission failed" }, { status: 500 });
  }
}
