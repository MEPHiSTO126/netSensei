import { NextResponse } from "next/server";
import { requireTutor, updateUserOnlineStatus } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await requireTutor();
    const body = (await req.json().catch(() => null)) as
      | { online?: boolean }
      | null;
    const isOnline = body?.online !== false;
    await updateUserOnlineStatus(user.id, isOnline);
    return NextResponse.json({ ok: true, isOnline });
  } catch {
    return NextResponse.json({ error: "Tutor access required" }, { status: 403 });
  }
}
