import { NextResponse } from "next/server";
import {
  destroySession,
  getCurrentUser,
  updateUserOnlineStatus,
} from "@/lib/auth";

export async function POST() {
  const user = await getCurrentUser();
  if (user?.role === "TUTOR") {
    await updateUserOnlineStatus(user.id, false);
  }
  await destroySession();
  return NextResponse.json({ ok: true });
}
