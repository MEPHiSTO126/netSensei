"use client";

import { useEffect } from "react";

const HEARTBEAT_INTERVAL_MS = 25_000;

/**
 * Keeps a tutor marked online while a tutor page is open. The server also
 * expires stale presence, so a closed tab eventually goes offline even if the
 * final beacon is lost.
 */
export function TutorPresence() {
  useEffect(() => {
    let disposed = false;

    async function ping() {
      if (disposed) return;
      try {
        await fetch("/api/tutor/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ online: true }),
          keepalive: true,
        });
      } catch {
        // Presence is best-effort; the next heartbeat retries it.
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void ping();
      }
    }

    function handlePageHide() {
      const payload = JSON.stringify({ online: false });
      navigator.sendBeacon?.(
        "/api/tutor/heartbeat",
        new Blob([payload], { type: "application/json" }),
      );
    }

    void ping();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void ping();
      }
    }, HEARTBEAT_INTERVAL_MS);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      disposed = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}
