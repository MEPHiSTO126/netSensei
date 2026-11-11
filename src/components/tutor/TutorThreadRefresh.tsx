"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Refreshes the server-rendered chat thread so both sides see new messages
 * without manually reloading the page. Polls instead of sockets (free tier),
 * but each refresh is a full server render with its own database queries, so
 * the interval is generous and the poll pauses while the tab is hidden or the
 * tutor is typing.
 */
const COMPOSING_EVENT = "netsensei:composing";

export function TutorThreadRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    let composing = false;

    const onComposing = (event: Event) => {
      composing = (event as CustomEvent<{ active: boolean }>).detail.active;
    };

    const id = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      if (composing) return;
      router.refresh();
    }, intervalMs);

    window.addEventListener(COMPOSING_EVENT, onComposing);

    return () => {
      clearInterval(id);
      window.removeEventListener(COMPOSING_EVENT, onComposing);
    };
  }, [router, intervalMs]);

  return null;
}
