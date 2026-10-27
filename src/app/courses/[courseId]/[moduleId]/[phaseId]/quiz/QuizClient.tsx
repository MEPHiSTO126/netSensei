"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/hooks/useSession";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

type Question = {
  id: string;
  type: string;
  language: string;
  prompt: string;
  fullGoal: string | null;
};

type QuizResult = {
  passed: boolean;
  percentage: number;
  passThreshold: number;
  results: Array<{
    questionId: string;
    score: number;
    feedback: string;
  }>;
};

type QuizClientProps = {
  phaseId: string;
};

export function QuizClient({ phaseId }: QuizClientProps) {
  const { user } = useSession();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadQuiz() {
      try {
        const res = await fetch(`/api/quiz/phase/${phaseId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load quiz");
        const data = await res.json();
        if (!cancelled) setQuestions(data.questions ?? []);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load quiz");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadQuiz();
    return () => {
      cancelled = true;
    };
  }, [phaseId]);

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phaseId, answers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setError("");
  };

  if (result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card
          className={`p-8 text-center ${
            result.passed
              ? "border-primary/20 bg-primary/5"
              : "border-destructive/20 bg-destructive/5"
          }`}
        >
          <div
            className={`flex items-center justify-center gap-3 mb-4 ${
              result.passed ? "text-primary" : "text-destructive"
            }`}
          >
            {result.passed ? (
              <CheckCircle2 className="h-10 w-10" />
            ) : (
              <XCircle className="h-10 w-10" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-heading mb-2">
            {result.passed ? "Quiz Passed!" : "Quiz Not Passed"}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Score: {result.percentage}% (need {result.passThreshold}% to pass)
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleRetake} className="flex-1">
              Retake Quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex-1"
            >
              Back to Phase
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-heading">Question Feedback</h2>
          {result.results.map((r, idx) => {
            const q = questions.find((item) => item.id === r.questionId);
            const studentAnswer = answers[r.questionId];

            return (
              <Card key={r.questionId} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Question {idx + 1} · {q?.type ?? "QUESTION"}
                    </span>
                    <p className="font-semibold text-foreground text-sm">
                      {q?.prompt ?? "Question"}
                    </p>
                  </div>
                  <Badge
                    variant={r.score >= 70 ? "default" : "outline"}
                    className="text-xs shrink-0 font-bold"
                  >
                    {r.score}%
                  </Badge>
                </div>

                {studentAnswer && (
                  <div className="rounded-lg bg-muted/60 p-3 text-xs border border-border/50">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wide block mb-1">
                      Your answer
                    </span>
                    <pre className="font-mono whitespace-pre-wrap text-foreground">
                      {studentAnswer}
                    </pre>
                  </div>
                )}

                <div className="rounded-lg bg-primary/[0.06] border border-primary/15 p-3 text-xs">
                  <span className="text-[10px] uppercase font-bold text-primary tracking-wide block mb-1">
                    Feedback
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {r.feedback}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Sign in required</h1>
        <p className="text-muted-foreground mb-4">
          Please sign in to take quizzes.
        </p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">No questions found</h1>
        <p className="text-muted-foreground mb-4">
          This phase has no quiz yet.
        </p>
      </div>
    );
  }

  const answeredCount = questions.filter(
    (q) => answers[q.id]?.trim()
  ).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Phase Quiz</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Answer the questions below to evaluate your understanding
          </p>
        </div>
        <Badge
          variant={answeredCount === questions.length ? "default" : "outline"}
          className="text-xs font-medium"
        >
          {answeredCount}/{questions.length} answered
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <Card key={q.id} className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <Badge variant="outline" className="text-xs mt-0.5">
                {q.type === "SNIPPET"
                  ? `SNIPPET · ${q.language.toUpperCase()}`
                  : q.type}
              </Badge>
              <p className="font-medium text-foreground">{q.prompt}</p>
            </div>
            {q.type === "SNIPPET" ? (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[200px] font-mono text-sm rounded-lg border border-input bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  aria-label={q.prompt}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder={`Write your ${q.language.toUpperCase()} here...`}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-input bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  aria-label={q.prompt}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Type your answer..."
                />
              </div>
            )}
          </Card>
        ))}
        <Button
          type="submit"
          className="w-full h-11 text-base font-medium"
          disabled={submitting}
        >
          {submitting
            ? "Evaluating your answers with AI..."
            : answeredCount === questions.length
              ? "Submit Quiz"
              : `Submit Quiz (${questions.length - answeredCount} unanswered)`}
        </Button>
      </form>

      {error && (
        <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
