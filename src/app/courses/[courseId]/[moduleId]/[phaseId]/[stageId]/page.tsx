import { db } from "@/lib/db";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, Image as ImageIcon, BarChart3, Play } from "lucide-react";

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

  const canTakeQuiz =
    currentIndex === stage.phase.stages.length - 1 && !!stage.phase.quiz;

  return (
    <div className="space-y-6">
      <nav className="flex flex-col md:flex-row gap-4 mb-4">
        <Link
          href={`/courses/${courseId}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          ← {stage.phase.module.course.title}
        </Link>
        <Link
          href={`/courses/${courseId}/${moduleId}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          {stage.phase.module.title}
        </Link>
        <Link
          href={`/courses/${courseId}/${moduleId}/${phaseId}`}
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          {stage.phase.title}
        </Link>
        <span className="text-sm font-medium text-heading">{stage.title}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-1/4 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Stages in {stage.phase.title}
          </h2>
          <div className="space-y-2">
            {stage.phase.stages.map((s) => (
              <Link
                key={s.id}
                href={`/courses/${courseId}/${moduleId}/${phaseId}/${s.id}`}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  s.id === stageId
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                {STAGE_ICONS[s.type] ?? <FileText className="h-4 w-4" />}
                <span className="font-medium">{s.title}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
          {stage.phase.quiz && (
            <Card className="border-dashed">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm text-heading">
                    Phase Quiz
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete this phase and test your knowledge
                </p>
                {canTakeQuiz ? (
                  <Link
                    href={`/courses/${courseId}/${moduleId}/${phaseId}/quiz`}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    Take quiz <ChevronRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    Finish stages first <ChevronRight className="h-3 w-3" />
                  </span>
                )}
              </div>
            </Card>
          )}
        </aside>

        <div className="lg:w-3/4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-heading">{stage.title}</h1>
            <Badge variant="outline" className="text-xs">
              Stage {stage.order}
            </Badge>
          </div>
          <div id={`stage-${stage.id}`} className="prose prose-sm max-w-none">
            <StageContent
              type={stage.type}
              content={stage.content}
              imageUrl={stage.imageUrl}
            />
          </div>

          <div className="mt-10 flex justify-between items-center pt-6 border-t border-border">
            {prevStage && (
              <Link
                href={`/courses/${courseId}/${moduleId}/${phaseId}/${prevStage.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ChevronRight className="h-4 w-4 rotate-180" /> {prevStage.title}
              </Link>
            )}
            {nextStage && (
              <Link
                href={`/courses/${courseId}/${moduleId}/${phaseId}/${nextStage.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                {nextStage.title} <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StageContent({
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
              className="max-w-full h-auto rounded-lg border border-border shadow-sm"
            />
          ) : (
            <div className="h-64 w-full rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-sm">
              No image available for this stage
            </div>
          )}
        </div>
      );
    case "CHART":
      return <ChartDiagram content={content} />;
    default:
      return <RichText content={content} />;
  }
}

function parseContentBlocks(content: string) {
  const parts = content.split(/```(\w*)\n?([\s\S]*?)```/g);
  const blocks: Array<{ kind: "text" | "code"; text?: string; lang?: string; code?: string }> = [];
  for (let i = 0; i < parts.length; i += 3) {
    const text = parts[i];
    const lang = parts[i + 1];
    const code = parts[i + 2];
    if (text && text.trim()) blocks.push({ kind: "text", text: text.trim() });
    if (code && code.trim()) blocks.push({ kind: "code", lang: lang || "text", code });
  }
  return blocks;
}

function RichText({ content }: { content: string }) {
  const blocks = parseContentBlocks(content);
  return (
    <div className="mt-4 text-lg leading-relaxed text-foreground space-y-4">
      {blocks.map((block, idx) => {
        if (block.kind === "code") {
          return (
            <pre
              key={idx}
              className="overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed"
            >
              <code className="font-mono text-foreground whitespace-pre">{block.code}</code>
            </pre>
          );
        }
        const lines = (block.text || "").split("\n");
        const paragraphs: string[][] = [];
        let current: string[] = [];
        for (const line of lines) {
          if (!line.trim()) {
            if (current.length) {
              paragraphs.push(current);
              current = [];
            }
          } else {
            current.push(line);
          }
        }
        if (current.length) paragraphs.push(current);
        return (
          <div key={idx} className="space-y-2">
            {paragraphs.map((p, j) => (
              <p key={j} className="whitespace-pre-line">
                {p.join("\n")}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function ChartDiagram({ content }: { content: string }) {
  const steps = content
    .split("→")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.includes(":") ? s.split(":").slice(1).join(":").trim() : s));
  const cleaned = steps.filter(Boolean);
  if (cleaned.length < 2) {
    return (
      <div className="mt-4 bg-muted rounded-lg p-6 flex items-center justify-center text-muted-foreground text-sm">
        Chart visualization renders here
      </div>
    );
  }
  return (
    <div className="mt-4 bg-muted rounded-lg p-6">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {cleaned.map((step, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {idx > 0 && <span className="text-muted-foreground font-medium">→</span>}
            <span className="px-3 py-2 rounded-md bg-background border border-border text-sm font-medium text-foreground">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
