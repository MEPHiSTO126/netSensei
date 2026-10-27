import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  stageId: z.string().nullish(),
  question: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { stageId, question } = schema.parse(body);

    const tutorRequest = await db.tutorRequest.create({
      data: {
        studentId: user.id,
        stageId,
        question,
        status: "PENDING",
      },
    });

    return NextResponse.json(tutorRequest);
  } catch {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    if (user.role !== "TUTOR") {
      return NextResponse.json({ error: "Tutor access required" }, { status: 403 });
    }

    const requests = await db.tutorRequest.findMany({
      where: { status: "PENDING" },
      include: {
        student: { select: { id: true, email: true } },
        stage: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch {
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}
