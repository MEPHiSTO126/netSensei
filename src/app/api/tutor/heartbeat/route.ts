import { NextResponse } from "next/server";
import { requireTutor, updateUserOnlineStatus } from "@/lib/auth";

export async function POST() {
  try {
    const user = await requireTutor();
    await updateUserOnlineStatus(user.id, true);
    return NextResponse.json({ ok: true, isOnline: true });
  } catch {
    return NextResponse.json({ error: "Tutor access required" }, { status: 403 });
  }
}
