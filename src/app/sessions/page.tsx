import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SessionsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const isTutor = user.role === "TUTOR";
  const sessions = await db.tutorSession.findMany({
    where: isTutor
      ? { tutorId: user.id }
      : { studentId: user.id },
    include: {
      student: { select: { id: true, email: true } },
      tutor: { select: { id: true, email: true } },
      _count: { select: { messages: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Sessions</h1>
          <p className="text-muted-foreground">
            Live conversations and the records they leave behind.
          </p>
        </div>
        {isTutor ? (
          <Link
            href="/tutor/queue"
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <MessageSquare className="h-4 w-4" />
            Tutor queue
          </Link>
        ) : (
          <Link
            href="/tutor/chat"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <MessageSquare className="h-4 w-4" />
            Open tutor chat
          </Link>
        )}
      </div>

      {sessions.length === 0 ? (
        <Card>
          <div className="px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-heading">No sessions yet</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              {isTutor
                ? "When you answer a student request, the conversation appears here with a saved record."
                : "Ask a tutor about a stage and your conversation will appear here."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const partner = isTutor ? session.student : session.tutor;
            const active = session.status === "ACTIVE";

            return (
              <Card key={session.id}>
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate font-semibold text-heading">
                        {partner?.email ?? "Unassigned tutor"}
                      </h2>
                      <Badge variant={active ? "default" : "outline"}>
                        {active ? "Active" : "Ended"}
                      </Badge>
                      <Badge variant="secondary">
                        {session.mode === "LIVE" ? "Live session" : "Recorded"}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(session.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {session._count.messages} message
                        {session._count.messages !== 1 ? "s" : ""}
                      </span>
                      {session.endedAt && (
                        <span>
                          Ended{" "}
                          {new Date(session.endedAt).toLocaleDateString(
                            undefined,
                            { dateStyle: "medium" },
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    {active && (
                      <Link
                        href={`/tutor/chat?sessionId=${session.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Continue chat
                      </Link>
                    )}
                    <Link
                      href={`/sessions/${session.id}`}
                      className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      Open record
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
