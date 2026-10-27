import type { Prisma } from "@prisma/client";
import { db } from "./db";

/**
 * A tutor counts as online only while their heartbeat is fresh. This avoids
 * stale "online" badges after a closed tab or a crashed session.
 */
export const TUTOR_ONLINE_WINDOW_MS = 2 * 60 * 1000;

export function tutorOnlineCutoff() {
  return new Date(Date.now() - TUTOR_ONLINE_WINDOW_MS);
}

export function onlineTutorWhere(): Prisma.UserWhereInput {
  return {
    role: "TUTOR",
    isOnline: true,
    lastSeen: { gte: tutorOnlineCutoff() },
  };
}

export async function getOnlineTutorCount() {
  return db.user.count({ where: onlineTutorWhere() });
}

export async function isTutorOnline(userId: string) {
  const tutor = await db.user.findFirst({
    where: { id: userId, ...onlineTutorWhere() },
    select: { id: true },
  });
  return Boolean(tutor);
}
