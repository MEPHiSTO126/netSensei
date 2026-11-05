import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getCourseProgress } from "@/lib/progress";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProgressPage({
  searchParams,
}: {
  searchParams?: Promise<{ courseId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Sign in required</h1>
        <p className="text-muted-foreground mb-4">Please sign in to view your progress.</p>
      </div>
    );
  }

  if (user.role === "TUTOR") {
    redirect("/tutor/students");
  }

  const { courseId: queryCourseId } = (await searchParams) ?? {};

  const courses = await db.course.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
  });

  const activeCourse =
    courses.find((c) => c.id === queryCourseId) ?? courses[0] ?? null;
  const courseId = activeCourse?.id ?? "course-frontend-v1";
  const courseTitle = activeCourse?.title ?? "Course";
  const progress = await getCourseProgress(user.id, courseId);

  const progressRecords = await db.progressRecord.findMany({
    where: { studentId: user.id },
    include: {
      phase: {
        include: {
          module: {
            include: { course: true },
          },
        },
      },
    },
    orderBy: { completedAt: "desc" },
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Your Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>
        {courses.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {courses.map((c) => {
              const isSelected = c.id === courseId;
              return (
                <Link
                  key={c.id}
                  href={`/progress?courseId=${c.id}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-heading"
                  }`}
                >
                  {c.title}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground truncate max-w-[160px]">
                  {courseTitle} Completion
                </p>
                <div className="text-3xl font-bold text-heading mt-1">
                  {progress.percentage}%
                </div>
              </div>
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted/60"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary transition-all duration-500 ease-out"
                    strokeDasharray={`${progress.percentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <BarChart3 className="absolute h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              {progress.passedPhases} of {progress.totalPhases} phases completed
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Phases Attempted</p>
                <div className="text-3xl font-bold text-heading mt-1">
                  {progressRecords.length}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center shrink-0">
                <Clock className="h-7 w-7 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Total quiz submissions across courses
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Phases Passed</p>
                <div className="text-3xl font-bold text-heading mt-1">
                  {progress.passedPhases}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-7 w-7 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Mastered phases in current course
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-heading">Phase History</h2>
          <span className="text-xs text-muted-foreground">Click any item to review</span>
        </div>
        {progressRecords.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                No quiz attempts yet. Start learning to track your progress!
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {progressRecords.map((r) => (
              <Link
                key={r.id}
                href={`/courses/${r.phase.module.course.id}/${r.phase.module.id}/${r.phase.id}`}
                className="block group"
              >
                <Card className="p-4 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {r.phase.title}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate">
                        {r.phase.module.title} &gt; {r.phase.module.course.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-bold text-heading">
                          {r.score}%
                        </div>
                        <Badge
                          variant={r.passed ? "default" : "outline"}
                          className="text-[10px]"
                        >
                          {r.passed ? "Passed" : "Not passed"}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          Attempt {r.attemptNumber}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
