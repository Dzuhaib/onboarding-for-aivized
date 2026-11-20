import Link from "next/link";
import { ArrowRight, CalendarCheck, Check, CheckCircle2, Clock3, Mail, Rocket, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Submission received",
};

const NEXT_STEPS = [
  {
    icon: Clock3,
    title: "We review your details",
    body: "Our team reads through everything you shared and prepares a first point of view.",
    meta: "Within 1 business day",
  },
  {
    icon: CalendarCheck,
    title: "We schedule a discovery call",
    body: "We reach out on your preferred channel to talk scope, goals and timing.",
    meta: "Usually this week",
  },
  {
    icon: Rocket,
    title: "We send your plan",
    body: "You get a clear proposal with deliverables, milestones and next steps.",
    meta: "After the call",
  },
];

export default function SubmissionSuccessPage() {
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

      <main className="relative mx-auto max-w-3xl px-6 pb-20 pt-14 md:pt-20">
        <div
          aria-hidden
          className="animate-glow pointer-events-none absolute inset-x-0 -top-16 h-96 bg-[radial-gradient(65%_100%_at_50%_0%,hsl(16_60%_46%/0.10),transparent_72%)]"
        />

        <div className="relative flex flex-col items-center text-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <span aria-hidden className="animate-ripple absolute inset-0 rounded-full border border-primary/40" />
            <span aria-hidden className="animate-ripple absolute inset-0 rounded-full border border-primary/20 [animation-delay:1.2s]" />
            <span className="animate-pop relative flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary-muted/70 text-primary shadow-card">
              <CheckCircle2 className="h-8 w-8" />
            </span>
          </div>

          <span className="animate-rise mt-7 inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Onboarding received
          </span>

          <h1 className="animate-rise mt-6 max-w-2xl text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground md:text-6xl [animation-delay:80ms]">
            Thank you. We&apos;ve got everything we need.
          </h1>
          <p className="animate-rise mt-5 max-w-xl text-[17px] leading-8 text-muted-foreground [animation-delay:140ms]">
            Your answers were sent straight to the AIVIZED team. You don&apos;t need to keep this page open — we&apos;ll
            take it from here.
          </p>

          <div className="animate-rise mt-8 flex flex-wrap items-center justify-center gap-3 [animation-delay:200ms]">
            <Button asChild className="rounded-full px-7 shadow-primary">
              <a href="https://aivized.com" target="_blank" rel="noreferrer">
                Visit aivized.com
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="rounded-full border-border/80 bg-background/70 px-7">
              <a href="mailto:info@aivized.com">
                <Mail className="h-4 w-4" />
                Email the team
              </a>
            </Button>
          </div>

          <div className="animate-rise mt-6 flex items-center gap-2 text-xs text-muted-foreground [animation-delay:260ms]">
            <Check className="h-3.5 w-3.5 text-primary/70" />
            Sent to info@aivized.com — no account or follow-up form needed.
          </div>
        </div>

        <section className="animate-rise relative mt-14 [animation-delay:320ms]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">What happens next</h2>
            <span className="hidden text-xs text-muted-foreground sm:block">Three simple steps</span>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {NEXT_STEPS.map((step, index) => (
              <li
                key={step.title}
                className="group relative flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-card transition-shadow hover:shadow-lift"
              >
                <div aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-surface text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground">0{index + 1}</span>
                </div>
                <h3 className="mt-5 text-[15px] font-semibold tracking-tight text-foreground">{step.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">{step.body}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-primary">
                  <Clock3 className="h-3 w-3" />
                  {step.meta}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <div className="animate-rise relative mt-10 rounded-xl border border-primary/20 bg-surface/70 p-6 [animation-delay:400ms] md:p-7">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[15px] font-semibold tracking-tight text-foreground">Something changed or missing?</p>
              <p className="mt-1 text-[13px] leading-6 text-muted-foreground">
                Reply to our email or send an update — we&apos;ll attach it to your file.
              </p>
            </div>
            <Button asChild variant="outline" className="shrink-0 rounded-full border-border/80 bg-background/70">
              <a href="mailto:info@aivized.com?subject=Onboarding%20update">
                Send an update
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <footer className="relative mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>Copyright {new Date().getFullYear()} AIVIZED. All rights reserved.</p>
          <Link href="/" className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary">
            Back to the form
          </Link>
        </footer>
      </main>
    </div>
  );
}
