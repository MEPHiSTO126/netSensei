import Link from "next/link";
import { BookOpen, Eye } from "lucide-react";
import { requireTutorPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TutorCoursesPage() {
  await requireTutorPage();

  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: {
      modules: {
        include: {
          _count: { select: { phases: true } },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Course preview</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Read the same modules, phases, and quizzes students work through.
          Preview only — tutors do not enroll or take quizzes.
        </p>
      </div>

      {courses.length === 0 ? (
        <Card>
          <p className="px-6 py-12 text-center text-sm text-muted-foreground">
            No published courses yet.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const phaseCount = course.modules.reduce(
              (sum, module) => sum + module._count.phases,
              0,
            );

            return (
              <Card key={course.id}>
                <div className="flex h-full flex-col p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Course
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-heading">
                    {course.title}
                  </h2>
                  <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                    {course.description}
                  </p>

                  <p className="mt-3 text-xs text-muted-foreground">
                    {course.modules.length} module
                    {course.modules.length === 1 ? "" : "s"} · {phaseCount}{" "}
                    phase{phaseCount === 1 ? "" : "s"}
                  </p>

                  <Link
                    href={`/courses/${course.id}`}
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Eye className="h-4 w-4" />
                    Preview course
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
