import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const lastMessageId = searchParams.get("lastMessageId") || "0";

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Verify user has access to this session
    const session = await db.tutorSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || (session.studentId !== user.id && session.tutorId !== user.id)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let heartbeat: NodeJS.Timeout;

        const sendEvent = (data: unknown) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        };

        // Initial connection - send online status of tutors
        const tutors = await db.user.findMany({
          where: { role: "TUTOR", isOnline: true },
          select: { id: true, email: true, lastSeen: true },
        });
        sendEvent({ type: "tutors_online", tutors });

        // Poll for new messages
        heartbeat = setInterval(async () => {
          try {
            const messages = await db.message.findMany({
              where: { sessionId },
              orderBy: { createdAt: "desc" },
              take: 50,
              include: {
                sender: { select: { id: true, email: true, role: true } },
              },
            });

            const newMessages = messages
              .filter((m) => m.id > lastMessageId)
              .reverse();

            if (newMessages.length > 0) {
              sendEvent({ type: "messages", messages: newMessages });
            }

            const onlineTutors = await db.user.findMany({
              where: { role: "TUTOR", isOnline: true },
              select: { id: true, email: true, lastSeen: true },
            });
            sendEvent({ type: "tutors_online", tutors: onlineTutors });
          } catch {
            // Ignore polling errors
          }
        }, 5000);

        return () => {
          clearInterval(heartbeat);
        };
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json({ error: "Stream failed" }, { status: 500 });
  }
}
