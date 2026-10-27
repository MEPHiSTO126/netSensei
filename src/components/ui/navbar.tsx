"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ComponentType } from "react";
import {
  BarChart3,
  BookOpen,
  Code2,
  History,
  Inbox,
  LogOut,
  MessageSquare,
  User,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

type NavUser = {
  email: string;
  role: "STUDENT" | "TUTOR";
};

type NavItem = {
  href: string;
  label: string;
  shortLabel?: string;
  icon: ComponentType<{ className?: string }>;
  matchPrefix?: boolean;
};

export function Navbar({ user }: { user: NavUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const items: NavItem[] = [
    { href: "/courses", label: "Courses", icon: BookOpen, matchPrefix: true },
  ];

  if (user) {
    items.push(
      { href: "/progress", label: "Progress", icon: BarChart3 },
      {
        href: user.role === "TUTOR" ? "/tutor/queue" : "/tutor/chat",
        label: user.role === "TUTOR" ? "Tutor queue" : "Tutor help",
        shortLabel: user.role === "TUTOR" ? "Queue" : "Tutor",
        icon: user.role === "TUTOR" ? Inbox : MessageSquare,
        matchPrefix: user.role === "TUTOR",
      },
      { href: "/sessions", label: "Sessions", icon: History, matchPrefix: true },
    );

    if (user.role === "TUTOR") {
      items.push({ href: "/tutor/chat", label: "Chat", icon: MessageSquare });
    }
  }

  async function signOut() {
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  function isCurrent(item: NavItem) {
    return item.matchPrefix
      ? pathname === item.href || pathname.startsWith(`${item.href}/`)
      : pathname === item.href;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={user ? "/courses" : "/"}
          className="flex shrink-0 items-center gap-2 text-heading"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="h-4 w-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight">netSensei</span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden flex-1 items-center gap-1 md:flex"
        >
          {items.map((item) => {
            const active = isCurrent(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-heading"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {user ? (
            <div className="flex items-center gap-1 rounded-full border border-border bg-muted/60 py-1 pl-3 pr-1">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="hidden max-w-[180px] truncate text-sm text-foreground sm:inline">
                {user.email}
              </span>
              <span className="hidden rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground lg:inline">
                {user.role === "TUTOR" ? "Tutor" : "Student"}
              </span>
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-heading"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Create account
              </Link>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex items-center gap-1 overflow-x-auto border-t border-border px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
      >
        {items.map((item) => {
          const active = isCurrent(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-heading"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.shortLabel ?? item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
