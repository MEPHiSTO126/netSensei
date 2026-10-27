import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  sessionId: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(["TEXT", "HIGHLIGHT"]).default("TEXT"),
  stageId: z.string().nullish(),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, content, type, stageId } = schema.parse(body);

    const session = await db.tutorSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || (session.studentId !== user.id && session.tutorId !== user.id)) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (type === "HIGHLIGHT" && !stageId) {
      return NextResponse.json(
        { error: "stageId is required for HIGHLIGHT messages" },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        sessionId,
        senderId: user.id,
        content,
        type,
        stageId: type === "HIGHLIGHT" ? stageId ?? null : null,
      },
      include: {
        sender: { select: { id: true, email: true, role: true } },
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
