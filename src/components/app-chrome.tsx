"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/navbar";

type ChromeUser = {
  email: string;
  role: "STUDENT" | "TUTOR";
} | null;

/**
 * The tutor desk is an app shell with its own sidebar, so it hides the global
 * marketing navbar. Shared tutor chat keeps the navbar because students use it
 * too.
 */
export function AppChrome({ user }: { user: ChromeUser }) {
  const pathname = usePathname();

  const isTutorDesk =
    user?.role === "TUTOR" &&
    (pathname === "/tutor" ||
      (pathname.startsWith("/tutor/") &&
        !pathname.startsWith("/tutor/chat")));

  if (isTutorDesk) return null;

  return <Navbar user={user} />;
}
