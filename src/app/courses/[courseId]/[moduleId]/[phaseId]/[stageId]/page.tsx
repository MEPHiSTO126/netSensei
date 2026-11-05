import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, Image as ImageIcon, BarChart3, Play } from "lucide-react";
import { TutorRequestButton } from "@/components/tutor/TutorRequestButton";
import { StageContent } from "@/components/course/StageContent";
import { getOnlineTutorCount } from "@/lib/presence";

export const dynamic = "force-dynamic";

const STAGE_ICONS: Record<string, React.ReactNode> = {
  TEXT: <FileText className="h-4 w-4" />,
  IMAGE: <ImageIcon className="h-4 w-4" />,
  CHART: <BarChart3 className="h-4 w-4" />,
};

export default async function StagePage({
  params,
}: {
  params: Promise<{
    courseId: string;
    moduleId: string;
    phaseId: string;
    stageId: string;
  }>;
}) {
  const { courseId, moduleId, phaseId, stageId } = await params;

  const stage = await db.stage.findUnique({
    where: { id: stageId },
    include: {
      phase: {
        include: {
          module: {
            include: { course: true },
          },
          quiz: true,
          stages: {
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!stage) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Stage not found</h1>
        <Link href="/courses" className="mt-4 text-primary hover:underline">
          Browse courses
        </Link>
      </div>
    );
  }

  const currentIndex = stage.phase.stages.findIndex((s) => s.id === stageId);
  const prevStage =
    currentIndex > 0 ? stage.phase.stages[currentIndex - 1] : null;
  const nextStage =
    currentIndex < stage.phase.stages.length - 1
      ? stage.phase.stages[currentIndex + 1]
      : null;

  const canTakeQuiz = !!stage.phase.quiz;
  const user = await getCurrentUser();
  const isTutor = user?.role === "TUTOR";
  const onlineTutorCount = isTutor ? 0 : await getOnlineTutorCount();

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb chip trail ───────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 flex-wrap rounded-lg bg-muted/50 px-4 py-2.5 text-sm"
      >
        <Link
          href={`/courses/${courseId}`}
          className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[140px]"
        >
          {stage.phase.module.course.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <Link
          href={`/courses/${courseId}#module-${moduleId}`}
          className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[140px]"
        >
          {stage.phase.module.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <Link
          href={`/courses/${courseId}/${moduleId}/${phaseId}`}
          className="text-muted-foreground hover:text-primary transition-colors truncate max-w-[140px]"
        >
          {stage.phase.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <span className="font-semibold text-heading truncate max-w-[180px]">
          {stage.title}
        </span>
      </nav>

      {/* ── Mobile stage quick switcher (< lg) ───────────── */}
      <div className="lg:hidden">
        <details className="group rounded-xl border border-border bg-card p-3 shadow-sm">
          <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-semibold text-heading">
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                {currentIndex + 1}
              </span>
              <span className="truncate">Stage {currentIndex + 1} of {stage.phase.stages.length}: {stage.title}</span>
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90 shrink-0 ml-2" />
          </summary>
          <div className="mt-3 pt-3 border-t border-border space-y-1">
            {stage.phase.stages.map((s, idx) => {
              const isActive = s.id === stageId;
              return (
                <Link
                  key={s.id}
                  href={`/courses/${courseId}/${moduleId}/${phaseId}/${s.id}`}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-heading"
                  }`}
                >
                  <span className="truncate">{idx + 1}. {s.title}</span>
                  {isActive && <Badge variant="secondary" className="text-[9px] py-0 px-1 ml-2">Current</Badge>}
                </Link>
              );
            })}
            {stage.phase.quiz && (
              <Link
                href={`/courses/${courseId}/${moduleId}/${phaseId}/quiz`}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-primary font-medium hover:bg-primary/10 transition-colors mt-2 border-t border-border/50 pt-2"
              >
                <span className="flex items-center gap-1.5">
                  <Play className="h-3 w-3" /> Phase Quiz
                </span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </details>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Timeline sidebar (left on desktop, below content on mobile) ── */}
        <aside className="order-2 lg:order-1 lg:w-1/4 space-y-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Stages in {stage.phase.title}
          </h2>
          <div className="relative space-y-1">
            {/* vertical progress line */}
            <div className="absolute left-[17px] top-3 bottom-3 w-px bg-border pointer-events-none" />

            {stage.phase.stages.map((s) => {
              const isActive = s.id === stageId;
              return (
                <Link
                  key={s.id}
                  href={`/courses/${courseId}/${moduleId}/${phaseId}/${s.id}`}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  {/* icon container */}
                  <span
                    className={`relative z-10 w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {STAGE_ICONS[s.type] ?? <FileText className="h-3.5 w-3.5" />}
                  </span>
                  <span className={`font-medium truncate ${isActive ? "text-primary" : ""}`}>
                    {s.title}
                  </span>
                  {isActive && (
                    <ChevronRight className="h-3.5 w-3.5 ml-auto shrink-0 text-primary/60" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* quiz card */}
          {stage.phase.quiz && (
            <div className="relative rounded-xl border border-primary/20 bg-card overflow-hidden shadow-sm">
              {/* accent bar */}
              <div className="h-0.5 w-full bg-primary/30" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                    <Play className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="font-semibold text-sm text-heading">
                    Phase Quiz
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Complete this phase and test your knowledge
                </p>
                {canTakeQuiz ? (
                  <Link
                    href={`/courses/${courseId}/${moduleId}/${phaseId}/quiz`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    {isTutor ? "Preview quiz" : "Take quiz"}{" "}
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    Finish stages first <ChevronRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* ── Content card (renders top on mobile, right on desktop) ─── */}
        <Card className="order-1 lg:order-2 lg:w-3/4 overflow-hidden relative transition-all duration-200 hover:shadow-md">
          {/* accent bar */}
          <div className="h-1 w-full bg-primary/20" />

          <div className="p-6 md:p-8">
            {/* title + badge */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold text-heading">{stage.title}</h1>
              <Badge variant="outline" className="text-xs shrink-0 ml-4">
                Stage {stage.order}
              </Badge>
            </div>

            {/* content */}
            <div id={`stage-${stage.id}`} className="max-w-none">
              <StageContent
                type={stage.type}
                content={stage.content}
                imageUrl={stage.imageUrl}
              />
            </div>

            {!isTutor && (
              <TutorRequestButton
                stageId={stage.id}
                stageTitle={stage.title}
                onlineTutorCount={onlineTutorCount}
              />
            )}

            {/* ── Card-based prev/next navigation ────────────── */}
            <div className="mt-10 pt-6 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                {prevStage ? (
                  <Link
                    href={`/courses/${courseId}/${moduleId}/${phaseId}/${prevStage.id}`}
                    className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ChevronRight className="h-3 w-3 rotate-180" />
                      Previous
                    </span>
                    <span className="text-sm font-semibold text-heading group-hover:text-primary transition-colors truncate">
                      {prevStage.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {nextStage ? (
                  <Link
                    href={`/courses/${courseId}/${moduleId}/${phaseId}/${nextStage.id}`}
                    className="group flex flex-col items-end gap-1 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 text-right"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Next
                      <ChevronRight className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-semibold text-heading group-hover:text-primary transition-colors truncate">
                      {nextStage.title}
                    </span>
                  </Link>
                ) : canTakeQuiz ? (
                  <Link
                    href={`/courses/${courseId}/${moduleId}/${phaseId}/quiz`}
                    className="group flex flex-col items-end gap-1 rounded-xl border border-primary/40 bg-primary/[0.04] p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary text-right"
                  >
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      {isTutor ? "Preview Quiz" : "Phase Complete"}
                      <ChevronRight className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-bold text-heading group-hover:text-primary transition-colors truncate">
                      Take Phase Quiz →
                    </span>
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${courseId}/${moduleId}/${phaseId}`}
                    className="group flex flex-col items-end gap-1 rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30 text-right"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Phase Complete
                      <ChevronRight className="h-3 w-3" />
                    </span>
                    <span className="text-sm font-semibold text-heading group-hover:text-primary transition-colors truncate">
                      Phase Overview →
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


