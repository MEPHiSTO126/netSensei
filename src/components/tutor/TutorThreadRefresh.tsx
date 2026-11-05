"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Refreshes the server-rendered chat thread so both sides see new messages
 * without manually reloading the page. Polls instead of sockets (free tier),
 * but keeps the interval reasonable so each refresh (a full server render with
 * its own DB queries) does not compete with typing.
 */
export function TutorThreadRefresh({ intervalMs = 10000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [router, intervalMs]);

  return null;
}
