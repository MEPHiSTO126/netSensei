import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { sessionId } = await params;
    const session = await db.tutorSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const isStudent = session.studentId === user.id;
    const isAssignedTutor = session.tutorId === user.id;

    if (!isStudent && !isAssignedTutor) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (session.status === "ENDED") {
      return NextResponse.json(session);
    }

    const ended = await db.tutorSession.update({
      where: { id: sessionId },
      data: { status: "ENDED", endedAt: new Date() },
    });

    return NextResponse.json(ended);
  } catch {
    return NextResponse.json(
      { error: "Failed to end session" },
      { status: 500 },
    );
  }
}
