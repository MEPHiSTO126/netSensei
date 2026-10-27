"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export type StageOption = {
  id: string;
  title: string;
};

type TutorComposerProps = {
  sessionId: string;
  stageOptions?: StageOption[];
  defaultType?: "TEXT" | "HIGHLIGHT";
  defaultStageId?: string | null;
};

export function TutorComposer({
  sessionId,
  stageOptions = [],
  defaultType = "TEXT",
  defaultStageId = null,
}: TutorComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [type, setType] = useState<"TEXT" | "HIGHLIGHT">(defaultType);
  const [stageId, setStageId] = useState(
    defaultStageId ?? stageOptions[0]?.id ?? "",
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const canHighlight = stageOptions.length > 0;
  const activeType = canHighlight ? type : "TEXT";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    if (activeType === "HIGHLIGHT" && !stageId) {
      setError("Choose a stage to highlight.");
      return;
    }

    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/tutor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          content: trimmed,
          type: activeType,
          stageId: activeType === "HIGHLIGHT" ? stageId || null : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setContent("");
      setType("TEXT");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend(e);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-2 border-t border-border p-4">
      {canHighlight && (
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-md border border-border bg-muted/50 p-0.5"
            role="group"
            aria-label="Message type"
          >
            <button
              type="button"
              onClick={() => setType("TEXT")}
              aria-pressed={activeType === "TEXT"}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                activeType === "TEXT"
                  ? "bg-background text-heading shadow-sm"
                  : "text-muted-foreground hover:text-heading"
              }`}
            >
              Message
            </button>
            <button
              type="button"
              onClick={() => setType("HIGHLIGHT")}
              aria-pressed={activeType === "HIGHLIGHT"}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                activeType === "HIGHLIGHT"
                  ? "bg-background text-heading shadow-sm"
                  : "text-muted-foreground hover:text-heading"
              }`}
            >
              Highlight stage
            </button>
          </div>

          {activeType === "HIGHLIGHT" && (
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <label
                htmlFor="highlight-stage"
                className="shrink-0 text-xs font-medium text-muted-foreground"
              >
                Stage
              </label>
              <select
                id="highlight-stage"
                value={stageId}
                onChange={(e) => setStageId(e.target.value)}
                className="min-w-0 flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {stageOptions.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {activeType === "HIGHLIGHT" && (
        <p className="text-xs text-muted-foreground">
          The student gets a direct link to this stage in the chat.
        </p>
      )}

      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label={
              activeType === "HIGHLIGHT"
                ? "Highlight message"
                : "Chat message"
            }
            placeholder={
              activeType === "HIGHLIGHT"
                ? "What should the student look at on this stage?"
                : "Type a message... (Shift+Enter for newline)"
            }
            className="w-full min-h-[44px] max-h-36 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none leading-relaxed"
          />
        </div>
        <Button
          type="submit"
          disabled={sending || !content.trim()}
          className="shrink-0 h-[44px]"
        >
          {sending ? "Sending..." : "Send"}
        </Button>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
        <span>
          Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Shift+Enter</kbd> for newline
        </span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </form>
  );
}
