"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";

type TutorRequestButtonProps = {
  stageId: string;
  stageTitle: string;
};

export function TutorRequestButton({
  stageId,
  stageTitle,
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
        <p className="text-xs text-muted-foreground mt-1">
          A tutor will pick up your request from the queue when they are online.
          Meanwhile, re-read the stage and try the phase quiz.
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
      <h3 className="text-sm font-medium text-heading mb-1">
        Stuck on this stage?
      </h3>
      <p className="text-xs text-muted-foreground mb-3">
        Tag this stage and send a tutor a question. Tutors see requests in their
        queue and can highlight the stage in live chat.
      </p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
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
