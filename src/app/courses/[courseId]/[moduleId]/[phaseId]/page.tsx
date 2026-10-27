import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Image as ImageIcon,
  Play,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STAGE_ICONS: Record<string, React.ReactNode> = {
  TEXT: <FileText className="h-4 w-4" />,
  IMAGE: <ImageIcon className="h-4 w-4" />,
  CHART: <BarChart3 className="h-4 w-4" />,
};

export default async function PhasePage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; phaseId: string }>;
}) {
  const { courseId, moduleId, phaseId } = await params;

  const phase = await db.phase.findUnique({
    where: { id: phaseId },
    include: {
      module: {
        include: {
          course: true,
        },
      },
      stages: {
        orderBy: { order: "asc" },
      },
      quiz: {
        include: {
          questions: { select: { id: true } },
        },
      },
    },
  });

  if (!phase) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Phase not found</h1>
        <Link href="/courses" className="mt-4 text-primary hover:underline">
          Browse courses
        </Link>
      </div>
    );
  }

  const user = await getCurrentUser();
  const progress = user
    ? await db.progressRecord.findFirst({
        where: { studentId: user.id, courseId, phaseId },
        orderBy: { attemptNumber: "desc" },
      })
    : null;

  const allPhases = await db.phase.findMany({
    where: { moduleId },
    select: { id: true, title: true, order: true },
    orderBy: { order: "asc" },
  });

  const currentIndex = allPhases.findIndex((p) => p.id === phaseId);
  const prevPhase = currentIndex > 0 ? allPhases[currentIndex - 1] : null;
  const nextPhase =
    currentIndex < allPhases.length - 1 ? allPhases[currentIndex + 1] : null;

  const firstStage = phase.stages[0];
  const startHref = firstStage
    ? `/courses/${courseId}/${moduleId}/${phaseId}/${firstStage.id}`
    : phase.quiz
      ? `/courses/${courseId}/${moduleId}/${phaseId}/quiz`
      : null;
  const ctaLabel = progress?.passed
    ? "Review phase"
    : progress
      ? "Continue phase"
      : "Start phase";

  return (
    <div className="space-y-8">
      <nav className="flex flex-col gap-3 text-sm md:flex-row md:items-center">
        <Link
          href={`/courses/${courseId}`}
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          ← {phase.module.course.title}
        </Link>
        <Link
          href={`/courses/${courseId}/${moduleId}`}
          className="text-muted-foreground hover:text-primary hover:underline"
        >
          {phase.module.title}
        </Link>
        <span className="font-medium text-heading">{phase.title}</span>
      </nav>

      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Module {phase.module.order} · Phase {phase.order}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-heading">
            {phase.title}
          </h1>
          {phase.description && (
            <p className="mt-3 text-muted-foreground">{phase.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>
              {phase.stages.length} stage{phase.stages.length !== 1 ? "s" : ""}
            </span>
            {phase.quiz && (
              <span>
                {phase.quiz.questions.length} quiz question
                {phase.quiz.questions.length !== 1 ? "s" : ""}
              </span>
            )}
            {progress && <span>Attempt {progress.attemptNumber}</span>}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3">
          {progress?.passed ? (
            <Badge className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Passed · {progress.score}%
            </Badge>
          ) : progress ? (
            <Badge variant="outline" className="gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              Not passed · {progress.score}%
            </Badge>
          ) : (
            <Badge variant="secondary">Not started</Badge>
          )}
          {startHref && (
            <Link
              href={startHref}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Play className="h-4 w-4" /> {ctaLabel}
            </Link>
          )}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Stages
        </h2>
        {phase.stages.map((stage) => (
          <Link
            key={stage.id}
            href={`/courses/${courseId}/${moduleId}/${phaseId}/${stage.id}`}
            className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
              {STAGE_ICONS[stage.type] ?? <FileText className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Stage {stage.order}
                </span>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {stage.type}
                </Badge>
              </div>
              <h3 className="mt-1 font-medium text-heading group-hover:text-primary">
                {stage.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {stageExcerpt(stage.content, stage.type)}
              </p>
            </div>
            <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
          </Link>
        ))}
      </section>

      {phase.quiz && (
        <Card className="border-dashed">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <Play className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-heading">Phase quiz</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {phase.quiz.questions.length} question
                {phase.quiz.questions.length !== 1 ? "s" : ""} ·{" "}
                {phase.quiz.passThreshold}% to pass
                {progress ? ` · Best ${progress.score}%` : ""}
              </p>
            </div>
            <Link
              href={`/courses/${courseId}/${moduleId}/${phaseId}/quiz`}
              className="inline-flex w-fit items-center gap-1.5 rounded-md border border-input px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              {progress ? "Retake quiz" : "Take quiz"}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </Card>
      )}

      <div className="flex justify-between border-t border-border pt-6">
        {prevPhase ? (
          <Link
            href={`/courses/${courseId}/${moduleId}/${prevPhase.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ChevronRight className="h-4 w-4 rotate-180" /> {prevPhase.title}
          </Link>
        ) : (
          <span />
        )}
        {nextPhase && (
          <Link
            href={`/courses/${courseId}/${moduleId}/${nextPhase.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            {nextPhase.title} <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
}

function stageExcerpt(content: string, type: string) {
  if (type === "CHART") {
    const steps = content
      .split("→")
      .map((step) => step.trim())
      .filter(Boolean);
    const shown = steps.slice(0, 4).join(" → ");
    return steps.length > 4 ? `${shown} → …` : shown;
  }

  const plain = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return "Illustration for this stage.";

  const sentence = plain.split(/(?<=[.!?])\s/)[0] ?? plain;
  return sentence.length > 170
    ? `${sentence.slice(0, 167).trimEnd()}…`
    : sentence;
}
