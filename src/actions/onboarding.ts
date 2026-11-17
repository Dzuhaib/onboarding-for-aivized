"use server";

import { sendOnboardingEmail } from "@/lib/email";
import { finalSubmissionSchema } from "@/lib/validations";

export async function submitOnboarding(values: unknown) {
  const parsed = finalSubmissionSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Please check the highlighted fields and try again.",
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }

  const data = parsed.data;

  const result = await sendOnboardingEmail({
    fullName: data.fullName,
    workEmail: data.workEmail,
    phoneNumber: data.phoneNumber,
    companyName: data.companyName,
    country: data.country,
    referredBy: data.referredBy,
    preferredChannel: data.preferredChannel,
    industry: data.industry,
    businessType: data.businessType,
    businessDescription: data.businessDescription,
    projectType: data.projectType,
    projectDescription: data.projectDescription,
    services: data.services,
    projectScope: data.projectScope,
    desiredStartDate: data.desiredStartDate,
    projectUrgency: data.projectUrgency,
    budgetRange: data.budgetRange,
  });

  if (!result.ok) {
    return { ok: false as const, error: result.error, issues: [] as { path: string; message: string }[] };
  }

  return { ok: true as const };
}
