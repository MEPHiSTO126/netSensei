import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Play, Eye } from "lucide-react";

export default async function CoursesPage() {
  const user = await getCurrentUser();
  const isTutor = user?.role === "TUTOR";
  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        include: {
          phases: true,
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">Courses</h1>
          <p className="text-muted-foreground">
            {isTutor
              ? "Review the curriculum students work through. Preview only."
              : "Browse available courses and start learning"}
          </p>
        </div>
        {!user && (
          <Button asChild size="sm">
            <Link href="/login" className="gap-2">
              Sign in to track progress
            </Link>
          </Button>
        )}
      </div>

      {isTutor && (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-4">
          <Eye className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            You are previewing the course as a tutor. Enrollment, progress, and
            quizzes are student-only.
          </p>
        </div>
      )}

      {courses.length === 0 ? (
        <Card className="border-dashed">
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No courses available yet.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const phaseCount = course.modules.reduce(
              (sum, module) => sum + module.phases.length,
              0,
            );

            return (
            <Card
              key={course.id}
              className="group hover:border-primary/50 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-heading uppercase tracking-wider">
                    Course
                  </span>
                </div>
                <h2 className="text-xl font-bold text-heading mb-2">{course.title}</h2>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Users className="h-3 w-3" />
                  <span>
                    {course.modules.length} module{course.modules.length !== 1 ? "s" : ""}
                  </span>
                  <span className="mx-1">•</span>
                  <span>
                    {phaseCount} phase{phaseCount !== 1 ? "s" : ""}
                  </span>
                </div>
                <Button asChild size="sm" className="w-fit gap-2">
                  <Link href={`/courses/${course.id}`}>
                    {isTutor ? (
                      <>
                        <Eye className="h-4 w-4" /> Preview course
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" /> Start learning
                      </>
                    )}
                  </Link>
                </Button>
              </div>
            </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
