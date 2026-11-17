"use server";

import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE, createAdminSessionToken, getAdminSession, verifyAdminPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewSubmissionNotification } from "@/lib/email";
import { updateSubmissionStatusSchema } from "@/lib/validations";

export async function signInAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { ok: false as const, error: "Invalid email or password" };
  }

  const valid = await verifyAdminPassword(password, admin.passwordHash);
  if (!valid) {
    return { ok: false as const, error: "Invalid email or password" };
  }

  const token = await createAdminSessionToken(admin.id, admin.email, admin.name);
  const cookieStore = await cookies();
  cookieStore.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return { ok: true as const };
}

export async function signOutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
  return getAdminSession(token);
}

async function requireAdmin() {
  const session = await getCurrentAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateSubmissionStatus(id: string, status: string) {
  await requireAdmin();
  const parsed = updateSubmissionStatusSchema.safeParse({ id, status });
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid status" };
  }

  const updated = await prisma.clientSubmission.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });

  return { ok: true as const, submissionId: updated.id, status: updated.status };
}

export async function updateSubmissionNotes(id: string, notes: string) {
  await requireAdmin();
  const updated = await prisma.clientSubmission.update({
    where: { id },
    data: { adminNotes: notes },
  });

  return { ok: true as const, submissionId: updated.id };
}

export async function resendSubmissionEmail(id: string) {
  await requireAdmin();
  const submission = await prisma.clientSubmission.findUnique({ where: { id } });
  if (!submission) {
    return { ok: false as const, error: "Submission not found" };
  }

  const result = await sendNewSubmissionNotification({ submissionId: id });
  return { ok: true as const, notificationStatus: result.ok ? (result.skipped ? "SKIPPED" : "SENT") : "FAILED" };
}

