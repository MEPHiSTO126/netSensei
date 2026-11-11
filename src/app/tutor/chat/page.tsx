import type { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getOnlineTutorCount, isTutorOnline } from "@/lib/presence";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Clock, LayoutDashboard, User } from "lucide-react";
import {
  TutorComposer,
  type StageOption,
} from "@/components/tutor/TutorComposer";
import { TutorThreadRefresh } from "@/components/tutor/TutorThreadRefresh";
import { TutorPresence } from "@/components/tutor/TutorPresence";
import { EndSessionButton } from "@/components/tutor/EndSessionButton";
import { ChatScrollAnchor } from "@/components/tutor/ChatScrollAnchor";
import { formatRelative, summariseProgress } from "@/lib/tutor";

export const dynamic = "force-dynamic";

const sessionInclude = {
  messages: {
    include: {
      sender: { select: { id: true, email: true, role: true } },
    },
    orderBy: { createdAt: "asc" },
  },
  student: { select: { id: true, email: true } },
  tutor: { select: { id: true, email: true } },
} satisfies Prisma.TutorSessionInclude;

type SessionWithMessages = Prisma.TutorSessionGetPayload<{
  include: typeof sessionInclude;
}>;

function ChatState({
  title,
  message,
  actionHref,
  actionLabel,
}: {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16 text-center">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <User className="h-5 w-5" />
      </div>
      <h1 className="text-xl font-bold text-heading">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default async function TutorChatPage({
  searchParams,
}: {
  searchParams: Promise<{
    studentId?: string;
    requestId?: string;
    sessionId?: string;
    stageId?: string;
  }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { studentId, requestId, sessionId, stageId } = await searchParams;
  const isTutor = user.role === "TUTOR";
  let session: SessionWithMessages | null = null;

  if (sessionId) {
    const found = await db.tutorSession.findUnique({
      where: { id: sessionId },
      include: sessionInclude,
    });

    if (!found) {
      return (
        <ChatState
          title="Session not found"
          message="This conversation may have been removed."
          actionHref="/sessions"
          actionLabel="Back to sessions"
        />
      );
    }

    const isParticipant =
      found.studentId === user.id || found.tutorId === user.id;

    if (isParticipant) {
      session = found;
    } else if (isTutor && !found.tutorId) {
      session = await db.tutorSession.update({
        where: { id: found.id },
        data: { tutorId: user.id },
        include: sessionInclude,
      });
    } else {
      return (
        <ChatState
          title="You do not have access to this chat"
          message="Only the student and their assigned tutor can open this conversation."
          actionHref="/sessions"
          actionLabel="Back to sessions"
        />
      );
    }
  } else if (isTutor && studentId) {
    const existing = await db.tutorSession.findFirst({
      where: { studentId, status: "ACTIVE" },
      include: sessionInclude,
      orderBy: { createdAt: "desc" },
    });

    if (existing?.tutorId && existing.tutorId !== user.id) {
      return (
        <ChatState
          title="Another tutor is helping"
          message="This student already has an active conversation with another tutor. Pick up a different request or wait for this session to end."
          actionHref="/tutor/queue"
          actionLabel="Back to the tutor queue"
        />
      );
    }

    if (existing) {
      session = existing.tutorId
        ? existing
        : await db.tutorSession.update({
            where: { id: existing.id },
            data: { tutorId: user.id },
            include: sessionInclude,
          });
    } else {
      session = await db.tutorSession.create({
        data: {
          studentId,
          tutorId: user.id,
          mode: "LIVE",
          status: "ACTIVE",
        },
        include: sessionInclude,
      });
    }

    if (requestId) {
      await db.tutorRequest.updateMany({
        where: { id: requestId, studentId, status: "PENDING" },
        data: { status: "ANSWERED", answeredAt: new Date() },
      });
    }
  } else if (!isTutor) {
    const existing = await db.tutorSession.findFirst({
      where: { studentId: user.id, status: "ACTIVE" },
      include: sessionInclude,
      orderBy: { createdAt: "desc" },
    });

    session =
      existing ??
      (await db.tutorSession.create({
        data: {
          studentId: user.id,
          mode: "LIVE",
          status: "ACTIVE",
        },
        include: sessionInclude,
      }));
  }

  if (!session) {
    return (
      <ChatState
        title="Choose a student"
        message="Open a request from the tutor queue to start a conversation."
        actionHref="/tutor/queue"
        actionLabel="Open the tutor queue"
      />
    );
  }

  const isActive = session.status === "ACTIVE";
  const otherUser = isTutor
    ? session.student
    : session.tutor ?? { email: "Unassigned tutor" };

  let studentContext: {
    percentage: number;
    passed: number;
    totalPhases: number;
    average: number;
    pending: number;
  } | null = null;

  if (isTutor) {
    const [records, totalPhases, pending] = await Promise.all([
      db.progressRecord.findMany({
        where: { studentId: session.studentId },
        select: { phaseId: true, passed: true, score: true },
      }),
      db.phase.count({
        where: { module: { course: { isPublished: true } } },
      }),
      db.tutorRequest.count({
        where: { studentId: session.studentId, status: "PENDING" },
      }),
    ]);
    const summary = summariseProgress(records);

    studentContext = {
      percentage:
        totalPhases > 0
          ? Math.round((summary.passed / totalPhases) * 100)
          : 0,
      passed: summary.passed,
      totalPhases,
      average: summary.average,
      pending,
    };
  }

  const tutorOnline =
    isTutor || !isActive
      ? false
      : session.tutorId
        ? await isTutorOnline(session.tutorId)
        : (await getOnlineTutorCount()) > 0;

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

  const stageOptions: StageOption[] = [];
  if (isTutor) {
    const seen = new Set<string>();
    const requests = await db.tutorRequest.findMany({
      where: { studentId: session.studentId, stageId: { not: null } },
      select: { stage: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" },
      take: 12,
    });

    for (const request of requests) {
      if (request.stage && !seen.has(request.stage.id)) {
        seen.add(request.stage.id);
        stageOptions.push(request.stage);
      }
    }

    if (stageId && !seen.has(stageId)) {
      const stage = await db.stage.findUnique({
        where: { id: stageId },
        select: { id: true, title: true },
      });
      if (stage) stageOptions.unshift(stage);
    }
  }

  const focusedRequest = requestId
    ? await db.tutorRequest.findUnique({
        where: { id: requestId },
        include: {
          stage: {
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
          },
        },
      })
    : await db.tutorRequest.findFirst({
        where: { studentId: session.studentId, status: "PENDING" },
        include: {
          stage: {
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
          },
        },
        orderBy: { createdAt: "desc" },
      });

  return (
    <div className="mx-auto flex h-[calc(100dvh-8rem)] min-h-[480px] max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card">
      {isTutor && <TutorPresence />}

      <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate font-semibold text-heading">
              {isTutor ? (
                <Link
                  href={`/tutor/students/${session.studentId}`}
                  className="hover:text-primary hover:underline"
                >
                  {otherUser.email}
                </Link>
              ) : (
                otherUser.email
              )}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <Badge variant={isTutor ? "outline" : "secondary"}>
                {isTutor ? "Student" : "Tutor"}
              </Badge>
              <Badge variant={isActive ? "default" : "outline"}>
                {isActive ? "Active" : "Ended"}
              </Badge>
              {!isTutor && isActive && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      tutorOnline ? "bg-emerald-600" : "bg-muted-foreground"
                    }`}
                  />
                  {tutorOnline
                    ? "Tutor online"
                    : session.tutorId
                      ? "Tutor offline"
                      : "No tutor assigned"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {isTutor && (
            <Link
              href="/tutor"
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-heading"
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              Desk
            </Link>
          )}
          <Link
            href={`/sessions/${session.id}`}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-heading"
          >
            <Clock className="h-3.5 w-3.5" />
            Record
          </Link>
          {isActive && <EndSessionButton sessionId={session.id} />}
        </div>
      </div>

      {isTutor && studentContext && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">
            {studentContext.percentage}% complete
          </span>
          <span>
            {studentContext.passed}/{studentContext.totalPhases} phases passed
          </span>
          <span>Avg best {studentContext.average}%</span>
          {studentContext.pending > 0 && (
            <span className="text-amber-700 dark:text-amber-300">
              {studentContext.pending} pending request
              {studentContext.pending === 1 ? "" : "s"}
            </span>
          )}
          <Link
            href={`/tutor/students/${session.studentId}`}
            className="ml-auto font-medium text-primary hover:underline"
          >
            Student progress
          </Link>
        </div>
      )}

      {focusedRequest && (
        <div className="border-b border-border bg-primary/[0.04] p-3.5 px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {isTutor ? "Student Help Request" : "Your Help Request in Queue"}
                </span>
                {focusedRequest.stage && (
                  <Badge variant="outline" className="text-xs">
                    {focusedRequest.stage.title}
                  </Badge>
                )}
              </div>
              <p className="mt-1.5 text-sm font-medium text-heading">
                &ldquo;{focusedRequest.question}&rdquo;
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Submitted {formatRelative(focusedRequest.createdAt, new Date())}
                </span>
                {focusedRequest.stage && (
                  <Link
                    href={`/courses/${focusedRequest.stage.phase.module.courseId}/${focusedRequest.stage.phase.moduleId}/${focusedRequest.stage.phaseId}/${focusedRequest.stage.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                  >
                    View stage ↗
                  </Link>
                )}
              </div>
            </div>
            {!isTutor && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                In queue
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {session.messages.length === 0 && (
          <div className="py-10 text-center">
            {focusedRequest ? (
              <div className="max-w-md mx-auto space-y-2">
                <p className="text-sm font-medium text-heading">
                  {isTutor
                    ? "Reply to the student's question above to start the conversation."
                    : "Your question is waiting in the queue."}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isTutor
                    ? "Type your guidance below. You can also use 'Highlight stage' to send a direct link to a lesson."
                    : tutorOnline
                      ? "A tutor is online now and will reply shortly."
                      : "No tutor is currently online. A tutor will review your question when they log in."}
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {isTutor
                  ? "Answer the student's question to get started."
                  : "Send a message and a tutor will reply when they are online."}
              </p>
            )}
          </div>
        )}

        {session.messages.map((m) => {
          const mine = m.senderId === user.id;
          const highlighted =
            m.type === "HIGHLIGHT" && m.stageId
              ? stageMap.get(m.stageId)
              : undefined;

          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                  mine
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-medium opacity-80">
                    {mine
                      ? "You"
                      : m.sender.role === "TUTOR"
                        ? "Tutor"
                        : "Student"}
                  </span>
                  {m.type === "HIGHLIGHT" && (
                    <span className="rounded-full bg-background/20 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide">
                      Stage highlight
                    </span>
                  )}
                </div>
                <p className="whitespace-pre-wrap text-sm">{m.content}</p>
                {highlighted && (
                  <Link
                    href={`/courses/${highlighted.phase.module.courseId}/${highlighted.phase.moduleId}/${highlighted.phaseId}/${highlighted.id}`}
                    className={`mt-2 inline-block text-xs underline underline-offset-2 opacity-90 ${
                      mine ? "text-primary-foreground" : "text-primary"
                    }`}
                  >
                    Open {highlighted.title}
                  </Link>
                )}
                <span
                  className={`mt-1 block text-xs ${
                    mine
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <ChatScrollAnchor messageCount={session.messages.length} />
      </div>

      {isActive ? (
        <>
          <TutorComposer
            sessionId={session.id}
            stageOptions={stageOptions}
            defaultType={isTutor && stageId ? "HIGHLIGHT" : "TEXT"}
            defaultStageId={stageId ?? null}
          />
          <TutorThreadRefresh />
        </>
      ) : (
        <div className="border-t border-border bg-muted/40 p-5 text-sm text-muted-foreground">
          This session ended
          {session.endedAt
            ? ` on ${new Date(session.endedAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}`
            : ""}
          .{" "}
          <Link
            href={`/sessions/${session.id}`}
            className="font-medium text-primary hover:underline"
          >
            Open the saved record
          </Link>
          .
        </div>
      )}
    </div>
  );
}
