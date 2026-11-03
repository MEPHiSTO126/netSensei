function Bar({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-4 animate-pulse rounded-md bg-muted ${className}`}
      aria-hidden="true"
    />
  );
}

export default function TutorDeskLoading() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading tutor desk"
    >
      <div>
        <Bar className="h-7 w-36" />
        <Bar className="mt-2 h-4 w-72 max-w-full" />
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-4">
            <Bar className="h-3 w-16" />
            <Bar className="mt-2 h-7 w-12" />
            <Bar className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-4 space-y-3"
        >
          <Bar className="h-4 w-28" />
          <Bar className="h-16 w-full" />
          <Bar className="h-16 w-full" />
          <Bar className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}
