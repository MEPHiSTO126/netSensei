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
    <div className="flex h-dvh flex-col overflow-hidden bg-background md:flex-row">
      <TutorPresence />
      <TutorSidebar email={user.email} pendingCount={pendingCount} />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <a
          href="#tutor-desk-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>

        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Online for students
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <ThemeToggle />
          </div>
        </header>

        <main
          id="tutor-desk-content"
          className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6 lg:p-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
