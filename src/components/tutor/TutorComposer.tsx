"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type TutorComposerProps = {
  sessionId: string;
  defaultType?: "TEXT" | "HIGHLIGHT";
  defaultStageId?: string | null;
};

export function TutorComposer({
  sessionId,
  defaultType = "TEXT",
  defaultStageId = null,
}: TutorComposerProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [type, setType] = useState<"TEXT" | "HIGHLIGHT">(defaultType);
  const [stageId, setStageId] = useState<string>(defaultStageId ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/tutor/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          content: trimmed,
          type,
          stageId: type === "HIGHLIGHT" ? stageId || null : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setContent("");
      setType("TEXT");
      setStageId("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="p-4 border-t border-border space-y-2">
      {type === "HIGHLIGHT" && (
        <input
          type="text"
          value={stageId}
          onChange={(e) => setStageId(e.target.value)}
          placeholder="Stage ID to highlight (e.g. stage-abc123)"
          className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === "HIGHLIGHT"
              ? "Describe what to highlight on that stage..."
              : "Type a message..."
          }
          className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button type="submit" disabled={sending || !content.trim()}>
          {sending ? "Sending..." : "Send"}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </form>
  );
}
