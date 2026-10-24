import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Sign in required</h1>
        <p className="text-muted-foreground mb-4">Please sign in to view your progress.</p>
      </div>
    );
  }

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

  const courseId = "course-frontend-v1";
  const allPhases = await db.phase.findMany({
    where: {
      module: { courseId },
    },
    include: {
      module: true,
    },
  });

  const totalPhases = allPhases.length;
  const passedPhases = progressRecords.filter((r) => r.passed).length;
  const percentage = totalPhases > 0 ? Math.round((passedPhases / totalPhases) * 100) : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-heading">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Course Completion</p>
                <div className="text-3xl font-bold text-heading">{percentage}%</div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {passedPhases} of {totalPhases} phases completed
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Quizzes Taken</p>
                <div className="text-3xl font-bold text-heading">
                  {progressRecords.length}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <div className="text-3xl font-bold text-heading">
                  {progressRecords.filter((r) => r.passed).length}
                </div>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-heading">Phase History</h2>
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
              <Card key={r.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{r.phase.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {r.phase.module.title} &gt; {r.phase.module.course.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-heading">
                      {r.score}%
                    </div>
                    <Badge
                      variant={r.passed ? "default" : "outline"}
                      className="text-xs"
                    >
                      {r.passed ? "Passed" : "Not passed"}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Attempt {r.attemptNumber}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
