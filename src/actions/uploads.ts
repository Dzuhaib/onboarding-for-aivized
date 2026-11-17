"use server";

import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/tokens";
import { uploadFileToStorage } from "@/lib/storage";

export async function uploadOnboardingFile(token: string, formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false as const, error: "No file provided" };
  }

  const tokenHash = hashToken(token);
  const submission = await prisma.clientSubmission.findUnique({
    where: { tokenHash },
  });

  if (!submission) {
    return { ok: false as const, error: "Onboarding link not found" };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await uploadFileToStorage({
    token,
    name: file.name,
    mimeType: file.type,
    size: file.size,
    content: buffer,
  });

  const record = await prisma.onboardingFile.create({
    data: {
      submissionId: submission.id,
      name: uploaded.name,
      key: uploaded.key,
      url: uploaded.url,
      size: uploaded.size,
      mimeType: uploaded.mimeType,
    },
  });

  return { ok: true as const, fileId: record.id, key: record.key };
}
