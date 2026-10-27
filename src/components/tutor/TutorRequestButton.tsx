"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";

type TutorRequestButtonProps = {
  stageId: string;
  stageTitle: string;
  onlineTutorCount: number;
};

export function TutorRequestButton({
  stageId,
  stageTitle,
  onlineTutorCount,
}: TutorRequestButtonProps) {
  const { user, loading } = useSession();
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [requested, setRequested] = useState(false);

  if (loading) return null;
  if (user?.role !== "STUDENT") return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/tutor/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stageId,
          question: question.trim() || `I am stuck on "${stageTitle}", can someone help?`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to request help");
      setRequested(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to request help");
    } finally {
      setSending(false);
    }
  };

  if (requested) {
    return (
      <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium text-heading">Tutor help requested</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your question is in the queue.{" "}
          {onlineTutorCount > 0
            ? "A tutor is online now."
            : "No tutor is online right now, so expect a reply when one opens the queue."}{" "}
          You can also continue the conversation in chat.
        </p>
        <Link
          href="/tutor/chat"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Open tutor chat
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-heading">
          Stuck on this stage?
        </h3>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              onlineTutorCount > 0 ? "bg-emerald-600" : "bg-muted-foreground"
            }`}
          />
          {onlineTutorCount > 0
            ? `${onlineTutorCount} tutor${onlineTutorCount === 1 ? "" : "s"} online`
            : "No tutor online"}
        </span>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        Tag this stage and send a tutor a question. Tutors see requests in their
        queue and can reply with a direct link back to this stage.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          aria-label={`Question about ${stageTitle}`}
          placeholder={`What are you stuck on in "${stageTitle}"?`}
          className="w-full min-h-[80px] rounded-lg border border-input bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        <Button type="submit" size="sm" disabled={sending}>
          {sending ? "Sending..." : "Request tutor help"}
        </Button>
      </form>
    </div>
  );
}
