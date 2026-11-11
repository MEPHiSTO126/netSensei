import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-xl border border-border p-6">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-9 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
