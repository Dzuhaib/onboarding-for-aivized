import "server-only";

import { Resend } from "resend";

import { NewSubmissionNotificationEmail, type OnboardingEmailPayload } from "@/lib/email/templates/NewSubmissionNotificationEmail";

const FALLBACK_ERROR = "We couldn't send your submission right now. Please email info@aivized.com directly.";
const TIMEOUT_MS = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Email request timed out")), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function resendErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message?: unknown }).message ?? "").trim();
    if (message) return message;
  }
  return null;
}

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
  const from = process.env.RESEND_FROM_EMAIL ?? "AIVized <onboarding@onboard.aivized.com>";
  const to = parseRecipients(process.env.RESEND_TO_EMAILS);
  const company = payload.companyName ? ` (${payload.companyName})` : "";

  try {
    const { error } = await withTimeout(
      resend.emails.send({
        from,
        to,
        replyTo: payload.workEmail,
        subject: `New onboarding submission - ${payload.fullName}${company}`,
        react: NewSubmissionNotificationEmail({ payload }),
      }),
      TIMEOUT_MS,
    );

    if (error) {
      console.error("[email] resend rejected the send", error);
      const detail = resendErrorMessage(error);
      return { ok: false as const, error: detail ? `Email delivery failed: ${detail}` : FALLBACK_ERROR };
    }

    return { ok: true as const };
  } catch (error) {
    console.error("[email] resend request failed", error);
    const detail = resendErrorMessage(error);
    return { ok: false as const, error: detail ? `Email delivery failed: ${detail}` : FALLBACK_ERROR };
  }
}
