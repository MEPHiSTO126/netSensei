import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Clock, Send, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TutorChatPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; requestId?: string; sessionId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const { studentId, requestId, sessionId } = await searchParams;

  // Find or create a session
  let session;
  if (sessionId) {
    session = await db.tutorSession.findUnique({
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
  } else if (studentId && user.role === "TUTOR") {
    // Tutor starting chat with student
    session = await db.tutorSession.create({
      data: {
        studentId,
        tutorId: user.id,
        mode: "LIVE",
        status: "ACTIVE",
      },
      include: {
        messages: {
          include: { sender: { select: { id: true, email: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
        student: { select: { id: true, email: true } },
        tutor: { select: { id: true, email: true } },
      },
    });
    // Mark request as answered
    if (requestId) {
      await db.tutorRequest.update({
        where: { id: requestId },
        data: { status: "ANSWERED", answeredAt: new Date() },
      });
    }
  } else if (user.role === "STUDENT") {
    // Student viewing their own sessions
    session = await db.tutorSession.findFirst({
      where: { studentId: user.id, status: "ACTIVE" },
      include: {
        messages: {
          include: { sender: { select: { id: true, email: true, role: true } } },
          orderBy: { createdAt: "asc" },
        },
        student: { select: { id: true, email: true } },
        tutor: { select: { id: true, email: true } },
      },
    });
    if (!session) {
      session = await db.tutorSession.create({
        data: {
          studentId: user.id,
          mode: "LIVE",
          status: "ACTIVE",
        },
        include: {
          messages: {
            include: { sender: { select: { id: true, email: true, role: true } } },
            orderBy: { createdAt: "asc" },
          },
          student: { select: { id: true, email: true } },
          tutor: { select: { id: true, email: true } },
        },
      });
    }
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold text-heading">Unable to start chat</h1>
        <p className="text-muted-foreground mb-4">Please try again.</p>
      </div>
    );
  }

  const isTutor = user.role === "TUTOR";
  const otherUser = isTutor
    ? session.student
    : session.tutor ?? { email: "Tutor" };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold text-heading">{otherUser.email}</h2>
            <Badge variant={isTutor ? "outline" : "default"} className="text-xs">
              {isTutor ? "Student" : "Tutor"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Online
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <Card className={`max-w-[80%] p-3 rounded-xl ${
              m.senderId === user.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium opacity-80">
                  {m.sender.role === "TUTOR" ? "Tutor" : "You"}
                </span>
                {m.type === "HIGHLIGHT" && (
                  <Badge variant="secondary" className="text-xs">
                    Stage highlight
                  </Badge>
                )}
              </div>
              <p className="text-sm">{m.content}</p>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </Card>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg border border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <button
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            disabled
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Message sending will be enabled with SSE connection. Tutor can highlight
          stages to reference specific lesson content.
        </p>
      </div>
    </div>
  );
}
