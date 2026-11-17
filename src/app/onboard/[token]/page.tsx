import { notFound } from "next/navigation";

import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { hashToken } from "@/lib/tokens";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function OnboardingPage({ params }: Props) {
  const { token } = await params;
  const tokenHash = hashToken(token);
  const submission = await prisma.clientSubmission.findUnique({
    where: { tokenHash },
    include: { files: true },
  });

  if (!submission) {
    notFound();
  }

  const expired = Boolean(submission.tokenExpiresAt && submission.tokenExpiresAt.getTime() < Date.now());
  const revoked = Boolean(submission.revokedAt);

  return <OnboardingForm token={token} submission={submission} expired={expired} revoked={revoked} />;
}
