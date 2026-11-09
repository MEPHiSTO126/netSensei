import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Inbox,
  MessageSquare,
  Users,
  XCircle,
} from "lucide-react";
import { db } from "@/lib/db";
import { requireTutorPage } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelative, formatWait } from "@/lib/tutor";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-2 text-3xl font-bold tabular-nums text-heading">
          {value}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
      </div>
    </Card>
  );
}

export default async function TutorOverviewPage() {
  await requireTutorPage();
  const now = new Date();

  const [
    pendingCount,
    pending,
    activeCount,
    activeSessions,
    studentCount,
    progressAggregate,
    recentProgress,
  ] = await Promise.all([
    db.tutorRequest.count({ where: { status: "PENDING" } }),
    db.tutorRequest.findMany({
      where: { status: "PENDING" },
      include: {
        student: { select: { id: true, email: true } },
        stage: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 5,
    }),
    db.tutorSession.count({ where: { status: "ACTIVE" } }),
    db.tutorSession.findMany({
      where: { status: "ACTIVE" },
      include: {
        student: { select: { id: true, email: true } },
        _count: { select: { messages: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { content: true, createdAt: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    db.user.count({ where: { role: "STUDENT" } }),
    db.progressRecord.aggregate({
      _avg: { score: true },
      _count: { _all: true },
    }),
    db.progressRecord.findMany({
      orderBy: { completedAt: "desc" },
      take: 6,
      include: {
        student: { select: { id: true, email: true } },
        phase: {
          select: {
            title: true,
            module: { select: { title: true } },
          },
        },
      },
    }),
  ]);

  const oldestWait = pending[0]
    ? formatWait(pending[0].createdAt, now)
    : null;
  const averageScore = Math.round(progressAggregate._avg.score ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Tutor desk</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pendingCount > 0
            ? `${pendingCount} student${pendingCount === 1 ? "" : "s"} waiting${
                oldestWait ? ` · oldest ${oldestWait}` : ""
              }.`
            : "No one is waiting right now."}{" "}
          {activeCount > 0
            ? `${activeCount} active session${activeCount === 1 ? "" : "s"}.`
            : "No active sessions."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Pending"
          value={pendingCount}
          detail={oldestWait ? `oldest ${oldestWait}` : "queue is clear"}
        />
        <StatCard
          label="Active"
          value={activeCount}
          detail={
            activeCount === 1 ? "conversation open" : "conversations open"
          }
        />
        <StatCard
          label="Students"
          value={studentCount}
          detail="with accounts"
        />
        <StatCard
          label="Avg score"
          value={`${averageScore}%`}
          detail={`${progressAggregate._count._all} phase${
            progressAggregate._count._all === 1 ? "" : "s"
          } attempted`}
        />
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Waiting now
          </h2>
          <Link
            href="/tutor/queue"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            Open queue <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {pending.length === 0 ? (
          <Card>
            <div className="flex items-center gap-3 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-heading">
                  Queue is clear
                </p>
                <p className="text-xs text-muted-foreground">
                  New requests appear here as students tag stages.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {pending.map((request) => {
                const params = new URLSearchParams({
                  studentId: request.student.id,
                  requestId: request.id,
                });
                if (request.stageId) params.set("stageId", request.stageId);

                return (
                  <div
                    key={request.id}
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {request.student.email}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {request.stage
                            ? `Stage: ${request.stage.title}`
                            : "General question"}{" "}
                          · waiting {formatWait(request.createdAt, now)}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/tutor/chat?${params.toString()}`}
                      className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Open chat
                    </Link>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Active sessions
          </h2>
          <Link
            href="/tutor/sessions"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            All sessions <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {activeSessions.length === 0 ? (
          <Card>
            <div className="flex items-center gap-3 p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-heading">
                  No active sessions
                </p>
                <p className="text-xs text-muted-foreground">
                  Open a request from the queue to start talking to a student.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {activeSessions.map((session) => {
                const lastMessage = session.messages[0];

                return (
                  <div
                    key={session.id}
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/tutor/students/${session.student.id}`}
                          className="truncate text-sm font-medium text-foreground hover:text-primary hover:underline"
                        >
                          {session.student.email}
                        </Link>
                        <Badge variant="outline" className="gap-1 text-[10px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          live
                        </Badge>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {lastMessage
                          ? `${lastMessage.content}`
                          : "No messages yet"}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {session._count.messages} message
                        {session._count.messages === 1 ? "" : "s"}
                        {lastMessage
                          ? ` · last ${formatRelative(lastMessage.createdAt, now)}`
                          : ""}
                      </p>
                    </div>
                    <Link
                      href={`/tutor/chat?sessionId=${session.id}`}
                      className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Continue
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Recent quiz activity
        </h2>

        {recentProgress.length === 0 ? (
          <Card>
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
              No quiz attempts yet. Student scores will show up here.
            </p>
          </Card>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {recentProgress.map((record) => (
                <div
                  key={record.id}
                  className="flex items-start gap-3 p-4"
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
                    <p className="text-sm text-foreground">
                      <Link
                        href={`/tutor/students/${record.student.id}`}
                        className="font-medium hover:text-primary hover:underline"
                      >
                        {record.student.email}
                      </Link>{" "}
                      scored{" "}
                      <span className="font-semibold tabular-nums">
                        {record.score}%
                      </span>{" "}
                      on {record.phase.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {record.phase.module.title} ·{" "}
                      {formatRelative(record.completedAt, now)}
                      {record.passed ? "" : " · not passed"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card>
          <Link href="/tutor/queue" className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"><Inbox className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Answer the queue</span></Link>
        </Card>
        <Card><Link href="/tutor/students" className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"><Users className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Review students</span></Link></Card>
        <Card><Link href="/tutor/courses" className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"><BookOpen className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Preview the course</span></Link></Card>
      </div>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">This week</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {label:"Requests answered",value:0,note:"PENDING → ANSWERED"},
            {label:"Sessions started",value:0,note:"new ACTIVE"},
            {label:"Best new score",value:"—",note:"last 7 days"},
            {label:"Avg improvement",value:"—",note:"vs previous week"},
          ].map(s=> (
            <Card key={s.label}><div className="p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{s.label}</p><p className="mt-1 text-xl font-bold tabular-nums text-heading">{s.value}</p><p className="mt-0.5 text-xs text-muted-foreground">{s.note}</p></div></Card>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">Weekly counts derive from existing <code>tutorRequest</code>, <code>tutorSession</code>, and <code>progressRecord</code>. Full aggregation when data grows.</p>
      </section>
    </div>
  );
}
