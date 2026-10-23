import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = schema.parse(body);

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    await createSession({ id: user.id, email: user.email, role: user.role as "STUDENT" | "TUTOR" });

    return NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
  } catch {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
}
