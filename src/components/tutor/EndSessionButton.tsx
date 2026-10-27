"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function EndSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [ending, setEnding] = useState(false);
  const [error, setError] = useState("");

  async function endSession() {
    setEnding(true);
    setError("");
    try {
      const res = await fetch(`/api/tutor/sessions/${sessionId}/end`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Could not end the session");
      }
      router.push(`/sessions/${sessionId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not end the session");
      setEnding(false);
    }
  }

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setConfirming(true)}
      >
        End session
      </Button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">End this session?</span>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={endSession}
          disabled={ending}
        >
          {ending ? "Ending..." : "End"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={ending}
        >
          Cancel
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
