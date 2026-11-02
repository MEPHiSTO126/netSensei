import { requireTutorPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { TutorSidebar } from "@/components/tutor/TutorSidebar";
import { TutorPresence } from "@/components/tutor/TutorPresence";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export default async function TutorDeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireTutorPage();

  const pendingCount = await db.tutorRequest.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="min-h-[calc(100dvh-4rem)] overflow-hidden rounded-xl border border-border bg-card shadow-sm md:grid md:grid-cols-[220px_minmax(0,1fr)]">
      <TutorPresence />
      <TutorSidebar email={user.email} pendingCount={pendingCount} />

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-6">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            Online for students
          </span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <ThemeToggle />
          </div>
        </div>

        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}
