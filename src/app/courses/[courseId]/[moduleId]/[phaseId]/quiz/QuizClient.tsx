"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/hooks/useSession";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

type Question = {
  id: string;
  type: string;
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

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await fetch(`/api/quiz/phase/${phaseId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load quiz");
      const data = await res.json();
      setQuestions(data.questions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  }, [phaseId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

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

  if (result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card className={`p-8 text-center ${
          result.passed
            ? "border-green-200 bg-green-50/50"
            : "border-amber-200 bg-amber-50/50"
        }`}>
          <div className={`flex items-center justify-center gap-3 mb-4 ${
            result.passed ? "text-green-600" : "text-amber-600"
          }`}>
            {result.passed ? (
              <span role="img" aria-label="passed">✓</span>
            ) : (
              <span role="img" aria-label="failed">✗</span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-heading mb-2">
            {result.passed ? "Quiz Passed!" : "Quiz Not Passed"}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Score: {result.percentage}% (need {result.passThreshold}% to pass)
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retake Quiz
          </Button>
        </Card>

        <div className="space-y-3">
          {result.results.map((r) => (
            <Card key={r.questionId} className="p-4">
              <div className="flex items-start gap-3">
                <Badge
                  variant={r.score >= 70 ? "default" : "outline"}
                  className="text-xs mt-0.5"
                >
                  {r.score}%
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">
                    {r.feedback}
                  </p>
                </div>
              </div>
            </Card>
          ))}
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-heading">Phase Quiz</h1>
        <Badge variant="outline">
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q) => (
          <Card key={q.id} className="p-5">
            <div className="flex items-start gap-3 mb-4">
              <Badge variant="outline" className="text-xs mt-0.5">
                {q.type}
              </Badge>
              <p className="font-medium text-foreground">{q.prompt}</p>
            </div>
            {q.type === "SNIPPET" ? (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[200px] font-mono text-sm rounded-lg border border-input bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Write your code here..."
                />
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-input bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  placeholder="Type your answer..."
                />
              </div>
            )}
          </Card>
        ))}
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quiz"}
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
