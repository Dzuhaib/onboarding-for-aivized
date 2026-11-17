import "server-only";

import { Resend } from "resend";

import { APP_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { NewSubmissionNotificationEmail } from "@/lib/email/templates/NewSubmissionNotificationEmail";

function parseRecipients(value: string | undefined) {
  if (!value) return ["info@aivized.com"];
  const list = value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return list.length > 0 ? list : ["info@aivized.com"];
}

export async function sendNewSubmissionNotification(params: { submissionId: string }) {
  const submission = await prisma.clientSubmission.findUnique({
    where: { id: params.submissionId },
    include: { files: true },
  });

  if (!submission) {
    return { ok: false as const, error: "Submission not found" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    await prisma.clientSubmission.update({
      where: { id: submission.id },
      data: { notificationStatus: "SKIPPED" },
    });
    return { ok: true as const, skipped: true as const };
  }

  const resend = new Resend(apiKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "AIVized <onboarding@aivized.com>";
  const to = parseRecipients(process.env.RESEND_TO_EMAILS);

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject: `New AIVized onboarding submission${submission.companyName ? ` - ${submission.companyName}` : ""}`,
      react: NewSubmissionNotificationEmail({
        submission: {
          id: submission.id,
          clientName: submission.clientName ?? "Client",
          clientEmail: submission.clientEmail ?? "",
          companyName: submission.companyName,
          services: submission.services,
          status: submission.status,
          submittedAt: submission.submittedAt,
          budgetRange: submission.budgetRange,
          urgency: submission.projectUrgency,
          files: submission.files,
        },
        agency: {
          name: APP_NAME,
          email: to[0],
        },
      }),
    });

    await prisma.clientSubmission.update({
      where: { id: submission.id },
      data: { notificationStatus: result.data?.id ? "SENT" : "FAILED" },
    });

    return { ok: true as const, id: result.data?.id };
  } catch {
    await prisma.clientSubmission.update({
      where: { id: submission.id },
      data: { notificationStatus: "FAILED" },
    });
    return { ok: false as const, error: "Email delivery failed" };
  }
}

