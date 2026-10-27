import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Clock, MessageSquare, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { sessionId } = await params;

  const session = await db.tutorSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        include: { sender: { select: { id: true, email: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      student: { select: { id: true, email: true } },
      tutor: { select: { id: true, email: true } },
    },
  });

  if (!session || (session.studentId !== user.id && session.tutorId !== user.id)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Session not found</h1>
        <p className="mb-4 text-muted-foreground">
          You don&apos;t have access to this session.
        </p>
        <Link href="/sessions" className="text-primary hover:underline">
          Back to sessions
        </Link>
      </div>
    );
  }

  const highlightStageIds = Array.from(
    new Set(
      session.messages
        .filter((m) => m.type === "HIGHLIGHT" && m.stageId)
        .map((m) => m.stageId as string),
    ),
  );
  const highlightedStages = highlightStageIds.length
    ? await db.stage.findMany({
        where: { id: { in: highlightStageIds } },
        select: {
          id: true,
          title: true,
          phaseId: true,
          phase: {
            select: {
              moduleId: true,
              module: { select: { courseId: true } },
            },
          },
        },
      })
    : [];
  const stageMap = new Map(highlightedStages.map((s) => [s.id, s]));
  const active = session.status === "ACTIVE";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/sessions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        All sessions
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Session record</h1>
          <p className="text-muted-foreground">
            {session.student.email} with{" "}
            {session.tutor?.email ?? "an unassigned tutor"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={active ? "default" : "outline"}>
            {active ? "Active" : "Ended"}
          </Badge>
          <Badge variant="secondary">
            {session.mode === "LIVE" ? "Live session" : "Recorded"}
          </Badge>
          {active && (
            <Link
              href={`/tutor/chat?sessionId=${session.id}`}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue chat
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{session.student.email}</span>
            </div>
            <p className="text-xs text-muted-foreground">Student</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {session.tutor?.email ?? "No tutor assigned"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Tutor</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {new Date(session.createdAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Started</p>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {session.messages.length} message
                {session.messages.length !== 1 ? "s" : ""}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {session.endedAt
                ? `Ended ${new Date(session.endedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}`
                : "Recording in progress"}
            </p>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {session.messages.length === 0 ? (
          <Card>
            <p className="px-6 py-12 text-center text-sm text-muted-foreground">
              No messages in this session yet.
            </p>
          </Card>
        ) : (
          session.messages.map((m) => {
            const highlighted =
              m.type === "HIGHLIGHT" && m.stageId
                ? stageMap.get(m.stageId)
                : undefined;

            return (
              <Card key={m.id} className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    {m.sender.email}
                  </span>
                  <Badge variant="outline">
                    {m.sender.role === "TUTOR" ? "Tutor" : "Student"}
                  </Badge>
                  {m.type === "HIGHLIGHT" && (
                    <Badge variant="secondary">Stage highlight</Badge>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-foreground">
                  {m.content}
                </p>
                {highlighted && (
                  <Link
                    href={`/courses/${highlighted.phase.module.courseId}/${highlighted.phase.moduleId}/${highlighted.phaseId}/${highlighted.id}`}
                    className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-2"
                  >
                    Open {highlighted.title}
                  </Link>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
