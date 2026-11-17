import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function parseRecipients(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export async function GET() {
  const apiKey = Boolean(process.env.RESEND_API_KEY);
  const from = process.env.RESEND_FROM_EMAIL ?? null;
  const recipients = parseRecipients(process.env.RESEND_TO_EMAILS);

  if (!apiKey) {
    return NextResponse.json(
      {
        status: "error",
        email: "not_configured",
        hint: "Set RESEND_API_KEY, RESEND_FROM_EMAIL and RESEND_TO_EMAILS in this environment.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    status: "ok",
    email: "configured",
    from,
    recipients: recipients.length,
  });
}
