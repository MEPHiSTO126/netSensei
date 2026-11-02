"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import {
  BookOpen,
  Code2,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Users,
  X,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
};

type TutorSidebarProps = {
  email: string;
  pendingCount: number;
};

function isActive(pathname: string, item: NavItem) {
  return item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function NavList({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav aria-label="Tutor navigation" className="space-y-1">
      {items.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-heading"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.badge ? (
              <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary-foreground">
                {item.badge > 99 ? "99+" : item.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({
  items,
  pathname,
  email,
  onNavigate,
  onSignOut,
}: {
  items: NavItem[];
  pathname: string;
  email: string;
  onNavigate?: () => void;
  onSignOut: () => void;
}) {
  return (
    <>
      <div className="px-2 pb-5 pt-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Tutor
        </p>
      </div>

      <NavList items={items} pathname={pathname} onNavigate={onNavigate} />

      <div className="mt-auto border-t border-border pt-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-foreground">
              {email}
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tutor
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-heading"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}

function Brand() {
  return (
    <Link
      href="/tutor"
      className="flex items-center gap-2.5 px-2 pb-4 text-heading"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Code2 className="h-4 w-4" />
      </span>
      <span className="text-base font-semibold tracking-tight">netSensei</span>
    </Link>
  );
}

export function TutorSidebar({ email, pendingCount }: TutorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const items: NavItem[] = [
    { href: "/tutor", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/tutor/queue", label: "Queue", icon: Inbox, badge: pendingCount },
    { href: "/tutor/students", label: "Students", icon: Users },
    { href: "/tutor/sessions", label: "Sessions", icon: MessageSquare },
    { href: "/tutor/courses", label: "Course preview", icon: BookOpen },
  ];

  const current = items.find((item) => isActive(pathname, item));

  return (
    <>
      <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3 md:hidden">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Tutor desk
          </p>
          <p className="truncate text-sm font-semibold text-heading">
            {current?.label ?? "Overview"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open tutor menu"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-heading"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      <aside className="hidden min-h-[560px] flex-col border-r border-border bg-muted/30 p-3 md:flex">
        <Brand />
        <SidebarBody
          items={items}
          pathname={pathname}
          email={email}
          onSignOut={handleSignOut}
        />
      </aside>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tutor menu"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background p-3 shadow-xl"
          >
            <div className="flex items-start justify-between">
              <Brand />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close tutor menu"
                className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-heading"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarBody
              items={items}
              pathname={pathname}
              email={email}
              onNavigate={() => setOpen(false)}
              onSignOut={handleSignOut}
            />
          </div>
        </div>
      )}
    </>
  );
}
