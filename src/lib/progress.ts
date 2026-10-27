import { db } from "@/lib/db";

export type PhaseProgress = {
  passed: boolean;
  score: number;
  attemptNumber: number;
};

export type CourseProgress = {
  totalPhases: number;
  passedPhases: number;
  percentage: number;
  byPhase: Map<string, PhaseProgress>;
};

export async function getCourseProgress(
  studentId: string | null,
  courseId: string,
): Promise<CourseProgress> {
  const phases = await db.phase.findMany({
    where: { module: { courseId } },
    select: { id: true },
  });
  const totalPhases = phases.length;

  if (!studentId || totalPhases === 0) {
    return {
      totalPhases,
      passedPhases: 0,
      percentage: 0,
      byPhase: new Map(),
    };
  }

  const records = await db.progressRecord.findMany({
    where: { studentId, courseId },
    select: {
      phaseId: true,
      passed: true,
      score: true,
      attemptNumber: true,
    },
  });

  const byPhase = new Map<string, PhaseProgress>();
  for (const record of records) {
    const previous = byPhase.get(record.phaseId);
    byPhase.set(record.phaseId, {
      passed: (previous?.passed ?? false) || record.passed,
      score: Math.max(previous?.score ?? 0, record.score),
      attemptNumber: Math.max(
        previous?.attemptNumber ?? 0,
        record.attemptNumber,
      ),
    });
  }

  let passedPhases = 0;
  for (const phase of phases) {
    if (byPhase.get(phase.id)?.passed) passedPhases += 1;
  }

  return {
    totalPhases,
    passedPhases,
    percentage:
      totalPhases > 0
        ? Math.round((passedPhases / totalPhases) * 100)
        : 0,
    byPhase,
  };
}
