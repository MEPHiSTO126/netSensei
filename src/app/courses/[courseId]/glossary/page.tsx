import { db } from "@/lib/db";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InlineText } from "@/components/course/InlineText";
import { glossaryByModule } from "@/data/glossary";

export const dynamic = "force-dynamic";

/**
 * Every term the course explains the first time a learner meets it, with a
 * link back to the stage that introduces it.
 */
export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: {
          phases: {
            orderBy: { order: "asc" },
            include: {
              stages: {
                orderBy: { order: "asc" },
                select: { id: true, title: true, phaseId: true },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Course not found</h1>
        <Link href="/courses" className="mt-4 text-primary hover:underline">
          Browse courses
        </Link>
      </div>
    );
  }

  const moduleOrder = new Map(
    course.modules.map((module) => [module.title, module.order]),
  );

  // module title → stage title → the link to that stage
  const stageLinks = new Map<
    string,
    Map<string, { href: string; phaseId: string }>
  >();
  for (const courseModule of course.modules) {
    const stages = new Map<
      string,
      { href: string; phaseId: string }
    >();
    for (const phase of courseModule.phases) {
      for (const stage of phase.stages) {
        stages.set(stage.title, {
          href: `/courses/${courseId}/${courseModule.id}/${phase.id}/${stage.id}`,
          phaseId: phase.id,
        });
      }
    }
    stageLinks.set(courseModule.title, stages);
  }

  const groups = glossaryByModule(moduleOrder);
  const total = groups.reduce((sum, group) => sum + group.entries.length, 0);

  return (
    <div className="space-y-8">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 flex-wrap rounded-lg bg-muted/50 px-4 py-2.5 text-sm"
      >
        <Link
          href={`/courses/${courseId}`}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          {course.title}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
        <span className="font-semibold text-heading">Glossary</span>
      </nav>

      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {total} terms
        </p>
        <h1 className="mt-2 text-3xl font-bold text-heading">Glossary</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Terms this course uses before it explains them. Each one is marked
          with a small bubble the first time you meet it in a stage, and the
          bubble holds the same explanation you see here.
        </p>
      </header>

      {groups.map((group) => {
        const stages = stageLinks.get(group.module);
        return (
          <section key={group.module} className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              {group.module}
            </h2>
            <Card>
              <ul className="divide-y divide-border">
                {group.entries.map((entry) => {
                  const link = stages?.get(entry.stage);
                  return (
                    <li
                      key={`${entry.module}-${entry.term}`}
                      className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-baseline sm:gap-4"
                    >
                      <code className="shrink-0 font-mono text-sm font-semibold text-primary sm:w-56">
                        {entry.term}
                      </code>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">
                          <InlineText text={entry.explanation} />
                        </p>
                        {link && (
                          <Link
                            href={link.href}
                            className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                          >
                            Introduced in
                            <span className="font-medium">{entry.stage}</span>
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          </section>
        );
      })}

      {groups.length === 0 && (
        <Card className="flex items-center gap-3 border-dashed p-6">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No glossary entries for this course yet.
          </p>
        </Card>
      )}
    </div>
  );
}
