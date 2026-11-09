import Link from "next/link";
import {
  ChevronRight,
  Inbox,
  MessageSquare,
  Search,
  Users,
} from "lucide-react";
import { requireTutorPage } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  formatRelative,
  latestDate,
  summariseProgress,
} from "@/lib/tutor";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function TutorStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireTutorPage();
  const { q } = await searchParams;
  const search = q?.trim() ?? "";
  const now = new Date();

  const [students, totalPhases] = await Promise.all([
    db.user.findMany({
      where: search
        ? {
            role: "STUDENT",
            email: { contains: search, mode: "insensitive" as const },
          }
        : { role: "STUDENT" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        createdAt: true,
        lastSeen: true,
        progressRecords: {
          select: {
            phaseId: true,
            passed: true,
            score: true,
            completedAt: true,
          },
        },
        tutorRequests: {
          select: { status: true, createdAt: true },
        },
        tutorSessionsAsStudent: {
          select: { status: true, createdAt: true },
        },
      },
    }),
    db.phase.count({
      where: { module: { course: { isPublished: true } } },
    }),
  ]);

  const rows = students
    .map((student) => {
      const summary = summariseProgress(student.progressRecords);
      const pendingRequests = student.tutorRequests.filter(
        (request) => request.status === "PENDING",
      ).length;
      const activeSession = student.tutorSessionsAsStudent.some(
        (session) => session.status === "ACTIVE",
      );
      const lastActivity = latestDate(
        student.lastSeen,
        student.createdAt,
        ...student.progressRecords.map((record) => record.completedAt),
        ...student.tutorRequests.map((request) => request.createdAt),
        ...student.tutorSessionsAsStudent.map((session) => session.createdAt),
      );

      return {
        ...student,
        summary,
        pendingRequests,
        activeSession,
        lastActivity,
        percentage:
          totalPhases > 0
            ? Math.round((summary.passed / totalPhases) * 100)
            : 0,
      };
    })
    .sort((a, b) => {
      const aTime = a.lastActivity?.getTime() ?? 0;
      const bTime = b.lastActivity?.getTime() ?? 0;
      return bTime - aTime;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Students</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {students.length} student{students.length === 1 ? "" : "s"}
            {search ? ` matching “${search}”` : ""} · progress is read-only.
          </p>
        </div>

        <form method="get" className="flex w-full items-center gap-2 sm:w-auto">
          <div className="min-w-0 flex-1 sm:w-64">
            <Input
              type="search"
              name="q"
              defaultValue={search}
              placeholder="Filter by email"
              aria-label="Filter students by email"
              leftIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>
      </div>

      {rows.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Users className="h-5 w-5" />
            </span>
            <h2 className="font-semibold text-heading">
              {search ? "No matching students" : "No students yet"}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {search
                ? "Try a shorter part of the email address."
                : "Student accounts appear here once they register."}
            </p>
            {search && (
              <Link
                href="/tutor/students"
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Clear filter
              </Link>
            )}
          </div>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-border">
            {rows.map((student) => (
              <Link
                key={student.id}
                href={`/tutor/students/${student.id}`}
                className="group block p-5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Users className="h-4 w-4" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-heading group-hover:text-primary">
                        {student.email}
                      </p>
                      {student.activeSession && (
                        <Badge
                          variant="outline"
                          className="gap-1 border-emerald-600/30 text-xs text-emerald-700 dark:text-emerald-400"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          in session
                        </Badge>
                      )}
                      {student.pendingRequests > 0 && (
                        <Badge
                          variant="outline"
                          className="gap-1 border-amber-500/40 text-xs text-amber-700 dark:text-amber-300"
                        >
                          <Inbox className="h-3.5 w-3.5" />
                          {student.pendingRequests} waiting
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>
                        Joined{" "}
                        {student.createdAt.toLocaleDateString(undefined, {
                          dateStyle: "medium",
                        })}
                      </span>
                      <span>
                        {student.summary.attempted} phase
                        {student.summary.attempted === 1 ? "" : "s"} attempted
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {student.tutorSessionsAsStudent.length} session
                        {student.tutorSessionsAsStudent.length === 1
                          ? ""
                          : "s"}
                      </span>
                      {student.lastActivity && (
                        <span>
                          Active {formatRelative(student.lastActivity, now)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${student.percentage}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-xs font-medium tabular-nums text-foreground">
                        {student.percentage}%
                      </span>
                      <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                        {student.summary.passed}/{totalPhases} phases
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
