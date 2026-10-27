"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TUTOR">("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password, role);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md elevated">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-heading">Create account</h1>
            <p className="text-muted-foreground">Start learning for free</p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (8+ chars)</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                leftIcon={<Lock className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <div className="grid grid-cols-2 gap-2">
                <label className="cursor-pointer">
                  <input
                    id="role"
                    type="radio"
                    value="STUDENT"
                    checked={role === "STUDENT"}
                    onChange={() => setRole("STUDENT")}
                    className="sr-only peer"
                  />
                  <div className="rounded-md border p-3 text-center text-sm font-medium transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground">
                    Student
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    id="role"
                    type="radio"
                    value="TUTOR"
                    checked={role === "TUTOR"}
                    onChange={() => setRole("TUTOR")}
                    className="sr-only peer"
                  />
                  <div className="rounded-md border p-3 text-center text-sm font-medium transition-colors peer-checked:bg-primary peer-checked:text-primary-foreground">
                    Tutor
                  </div>
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-input"
                required
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the terms of service
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
