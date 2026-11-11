import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-3 rounded-xl border border-border p-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
