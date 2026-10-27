import { requireTutor } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { TutorPresence } from "@/components/tutor/TutorPresence";

export const dynamic = "force-dynamic";

export default async function TutorQueuePage() {
  await requireTutor();

  const requests = await db.tutorRequest.findMany({
    where: { status: "PENDING" },
    include: {
      student: { select: { id: true, email: true } },
      stage: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <TutorPresence />

      <div>
        <h1 className="text-2xl font-bold text-heading">Tutor queue</h1>
        <p className="text-muted-foreground">
          Pending student requests for help. You appear online while this page
          is open.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Badge variant="outline">
          {requests.length} pending
        </Badge>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          Online for students
        </span>
      </div>

      {requests.length === 0 ? (
        <Card>
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              No pending requests. Students can tag stages to request help.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const chatParams = new URLSearchParams({
              studentId: r.student.id,
              requestId: r.id,
            });
            if (r.stageId) chatParams.set("stageId", r.stageId);

            return (
              <Card key={r.id} className="p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {r.student.email}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {r.stage ? `Stage: ${r.stage.title}` : "General question"}
                    </p>
                  </div>
                  <Badge variant="outline" className="w-fit text-xs">
                    {new Date(r.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Badge>
                </div>
                <p className="mb-4 whitespace-pre-wrap text-sm">{r.question}</p>
                <Link
                  href={`/tutor/chat?${chatParams.toString()}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <MessageCircle className="h-4 w-4" />
                  Open chat
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
