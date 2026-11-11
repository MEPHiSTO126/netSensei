"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";

type ShellUser = {
  email: string;
  role: "STUDENT" | "TUTOR";
} | null;

/**
 * The tutor desk is an app shell, not a page: it owns the whole viewport and
 * scrolls its content column on its own. Rendering it inside the normal
 * centred container gave it a second page scrollbar and left it floating with
 * dead gutters, so desk routes bypass the navbar and the container entirely.
 *
 * The shared tutor chat stays on the normal layout, because students use it.
 */
export function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isTutorDesk =
    user?.role === "TUTOR" &&
    (pathname === "/tutor" ||
      (pathname.startsWith("/tutor/") && !pathname.startsWith("/tutor/chat")));

  if (isTutorDesk) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1 animate-[fadeIn_0.4s_ease-out_both]">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </>
  );
}
