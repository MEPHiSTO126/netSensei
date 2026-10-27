import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Sign in required</h1>
      </div>
    );
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
        <p className="text-muted-foreground mb-4">You don&apos;t have access to this session.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Session Record</h1>
          <p className="text-muted-foreground">
            {session.mode === "LIVE" ? "Live session" : "Recorded session"}
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          {session.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                {session.tutor?.email || "No tutor assigned"}
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
                {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Started</p>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        {session.messages.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No messages in this session yet.
          </p>
        ) : (
          session.messages.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {m.sender.role === "TUTOR" ? "Tutor" : "Student"}
                </span>
                {m.type === "HIGHLIGHT" && (
                  <Badge variant="secondary" className="text-xs">
                    Highlight
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground">{m.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
