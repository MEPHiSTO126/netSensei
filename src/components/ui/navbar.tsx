"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { LogOut, User, MousePointer2 } from "lucide-react";

export function Navbar({ user }: { user: { email: string; role: string } | null }) {
  const { signOut } = useSession();

  return (
    <nav className="border-b border-background bg-background px-4 flex h-16 items-center justify-between sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between w-full">
        <Link href="/" className="flex items-center gap-2">
          <MousePointer2 className="h-6 w-6" />
          <span className="font-bold text-lg tracking-tight">netSensei</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-sm font-medium hover:text-primary">
            Courses
          </Link>
          {user && (
            <>
              <Link href="/progress" className="text-sm font-medium hover:text-primary">
                Progress
              </Link>
              {user.role === "TUTOR" && (
                <Link href="/tutor/queue" className="text-sm font-medium hover:text-primary">
                  Tutor Queue
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border bg-muted text-muted-foreground text-sm">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-1 p-1.5 hover:bg-accent rounded-md"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-primary">
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary px-3 text-primary-foreground text-sm font-medium shadow-sm"
              >
                <User className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
