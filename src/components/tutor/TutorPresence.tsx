"use client";

import { useEffect } from "react";

const HEARTBEAT_INTERVAL_MS = 45_000;

/**
 * Keeps a tutor marked online while a tutor page is open. The server also
 * expires stale presence, so a closed tab eventually goes offline even if the
 * final beacon is lost.
 *
 * The interval is deliberately slow: every beat is a database write, and the
 * server treats a tutor as offline once the heartbeat is a couple of minutes
 * old. Polling faster only cost writes.
 */
export function TutorPresence() {
  useEffect(() => {
    let disposed = false;

    async function ping() {
      if (disposed) return;
      try {
        const res = await fetch("/api/tutor/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ online: true }),
          keepalive: true,
        });

        // Signed out or no longer a tutor: stop writing to the database.
        if (res.status === 401 || res.status === 403) {
          disposed = true;
          window.clearInterval(interval);
        }
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
