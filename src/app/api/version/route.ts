import { NextResponse } from "next/server";

/**
 * Reports which build is live. Vercel injects the commit SHA at build time,
 * so this answers "is the deployment I pushed actually serving?" without
 * guessing from page content.
 */
export function GET() {
  return NextResponse.json({
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
    region: process.env.VERCEL_REGION ?? process.env.VERCEL_URL ?? null,
    builtAt: process.env.VERCEL_BUILD_TIME ?? null,
  });
}
