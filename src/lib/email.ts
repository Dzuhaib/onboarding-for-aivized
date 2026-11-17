import "server-only";

import { Resend } from "resend";

import { NewSubmissionNotificationEmail, type OnboardingEmailPayload } from "@/lib/email/templates/NewSubmissionNotificationEmail";

const FALLBACK_ERROR = "We couldn't send your submission right now. Please email info@aivized.com directly.";

function parseRecipients(value: string | undefined) {
  if (!value) return ["info@aivized.com"];
  const list = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return list.length > 0 ? list : ["info@aivized.com"];
}

export async function sendOnboardingEmail(payload: OnboardingEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY is not set");
    return { ok: false as const, error: "Email is not configured yet. Please email info@aivized.com directly." };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "AIVized <onboarding@aivized.com>";
  const to = parseRecipients(process.env.RESEND_TO_EMAILS);
  const company = payload.companyName ? ` (${payload.companyName})` : "";

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: payload.workEmail,
      subject: `New onboarding submission - ${payload.fullName}${company}`,
      react: NewSubmissionNotificationEmail({ payload }),
    });

    if (error) {
      console.error("[email] resend rejected the send", error);
      return { ok: false as const, error: FALLBACK_ERROR };
    }

    return { ok: true as const };
  } catch (error) {
    console.error("[email] resend request failed", error);
    return { ok: false as const, error: FALLBACK_ERROR };
  }
}
