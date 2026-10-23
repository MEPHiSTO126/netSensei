"use client";

import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { LogOut, User, MousePointer2, LayoutList } from "lucide-react";

export function Navbar({ user }: { user: { email: string; role: string } | null }) {
  const { signOut } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-background bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/80">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <MousePointer2 className="h-6 w-6" />
          <span className="font-bold text-lg tracking-tight">netSensei</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/courses" className="text-sm font-medium hover:text-primary transition-colors">
            Courses
          </Link>
          {user && (
            <>
              <Link href="/progress" className="text-sm font-medium hover:text-primary transition-colors">
                Progress
              </Link>
              {user.role === "TUTOR" && (
                <Link href="/tutor/queue" className="text-sm font-medium hover:text-primary transition-colors">
                  Tutor Queue
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full border border-background bg-muted text-muted-foreground text-sm">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-1 p-1.5 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary px-3 text-primary-foreground text-sm font-medium shadow-sm hover:bg-primary/90 transition-colors"
              >
                <User className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );