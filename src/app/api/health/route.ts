import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    console.error("[health] database connection failed", error);
    return NextResponse.json(
      { status: "error", database: "unreachable", hint: "Check DATABASE_URL for this environment." },
      { status: 503 },
    );
  }

  try {
    await prisma.clientSubmission.count();
  } catch (error) {
    console.error("[health] schema check failed", error);
    return NextResponse.json(
      { status: "error", database: "connected", schema: "missing", hint: "Run `npx prisma db push` against this database." },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: "ok", database: "connected", schema: "ready" });
}
