import Link from "next/link";
import {
  ChevronRight,
  Clock,
  MessageSquare,
  User,
} from "lucide-react";
import { requireTutorPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatRelative } from "@/lib/tutor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function TutorSessionsPage() {
  const user = await requireTutorPage();
  const now = new Date();

  const sessions = await db.tutorSession.findMany({
    where: { tutorId: user.id },
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
    take: 50,
  });

  const activeCount = sessions.filter(
    (session) => session.status === "ACTIVE",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {sessions.length} conversation{sessions.length === 1 ? "" : "s"} ·{" "}
          {activeCount} active. Every session keeps a saved record.
        </p>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
            </span>
            <h2 className="font-semibold text-heading">No sessions yet</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Answer a student request from the queue. The conversation appears
              here with its saved record.
            </p>
            <Link
              href="/tutor/queue"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open queue
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const active = session.status === "ACTIVE";
            const lastMessage = session.messages[0];

            return (
              <Card key={session.id}>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/tutor/students/${session.student.id}`}
                        className="truncate text-sm font-semibold text-heading hover:text-primary hover:underline"
                      >
                        {session.student.email}
                      </Link>
                      <Badge variant={active ? "default" : "outline"}>
                        {active ? "Active" : "Ended"}
                      </Badge>
                    </div>

                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                      {lastMessage
                        ? lastMessage.content
                        : "No messages in this session yet"}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        Started {formatRelative(session.createdAt, now)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {session._count.messages} message
                        {session._count.messages === 1 ? "" : "s"}
                      </span>
                      {lastMessage && (
                        <span>
                          Last {formatRelative(lastMessage.createdAt, now)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <Link
                      href={`/tutor/students/${session.student.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-primary hover:underline"
                    >
                      <User className="h-3.5 w-3.5" />
                      Student
                    </Link>
                    <Link
                      href={
                        active
                          ? `/tutor/chat?sessionId=${session.id}`
                          : `/sessions/${session.id}`
                      }
                      className={
                        active
                          ? "inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                          : "inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-muted"
                      }
                    >
                      {active ? "Continue chat" : "Open record"}
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
