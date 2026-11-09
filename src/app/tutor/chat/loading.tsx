function Bar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-4 animate-pulse rounded-md bg-muted ${className}`}
      aria-hidden="true"
    />
  );
}

export default function TutorChatLoading() {
  return (
    <div
      className="mx-auto flex h-[calc(100dvh-11rem)] min-h-[480px] max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card"
      aria-busy="true"
      aria-label="Loading chat"
    >
      <div className="flex items-center gap-3 border-b border-border p-5">
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <Bar className="h-4 w-40" />
          <Bar className="h-3 w-24" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded-md bg-muted" />
      </div>
      <div className="flex-1 space-y-4 p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`max-w-[70%] rounded-xl bg-muted p-5 ${
              i % 2 ? "ml-auto" : ""
            }`}
          >
            <Bar className="mb-2 h-3 w-16" />
            <Bar className="h-4 w-48" />
            <Bar className="mt-1 h-4 w-36" />
          </div>
        ))}
      </div>
      <div className="border-t border-border p-5">
        <Bar className="h-12 w-full" />
      </div>
    </div>
  );
}
