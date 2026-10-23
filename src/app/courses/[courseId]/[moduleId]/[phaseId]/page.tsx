import { db } from "@/lib/db";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Play, FileText, Image as ImageIcon, BarChart3 } from "lucide-react";

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
      quiz: true,
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

  const allPhases = await db.phase.findMany({
    where: { moduleId },
    select: { id: true, title: true, order: true },
    orderBy: { order: "asc" },
  });

  const currentIndex = allPhases.findIndex((p) => p.id === phaseId);
  const prevPhase = currentIndex > 0 ? allPhases[currentIndex - 1] : null;
  const nextPhase = currentIndex < allPhases.length - 1 ? allPhases[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      <nav className="flex flex-col md:flex-row gap-4 mb-4">
        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          ← Back to {phase.module.course.title}
        </Link>
        <Link
          href={`/courses/${courseId}/${moduleId}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          {phase.module.title}
        </Link>
        <span className="text-sm font-medium text-heading">{phase.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Stages
          </h2>
          <div className="space-y-2">
            {phase.stages.map((stage) => (
              <Link
                key={stage.id}
                href={`/courses/${courseId}/${moduleId}/${phaseId}/${stage.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  // simple highlight: always same style, no active state tracking yet
                  "hover:bg-muted"
                }`}
              >
                {STAGE_ICONS[stage.type] ?? <FileText className="h-4 w-4" />}
                <span className="font-medium">{stage.title}</span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
          {phase.quiz && (
            <Card className="border-dashed">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm text-heading">
                    Phase Quiz
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Test your knowledge after this phase
                </p>
                <Link
                  href={`/courses/${courseId}/${moduleId}/${phaseId}/quiz`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  Take quiz <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:w-3/4">
          <h1 className="text-2xl font-bold text-heading mb-2">{phase.title}</h1>
          {phase.description && (
            <p className="text-muted-foreground mb-6">{phase.description}</p>
          )}

          {phase.stages.map((stage) => (
            <Card key={stage.id} className="mb-4">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Stage {stage.order}
                  </span>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {stage.type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-heading mb-2">
                  {stage.title}
                </h3>
                <div id={`stage-${stage.id}`} className="stage-content">
                  {/* Content rendered by client component based on type */}
                  <StageRenderer
                    type={stage.type}
                    content={stage.content}
                    imageUrl={stage.imageUrl}
                  />
                </div>
              </div>
            </Card>
          ))}

          <div className="mt-8 flex justify-between">
            {prevPhase && (
              <Link
                href={`/courses/${courseId}/${moduleId}/${prevPhase.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ChevronRight className="h-4 w-4 rotate-180" /> {prevPhase.title}
              </Link>
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
      </div>
    </div>
  );
}

function StageRenderer({
  type,
  content,
  imageUrl,
}: {
  type: string;
  content: string;
  imageUrl: string | null;
}) {
  switch (type) {
    case "IMAGE":
      return (
        <div className="mt-4 flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={content}
              className="max-w-full h-auto rounded-lg border border-border"
            />
          ) : (
            <div className="h-48 w-full rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
              No image available
            </div>
          )}
        </div>
      );
    case "CHART":
      return (
        <div className="mt-4 bg-muted rounded-lg p-4 flex items-center justify-center text-muted-foreground text-sm">
          Chart visualization would render here
        </div>
      );
    default:
      return (
        <div className="mt-4 text-sm leading-relaxed text-foreground">
          {content}
        </div>
      );
  }
}
