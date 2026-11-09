import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  User,
} from "lucide-react";
import { requireTutorPage } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatWait } from "@/lib/tutor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function TutorQueuePage() {
  await requireTutorPage();
  const now = new Date();

  const requests = await db.tutorRequest.findMany({
    where: { status: "PENDING" },
    include: {
      student: { select: { id: true, email: true } },
      stage: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Student requests for help, oldest first. You appear online while this
          desk is open.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline">
          {requests.length} pending
        </Badge>
        {requests[0] && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            Oldest waiting {formatWait(requests[0].createdAt, now)}
          </span>
        )}
      </div>

      {requests.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <h2 className="font-semibold text-heading">Queue is clear</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              No pending requests. Students can tag a stage to ask for help, and
              their request lands here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const wait = formatWait(request.createdAt, now);
            const waitingLong =
              now.getTime() - request.createdAt.getTime() > 5 * 60_000;

            const chatParams = new URLSearchParams({
              studentId: request.student.id,
              requestId: request.id,
            });
            if (request.stageId) chatParams.set("stageId", request.stageId);

            return (
              <Card key={request.id}>
                <div className="p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        <Link
                          href={`/tutor/students/${request.student.id}`}
                          className="truncate text-sm font-semibold text-heading hover:text-primary hover:underline"
                        >
                          {request.student.email}
                        </Link>
                        <Badge variant="outline" className="text-xs">
                          {request.stage
                            ? request.stage.title
                            : "General question"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Requested{" "}
                        {request.createdAt.toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        waitingLong
                          ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      waiting {wait}
                    </span>
                  </div>

                  <p className="mt-4 whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm text-foreground">
                    {request.question}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/tutor/chat?${chatParams.toString()}`}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      Open chat
                    </Link>
                    <Link
                      href={`/tutor/students/${request.student.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:underline"
                    >
                      <User className="h-3.5 w-3.5" />
                      View student
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
