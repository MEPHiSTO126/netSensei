"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export type SessionUser = {
  id: string;
  email: string;
  role: "STUDENT" | "TUTOR";
};

async function fetchSessionUser(): Promise<SessionUser | null> {
  try {
    const res = await fetch("/api/auth/session", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    setUser(await fetchSessionUser());
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetchSessionUser().then((sessionUser) => {
      if (cancelled) return;
      setUser(sessionUser);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid email or password");
    await loadUser();
    router.push("/courses");
  }, [loadUser, router]);

  const signUp = useCallback(
    async (email: string, password: string, role: "STUDENT" | "TUTOR" = "STUDENT") => {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) throw new Error("Registration failed");
      await loadUser();
      router.push("/courses");
    },
    [loadUser, router]
  );

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
  }, [router]);

  return { user, loading, signIn, signUp, signOut };
}
