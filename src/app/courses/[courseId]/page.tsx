import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getCourseProgress } from "@/lib/progress";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, LayoutList, Play } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const user = await getCurrentUser();

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          phases: {
            include: {
              quiz: true,
              _count: { select: { stages: true } },
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Course not found</h1>
        <Link
          href="/courses"
          className="mt-4 text-primary hover:underline"
        >
          Browse courses
        </Link>
      </div>
    );
  }

  const totalPhases = course.modules.reduce(
    (sum, m) => sum + m.phases.length,
    0
  );
  const progress = await getCourseProgress(user?.id ?? null, courseId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-heading">{course.title}</h1>
          <p className="text-muted-foreground">{course.description}</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-md text-sm font-medium hover:bg-muted transition-colors"
        >
          <LayoutList className="h-4 w-4" /> Back to courses
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="text-2xl font-bold text-heading">{totalPhases}</div>
            <p className="text-sm text-muted-foreground">Total phases</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="text-2xl font-bold text-heading">
              {course.modules.length}
            </div>
            <p className="text-sm text-muted-foreground">Modules</p>
          </div>
        </Card>
        {user && (
          <Card>
            <div className="p-6">
            <div className="text-2xl font-bold text-heading">
              {progress.percentage}%
            </div>
            <p className="text-sm text-muted-foreground">
              {progress.passedPhases} of {progress.totalPhases} phases passed
            </p>
            </div>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {course.modules.map((module) => (
          <Card key={module.id}>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Module {module.order}
                </span>
                <h2 className="text-lg font-bold text-heading">{module.title}</h2>
              </div>
              {module.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {module.description}
                </p>
              )}
              <div className="space-y-2">
                {module.phases.map((phase) => {
                  const phaseProgress = progress.byPhase.get(phase.id);
                  return (
                    <Link
                      key={phase.id}
                      href={`/courses/${courseId}/${module.id}/${phase.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-md text-sm hover:bg-muted transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <Play className="h-3.5 w-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium">{phase.title}</span>
                        {phase._count.stages > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {phase._count.stages} stage
                            {phase._count.stages !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {phaseProgress?.passed && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Passed
                          </span>
                        )}
                        {phase.quiz && (
                          <Badge variant="outline" className="text-xs">
                            Quiz
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
