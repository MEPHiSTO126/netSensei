"use client";

import { useEffect, useRef } from "react";

export function ChatScrollAnchor({ messageCount }: { messageCount: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  return <div ref={ref} className="h-0 w-0" aria-hidden="true" />;
}
