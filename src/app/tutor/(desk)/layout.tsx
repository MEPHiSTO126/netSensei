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
    <div className="h-screen flex bg-background">
      <TutorPresence />
      <TutorSidebar email={user.email} pendingCount={pendingCount} />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Online for students
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
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

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
