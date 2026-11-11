import Link from "next/link";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Inbox,
  MessageSquare,
  User,
  XCircle,
} from "lucide-react";
import { requireTutorPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCourseProgress } from "@/lib/progress";
import { formatRelative, latestDate, summariseProgress } from "@/lib/tutor";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function TutorStudentPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const tutor = await requireTutorPage();
  const { studentId } = await params;
  const now = new Date();

  const student = await db.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      lastSeen: true,
      _count: {
        select: {
          answerRecords: true,
          tutorSessionsAsStudent: true,
          tutorRequests: true,
        },
      },
      progressRecords: {
        include: {
          phase: {
            include: {
              module: { include: { course: true } },
            },
          },
        },
        orderBy: { completedAt: "desc" },
      },
      answerRecords: {
        take: 8,
        orderBy: { createdAt: "desc" },
        include: {
          question: { select: { prompt: true, type: true } },
        },
      },
      tutorSessionsAsStudent: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          tutor: { select: { id: true, email: true } },
          _count: { select: { messages: true } },
        },
      },
      tutorRequests: {
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { stage: { select: { title: true } } },
      },
    },
  });

  if (!student || student.role !== "STUDENT") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Student not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account does not exist or is not a student.
        </p>
        <Link
          href="/tutor/students"
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Back to students
        </Link>
      </div>
    );
  }

  const courses = await db.course.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    select: { id: true, title: true, description: true },
  });
  const courseProgress = await Promise.all(
    courses.map(async (course) => ({
      course,
      progress: await getCourseProgress(student.id, course.id),
    })),
  );
  const totalPhases = courseProgress.reduce(
    (sum, item) => sum + item.progress.totalPhases,
    0,
  );

  const summary = summariseProgress(student.progressRecords);
  const percentage =
    totalPhases > 0 ? Math.round((summary.passed / totalPhases) * 100) : 0;
  const pendingRequests = student.tutorRequests.filter(
    (request) => request.status === "PENDING",
  ).length;
  const activeSession = student.tutorSessionsAsStudent.find(
    (session) => session.status === "ACTIVE",
  );
  const lastActivity = latestDate(
    student.lastSeen,
    student.createdAt,
    ...student.progressRecords.map((record) => record.completedAt),
    ...student.answerRecords.map((record) => record.createdAt),
    ...student.tutorSessionsAsStudent.map((session) => session.createdAt),
    ...student.tutorRequests.map((request) => request.createdAt),
  );

  const pendingRequestId = student.tutorRequests.find(
    (request) => request.status === "PENDING",
  )?.id;
  const messageHref =
    activeSession && activeSession.tutor?.id === tutor.id
      ? `/tutor/chat?sessionId=${activeSession.id}`
      : `/tutor/chat?studentId=${student.id}${
          pendingRequestId ? `&requestId=${pendingRequestId}` : ""
        }`;

  return (
    <div className="space-y-6">
      <Link
        href="/tutor/students"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        All students
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="break-all text-xl font-bold text-heading">
              {student.email}
            </h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Student</Badge>
              {pendingRequests > 0 && (
                <Badge
                  variant="outline"
                  className="gap-1 border-amber-500/40 text-amber-700 dark:text-amber-300"
                >
                  <Inbox className="h-3.5 w-3.5" />
                  {pendingRequests} waiting
                </Badge>
              )}
              {activeSession && (
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-600/30 text-emerald-700 dark:text-emerald-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {activeSession.tutor?.id === tutor.id
                    ? "Your session"
                    : `In session with ${activeSession.tutor?.email ?? "a tutor"}`}
                </Badge>
              )}
              {lastActivity && (
                <span className="text-xs text-muted-foreground">
                  Active {formatRelative(lastActivity, now)}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href={messageHref}
          className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <MessageSquare className="h-4 w-4" />
          Message student
        </Link>
      </div>

      <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/40 p-5">
        <User className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-sm text-muted-foreground">
          Read-only view. You can review progress and message the student;
          nothing here changes their record.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Completion
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-heading">
              {percentage}%
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.passed} of {totalPhases} phases passed
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Avg best score
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-heading">
              {summary.average}%
            </p>
            <p className="text-xs text-muted-foreground">
              {summary.attempted} phase
              {summary.attempted === 1 ? "" : "s"} attempted
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Quiz answers
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-heading">
              {student._count.answerRecords}
            </p>
            <p className="text-xs text-muted-foreground">saved responses</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              Sessions
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-heading">
              {student._count.tutorSessionsAsStudent}
            </p>
            <p className="text-xs text-muted-foreground">
              {student._count.tutorRequests} help request
              {student._count.tutorRequests === 1 ? "" : "s"}
            </p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          <section className="space-y-4">
            <SectionTitle>
              Course progress
            </SectionTitle>
            {courseProgress.length === 0 ? (
              <Card>
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No published courses.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {courseProgress.map(({ course, progress }) => (
                  <Card key={course.id}>
                    <div className="p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-heading">
                          {course.title}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {progress.passedPhases} of {progress.totalPhases}{" "}
                          phases
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-xs font-semibold tabular-nums text-foreground">
                          {progress.percentage}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <SectionTitle>
              Phase history
            </SectionTitle>
            {student.progressRecords.length === 0 ? (
              <Card>
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No phase attempts yet.
                </p>
              </Card>
            ) : (
              <Card>
                <div className="divide-y divide-border">
                  {student.progressRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-start gap-3 p-5"
                    >
                      <span
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          record.passed
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {record.passed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {record.phase.title}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {record.phase.module.title} ·{" "}
                          {record.phase.module.course.title}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold tabular-nums text-heading">
                          {record.score}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          attempt {record.attemptNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatRelative(record.completedAt, now)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </section>

          <section className="space-y-4">
            <SectionTitle>
              Recent quiz answers
            </SectionTitle>
            {student.answerRecords.length === 0 ? (
              <Card>
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                  No quiz answers recorded yet.
                </p>
              </Card>
            ) : (
              <Card>
                <div className="divide-y divide-border">
                  {student.answerRecords.map((answer) => (
                    <div key={answer.id} className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 text-sm text-foreground">
                          {answer.question.prompt}
                        </p>
                        <Badge
                          variant={answer.score != null && answer.score >= 70 ? "default" : "outline"}
                          className="shrink-0 text-xs tabular-nums"
                        >
                          {answer.score != null ? `${answer.score}%` : "—"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {answer.question.type} · attempt {answer.attemptNumber} ·{" "}
                        {formatRelative(answer.createdAt, now)}
                      </p>
                      {answer.aiFeedback && (
                        <p className="mt-2 line-clamp-2 rounded-md bg-muted/50 p-2 text-xs text-muted-foreground">
                          {answer.aiFeedback}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <Card>
            <div className="p-5">
              <SectionTitle>
                Account
              </SectionTitle>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="shrink-0 text-muted-foreground">Joined</dt>
                  <dd className="text-right text-foreground">
                    {student.createdAt.toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="shrink-0 text-muted-foreground">Last seen</dt>
                  <dd className="text-right text-foreground">
                    {student.lastSeen.toLocaleDateString(undefined, {
                      dateStyle: "medium",
                    })}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="shrink-0 text-muted-foreground">Last active</dt>
                  <dd className="text-right text-foreground">
                    {lastActivity ? formatRelative(lastActivity, now) : "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="shrink-0 text-muted-foreground">Requests</dt>
                  <dd className="text-right text-foreground">
                    {student._count.tutorRequests}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <SectionTitle>
                  Sessions
                </SectionTitle>
                {activeSession && (
                  <Badge variant="outline" className="text-xs">
                    active
                  </Badge>
                )}
              </div>
              {student.tutorSessionsAsStudent.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  No sessions with this student yet.
                </p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {student.tutorSessionsAsStudent.map((session) => (
                    <li key={session.id} className="text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={
                            session.status === "ACTIVE"
                              ? `/tutor/chat?sessionId=${session.id}`
                              : `/sessions/${session.id}`
                          }
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          {session.status === "ACTIVE"
                            ? "Continue chat"
                            : "Open record"}
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                        <span className="text-muted-foreground">
                          {formatRelative(session.createdAt, now)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground">
                        {session.tutor?.email ?? "Unassigned"} ·{" "}
                        {session._count.messages} message
                        {session._count.messages === 1 ? "" : "s"} ·{" "}
                        {session.status === "ACTIVE" ? "active" : "ended"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card>
            <div className="p-5">
              <SectionTitle>
                Help requests
              </SectionTitle>
              {student.tutorRequests.length === 0 ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  No help requests from this student.
                </p>
              ) : (
                <ul className="mt-3 space-y-4">
                  {student.tutorRequests.map((request) => (
                    <li key={request.id} className="text-xs">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            request.status === "PENDING" ? "outline" : "secondary"
                          }
                          className={`text-xs ${
                            request.status === "PENDING"
                              ? "border-amber-500/40 text-amber-700 dark:text-amber-300"
                              : ""
                          }`}
                        >
                          {request.status === "PENDING" ? "Waiting" : "Answered"}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatRelative(request.createdAt, now)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-foreground">
                        {request.question}
                      </p>
                      <p className="mt-0.5 text-muted-foreground">
                        {request.stage?.title ?? "General question"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
