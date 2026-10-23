import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["STUDENT", "TUTOR"]).default("STUDENT"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role } = schema.parse(body);

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: { email, passwordHash, role },
    });

    await createSession({ id: user.id, email: user.email, role: user.role as "STUDENT" | "TUTOR" });

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
