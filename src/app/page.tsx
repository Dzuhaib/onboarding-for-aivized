import Link from "next/link";
import { CheckCircle2, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { StartOnboarding } from "@/components/onboarding/StartOnboarding";
import { Button } from "@/components/ui/button";
import { getClientOnboardingSession } from "@/actions/onboarding";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let session: Awaited<ReturnType<typeof getClientOnboardingSession>> | null = null;
  let databaseError: string | undefined;

  try {
    session = await getClientOnboardingSession();
  } catch {
    databaseError = "We could not connect to the onboarding service. Please check your connection and try again.";
  }

  if (databaseError) {
    return <StartOnboarding initialError={databaseError} />;
  }

  if (session?.ok) {
    if (session.submission.status !== "DRAFT") {
      return <SubmittedNotice status={session.submission.status} submittedAt={session.submission.submittedAt} />;
    }

    return (
      <OnboardingForm
        token={session.token}
        submission={session.submission}
        expired={session.expired}
        revoked={session.revoked}
      />
    );
  }

  return <StartOnboarding />;
}

function SubmittedNotice({ status, submittedAt }: { status: string; submittedAt: Date | null }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6 md:h-20">
          <div className="flex items-center gap-4">
            <BrandLogo className="h-8 md:h-9" />
            <span className="hidden h-7 w-px bg-border md:block" />
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground md:block">
              Client onboarding
            </span>
          </div>
          <span className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure portal
          </span>
        </div>
        <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <main className="relative mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(65%_100%_at_50%_0%,hsl(16_60%_46%/0.09),transparent_72%)]"
        />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary-muted/60 text-primary shadow-card">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="relative mt-8 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-foreground md:text-5xl">
          Your onboarding has been received.
        </h1>
        <p className="relative mt-5 max-w-lg text-[17px] leading-8 text-muted-foreground">
          Thank you. Our team is reviewing your details and will reach out shortly with the next steps.
        </p>
        <div className="relative mt-6 inline-flex items-center gap-3 rounded-full border border-border/80 bg-surface px-4 py-2 text-xs text-muted-foreground">
          <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            {status}
          </span>
          {submittedAt ? <span>Submitted {formatDateTime(submittedAt)}</span> : null}
        </div>
        <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild className="rounded-full px-8 shadow-primary">
            <Link href="/submission/success">View confirmation</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-border/80 px-8">
            <Link href="mailto:info@aivized.com">Contact the team</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
