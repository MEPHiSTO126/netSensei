import { requireTutor } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TutorQueuePage() {
  const user = await requireTutor();

  const requests = await db.tutorRequest.findMany({
    where: { status: "PENDING" },
    include: {
      student: { select: { id: true, email: true } },
      stage: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-heading">Tutor Queue</h1>
        <p className="text-muted-foreground">
          Pending student requests for help
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Badge variant="outline">{requests.length} pending</Badge>
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
          {requests.map((r) => (
            <Card key={r.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-foreground">
                    {r.student.email}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {r.stage ? `Stage: ${r.stage.title}` : "General question"}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {new Date(r.createdAt).toLocaleTimeString()}
                </Badge>
              </div>
              <p className="text-sm mb-4">{r.question}</p>
              <Link
                href={`/tutor/chat?studentId=${r.student.id}&requestId=${r.id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <MessageCircle className="h-4 w-4" /> Open chat
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
