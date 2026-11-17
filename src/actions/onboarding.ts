"use server";

import type { Prisma } from "@prisma/client";
import { cookies } from "next/headers";

import { getCurrentAdminSession } from "@/actions/admin";
import { sendNewSubmissionNotification } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { CLIENT_TOKEN_COOKIE, generateToken, getTokenExpiryDate, hashToken, TOKEN_TTL_DAYS } from "@/lib/tokens";
import { finalSubmissionSchema, onboardingTokenSchema } from "@/lib/validations";

const FIELD_MAP: Array<[string, string]> = [
  ["fullName", "clientName"],
  ["workEmail", "clientEmail"],
  ["phoneNumber", "clientPhone"],
  ["companyName", "companyName"],
  ["country", "country"],
  ["referredBy", "referredBy"],
  ["preferredChannel", "preferredChannel"],
  ["industry", "industry"],
  ["businessType", "businessType"],
  ["businessDescription", "businessDescription"],
  ["projectType", "projectType"],
  ["projectDescription", "projectDescription"],
  ["projectScope", "projectScope"],
  ["projectUrgency", "projectUrgency"],
  ["budgetRange", "budgetRange"],
];

const DATE_FIELDS = ["desiredStartDate"] as const;

function mapSubmissionValues(values: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  for (const [from, to] of FIELD_MAP) {
    if (!(from in values)) continue;
    const value = values[from];
    if (typeof value === "string") {
      const trimmed = value.trim();
      data[to] = trimmed.length > 0 ? trimmed : null;
    } else if (value === undefined || value === null) {
      data[to] = null;
    } else {
      data[to] = value;
    }
  }

  for (const key of DATE_FIELDS) {
    if (!(key in values)) continue;
    const raw = values[key];
    if (typeof raw === "string" && raw.trim().length > 0) {
      const date = new Date(raw);
      data[key] = Number.isNaN(date.getTime()) ? null : date;
    } else {
      data[key] = null;
    }
  }

  if (Array.isArray(values.services)) {
    data.services = values.services.filter((service): service is string => typeof service === "string");
  }


  return data as Prisma.ClientSubmissionUncheckedUpdateInput;
}

export async function getOnboardingByToken(token: string) {
  const parsed = onboardingTokenSchema.safeParse({ token });
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid onboarding link" };
  }

  const tokenHash = hashToken(token);
  const submission = await prisma.clientSubmission.findUnique({
    where: { tokenHash },
    include: { files: true },
  });

  if (!submission) {
    return { ok: false as const, error: "Onboarding link not found" };
  }

  const expired = Boolean(submission.tokenExpiresAt && submission.tokenExpiresAt.getTime() < Date.now());
  const revoked = Boolean(submission.revokedAt);

  return { ok: true as const, submission, expired, revoked };
}

async function findActiveSubmission(token: string) {
  const tokenHash = hashToken(token);
  const submission = await prisma.clientSubmission.findUnique({ where: { tokenHash } });
  if (!submission) {
    return { ok: false as const, error: "Onboarding link not found" };
  }
  if (submission.revokedAt) {
    return { ok: false as const, error: "This onboarding link is no longer active" };
  }
  if (submission.tokenExpiresAt && submission.tokenExpiresAt.getTime() < Date.now()) {
    return { ok: false as const, error: "This onboarding link has expired" };
  }
  return { ok: true as const, submission };
}

export async function saveOnboardingDraft(token: string, values: unknown) {
  const parsedToken = onboardingTokenSchema.safeParse({ token });
  if (!parsedToken.success) {
    return { ok: false as const, error: "Invalid onboarding link" };
  }

  const active = await findActiveSubmission(token);
  if (!active.ok) {
    return { ok: false as const, error: active.error };
  }

  const data = mapSubmissionValues((values ?? {}) as Record<string, unknown>);
  const updated = await prisma.clientSubmission.update({
    where: { id: active.submission.id },
    data,
  });

  return { ok: true as const, submissionId: updated.id, status: updated.status };
}

export async function submitOnboarding(token: string, values: unknown, uploadedFileIds: string[]) {
  const parsedToken = onboardingTokenSchema.safeParse({ token });
  if (!parsedToken.success) {
    return { ok: false as const, error: "Invalid onboarding link" };
  }

  const active = await findActiveSubmission(token);
  if (!active.ok) {
    return { ok: false as const, error: active.error };
  }

  const parsed = finalSubmissionSchema.safeParse(values);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    return { ok: false as const, error: "Validation failed", issues };
  }

  if (uploadedFileIds.length > 0) {
    await prisma.onboardingFile.updateMany({
      where: { id: { in: uploadedFileIds }, submissionId: active.submission.id },
      data: { submissionId: active.submission.id },
    });
  }

  const updated = await prisma.clientSubmission.update({
    where: { id: active.submission.id },
    data: {
      ...mapSubmissionValues(parsed.data as Record<string, unknown>),
      status: "SUBMITTED",
      submittedAt: new Date(),
    },
  });

  const emailResult = await sendNewSubmissionNotification({ submissionId: updated.id });

  return {
    ok: true as const,
    submissionId: updated.id,
    notificationStatus: emailResult.ok ? (emailResult.skipped ? "SKIPPED" : "SENT") : "FAILED",
  };
}

export async function createOnboardingToken(params: { email?: string; name?: string; expiresInDays?: number }) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const token = generateToken();
  const tokenHash = hashToken(token);
  const submission = await prisma.clientSubmission.create({
    data: {
      tokenHash,
      status: "DRAFT",
      tokenExpiresAt: getTokenExpiryDate(params.expiresInDays ?? TOKEN_TTL_DAYS),
      ...(params.email ? { clientEmail: params.email } : {}),
      ...(params.name ? { clientName: params.name } : {}),
    },
  });

  return { ok: true as const, token, submissionId: submission.id };
}

export async function revokeOnboardingToken(token: string) {
  const session = await getCurrentAdminSession();
  if (!session) {
    return { ok: false as const, error: "Unauthorized" };
  }

  const tokenHash = hashToken(token);
  const submission = await prisma.clientSubmission.findUnique({ where: { tokenHash } });
  if (!submission) {
    return { ok: false as const, error: "Onboarding link not found" };
  }

  const updated = await prisma.clientSubmission.update({
    where: { tokenHash },
    data: { revokedAt: new Date() },
  });

  return { ok: true as const, submissionId: updated.id };
}


const START_ERROR_MESSAGE =
  "Onboarding is temporarily unavailable. Please try again in a moment, or email info@aivized.com if it persists.";

async function createDraftSubmission(tokenHash: string) {
  return prisma.clientSubmission.create({
    data: {
      tokenHash,
      status: "DRAFT",
      tokenExpiresAt: getTokenExpiryDate(TOKEN_TTL_DAYS),
    },
  });
}

export async function beginClientOnboarding() {
  try {
    const token = generateToken();
    const tokenHash = hashToken(token);
    let submission: Awaited<ReturnType<typeof createDraftSubmission>> | null = null;

    for (let attempt = 0; attempt < 2 && !submission; attempt += 1) {
      try {
        submission = await createDraftSubmission(tokenHash);
      } catch (error) {
        console.error(`[beginClientOnboarding] draft create failed (attempt ${attempt + 1})`, error);
        if (attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 400));
        }
      }
    }

    if (!submission) {
      return { ok: false as const, error: START_ERROR_MESSAGE };
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: CLIENT_TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * TOKEN_TTL_DAYS,
    });

    return { ok: true as const, token, submissionId: submission.id };
  } catch (error) {
    console.error("[beginClientOnboarding] unexpected error", error);
    return { ok: false as const, error: START_ERROR_MESSAGE };
  }
}

export async function getClientOnboardingSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENT_TOKEN_COOKIE)?.value;
  if (!token) {
    return { ok: false as const, error: "No onboarding session" };
  }

  const tokenHash = hashToken(token);
  const submission = await prisma.clientSubmission.findUnique({
    where: { tokenHash },
    include: { files: true },
  });

  if (!submission) {
    return { ok: false as const, error: "Onboarding session not found" };
  }

  const expired = Boolean(submission.tokenExpiresAt && submission.tokenExpiresAt.getTime() < Date.now());
  const revoked = Boolean(submission.revokedAt);

  return { ok: true as const, token, submission, expired, revoked };
}

