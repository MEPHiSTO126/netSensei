import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
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

    if (user.role !== "STUDENT") {
      return NextResponse.json(
        { error: "Tutor accounts cannot submit quizzes." },
        { status: 403 },
      );
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
      correctAnswer: string | null;
      explanation: string | null;
    }> = [];

    // Attempt numbers for every question in one query, instead of one per
    // question inside the grading loop.
    const questionIds = quiz.questions.map((question) => question.id);
    const existingAttempts = questionIds.length
      ? await db.answerRecord.groupBy({
          by: ["questionId"],
          where: {
            questionId: { in: questionIds },
            studentId: user.id,
          },
          _max: { attemptNumber: true },
        })
      : [];
    const attemptByQuestion = new Map(
      existingAttempts.map((row) => [row.questionId, row._max.attemptNumber ?? 0]),
    );

    const recordsToCreate: Prisma.AnswerRecordCreateManyInput[] = [];

    for (const question of quiz.questions) {
      const answer = answers[question.id] ?? "";
      const options = (question.options as string[] | null) ?? null;
      const correctIndex = question.correctIndex;

      let grade: { score: number; feedback: string };

      if (options && correctIndex !== null && correctIndex !== undefined) {
        // Multiple choice: grade deterministically. No AI call, no guesswork.
        const correctOption = options[correctIndex] ?? "";
        const isCorrect =
          answer.trim().toLowerCase() === correctOption.trim().toLowerCase();

        grade = {
          score: isCorrect ? 100 : 0,
          feedback: isCorrect
            ? "Correct."
            : `Not quite. The correct answer is: ${correctOption}`,
        };
      } else {
        grade = await (question.type === "SNIPPET"
          ? checkSnippet({
              code: answer,
              language: question.language,
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
      }

      const attemptNumber = (attemptByQuestion.get(question.id) ?? 0) + 1;

      recordsToCreate.push({
        questionId: question.id,
        studentId: user.id,
        content: answer,
        type: question.type,
        score: grade.score,
        aiFeedback: grade.feedback,
        attemptNumber,
      });

      totalScore += grade.score;
      results.push({
        questionId: question.id,
        score: grade.score,
        feedback: grade.feedback,
        // For multiple choice the key is the exact option text the student
        // picked from; for open questions it is the reference answer.
        correctAnswer:
          options && correctIndex !== null && correctIndex !== undefined
            ? (options[correctIndex] ?? null)
            : (question.expectedAnswer ?? null),
        explanation: question.explanation ?? null,
      });
    }

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passedQuiz = percentage >= quiz.passThreshold;

    // One batched insert instead of one write per question.
    if (recordsToCreate.length > 0) {
      await db.answerRecord.createMany({ data: recordsToCreate });
    }

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
          score: Math.max(existingProgress.score, percentage),
          passed: existingProgress.passed || passedQuiz,
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
