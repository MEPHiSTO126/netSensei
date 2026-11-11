"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/ui/section-title";
import { CheckCircle2, Eye, FileQuestion, Loader2, XCircle } from "lucide-react";

type Question = {
  id: string;
  type: string;
  language: string;
  prompt: string;
  fullGoal: string | null;
  /** Multiple-choice choices. Absent means the question is open-ended. */
  options?: string[];
  /** Tutor-only fields; absent for students. */
  expectedAnswer?: string | null;
  rubric?: string | null;
  correctIndex?: number | null;
  explanation?: string | null;
};

type QuizResult = {
  passed: boolean;
  percentage: number;
  passThreshold: number;
  results: Array<{
    questionId: string;
    score: number;
    feedback: string;
    correctAnswer: string | null;
    explanation: string | null;
  }>;
};

type QuizClientProps = {
  phaseId: string;
  courseId?: string;
  moduleId?: string;
  readOnly?: boolean;
  /** Questions come from the server so the page renders without a second round trip. */
  initialQuestions?: Question[];
};

export function QuizClient({
  phaseId,
  courseId,
  moduleId,
  readOnly = false,
  initialQuestions,
}: QuizClientProps) {
  const { user } = useSession();
  const [questions] = useState<Question[]>(initialQuestions ?? []);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading] = useState(initialQuestions === undefined);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState("");

  const phaseUrl =
    courseId && moduleId
      ? `/courses/${courseId}/${moduleId}/${phaseId}`
      : null;

  const handleChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSnippetKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    questionId: string,
  ) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const { selectionStart, selectionEnd, value } = textarea;

      if (e.shiftKey) {
        // Shift+Tab: unindent 2 spaces if line starts with 2 spaces
        const beforeCursor = value.substring(0, selectionStart);
        const lineStart = beforeCursor.lastIndexOf("\n") + 1;
        const linePrefix = value.substring(lineStart, lineStart + 2);
        if (linePrefix === "  ") {
          const newValue =
            value.substring(0, lineStart) + value.substring(lineStart + 2);
          handleChange(questionId, newValue);
          requestAnimationFrame(() => {
            textarea.selectionStart = Math.max(lineStart, selectionStart - 2);
            textarea.selectionEnd = Math.max(lineStart, selectionEnd - 2);
          });
        }
      } else {
        // Tab: insert 2 spaces
        const newValue =
          value.substring(0, selectionStart) +
          "  " +
          value.substring(selectionEnd);
        handleChange(questionId, newValue);
        requestAnimationFrame(() => {
          textarea.selectionStart = selectionStart + 2;
          textarea.selectionEnd = selectionStart + 2;
        });
      }
    }
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

  if (readOnly) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-5">
          <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-heading">Tutor preview</p>
            <p className="text-sm text-muted-foreground">
              You can read the quiz questions, but only students can submit
              answers.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-heading">Phase Quiz</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {questions.length} question
              {questions.length !== 1 ? "s" : ""} · read-only preview
            </p>
          </div>
          <Badge variant="outline">Preview</Badge>
        </div>

        {questions.length === 0 ? (
          <Card>
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">
              This phase has no quiz questions yet.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {questions.map((q, index) => (
              <Card key={q.id} className="p-6">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 shrink-0">
                    {index + 1}
                  </Badge>
                  <div className="min-w-0">
                    <Badge variant="secondary" className="text-xs">
                      {q.type === "SNIPPET"
                        ? `SNIPPET · ${q.language.toUpperCase()}`
                        : q.type}
                    </Badge>
                    <p className="mt-2 font-medium text-foreground">
                      {q.prompt}
                    </p>

                    {q.options && q.options.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {q.options.map((option, optionIndex) => {
                          const isKey = q.correctIndex === optionIndex;

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

                    {q.expectedAnswer && (
                      <div className="mt-3 rounded-lg border border-primary/20 bg-primary/[0.06] p-3">
                        <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary">
                          Solution
                        </span>
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
                          {q.expectedAnswer}
                        </pre>
                      </div>
                    )}

                    {(q.fullGoal || q.rubric) && (
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        {q.fullGoal && <p>Goal: {q.fullGoal}</p>}
                        {q.rubric && <p>Rubric: {q.rubric}</p>}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {phaseUrl ? (
          <Link
            href={phaseUrl}
            className="inline-flex items-center justify-center rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto"
          >
            Back to phase
          </Link>
        ) : (
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            Back to phase
          </Button>
        )}
      </div>
    );
  }

  if (result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card
          role="status"
          aria-live="polite"
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
            {phaseUrl ? (
              <Link
                href={phaseUrl}
                className={`flex-1 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  result.passed
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input hover:bg-muted text-foreground"
                }`}
              >
                {result.passed ? "Back to Phase Overview →" : "Back to Phase"}
              </Link>
            ) : (
              <Button
                variant={result.passed ? "default" : "outline"}
                onClick={() => window.history.back()}
                className="flex-1"
              >
                {result.passed ? "Back to Phase Overview →" : "Back to Phase"}
              </Button>
            )}
            <Button
              onClick={handleRetake}
              variant={result.passed ? "outline" : "default"}
              className="flex-1"
            >
              Retake Quiz
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          <SectionTitle>Question Feedback</SectionTitle>
          {result.results.map((r, idx) => {
            const q = questions.find((item) => item.id === r.questionId);
            const studentAnswer = answers[r.questionId];

            return (
              <Card key={r.questionId} className="p-6 space-y-4">
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
                    <span className="text-xs uppercase font-bold text-muted-foreground tracking-wide block mb-1">
                      Your answer
                    </span>
                    <pre className="font-mono whitespace-pre-wrap text-foreground">
                      {studentAnswer}
                    </pre>
                  </div>
                )}

                {r.correctAnswer && (
                  <div
                    className={`rounded-lg border p-3 text-xs ${
                      r.score >= 70
                        ? "border-emerald-600/30 bg-emerald-500/[0.07]"
                        : "border-primary/20 bg-primary/[0.06]"
                    }`}
                  >
                    <span
                      className={`text-xs uppercase font-bold tracking-wide block mb-1 ${
                        r.score >= 70
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-primary"
                      }`}
                    >
                      Correct answer
                    </span>
                    <pre className="font-mono whitespace-pre-wrap text-foreground">
                      {r.correctAnswer}
                    </pre>
                  </div>
                )}

                <div className="rounded-lg bg-primary/[0.06] border border-primary/15 p-3 text-xs">
                  <span className="text-xs uppercase font-bold text-primary tracking-wide block mb-1">
                    Feedback
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {r.feedback}
                  </p>
                </div>

                {r.explanation && (
                  <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs">
                    <span className="text-xs uppercase font-bold text-muted-foreground tracking-wide block mb-1">
                      Why
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">
                      {r.explanation}
                    </p>
                  </div>
                )}
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
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {error ? (
              <XCircle className="h-5 w-5" />
            ) : (
              <FileQuestion className="h-5 w-5" />
            )}
          </div>
          <h1 className="text-xl font-bold text-heading">
            {error ? "The quiz could not be loaded" : "No questions found"}
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {error
              ? "Check your connection and try again."
              : "This phase has no quiz yet."}
          </p>
          <Button variant="outline" className="mt-5" onClick={() => location.reload()}>
            Try again
          </Button>
        </div>
        {error && (
          <p className="rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }

  const answeredCount = questions.filter(
    (q) => answers[q.id]?.trim()
  ).length;
  const allMultipleChoice = questions.every(
    (q) => q.options && q.options.length > 0
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Phase Quiz</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {allMultipleChoice
              ? "Pick the answer that is correct. You will see the key and the reasoning after you submit."
              : "Answer the questions below. You will see the key and the reasoning after you submit."}
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
          <Card key={q.id} className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Badge variant="outline" className="text-xs mt-0.5">
                {q.type === "SNIPPET"
                  ? `SNIPPET · ${q.language.toUpperCase()}`
                  : q.type}
              </Badge>
              <p className="font-medium text-foreground">{q.prompt}</p>
            </div>
            {q.options && q.options.length > 0 ? (
              <fieldset className="space-y-2">
                <legend className="sr-only">{q.prompt}</legend>
                {q.options.map((option, optionIndex) => {
                  const selected = answers[q.id] === option;
                  const optionId = `${q.id}-option-${optionIndex}`;

                  return (
                    <label
                      key={option}
                      htmlFor={optionId}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 text-sm transition-colors ${
                        selected
                          ? "border-primary bg-primary/[0.06] text-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <input
                        id={optionId}
                        type="radio"
                        name={q.id}
                        value={option}
                        checked={selected}
                        onChange={() => handleChange(q.id, option)}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-primary)]"
                      />
                      <span className="min-w-0 leading-relaxed">{option}</span>
                    </label>
                  );
                })}
              </fieldset>
            ) : q.type === "SNIPPET" ? (
              <div className="space-y-2">
                <textarea
                  className="w-full min-h-[200px] font-mono text-sm rounded-lg border border-input bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none leading-relaxed"
                  aria-label={q.prompt}
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  onKeyDown={(e) => handleSnippetKeyDown(e, q.id)}
                  placeholder={`Write your ${q.language.toUpperCase()} here...`}
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>
                    Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Tab</kbd> to indent, <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-xs">Shift+Tab</kbd> to unindent
                  </span>
                </div>
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
          className="w-full h-11 text-base font-medium flex items-center justify-center gap-2"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>
                {allMultipleChoice
                  ? "Checking your answers..."
                  : "Evaluating your answers with AI..."}
              </span>
            </>
          ) : answeredCount === questions.length ? (
            "Submit Quiz"
          ) : (
            `Submit Quiz (${questions.length - answeredCount} unanswered)`
          )}
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
