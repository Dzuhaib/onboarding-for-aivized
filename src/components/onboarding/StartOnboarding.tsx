"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { beginClientOnboarding } from "@/actions/onboarding";

export function StartOnboarding({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [starting, setStarting] = useState(!initialError);
  const started = useRef(false);

  const start = useCallback(async () => {
    setStarting(true);
    setError(null);
    const result = await beginClientOnboarding();
    if (!result.ok) {
      setError(result.error);
      setStarting(false);
      return;
    }
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (initialError || started.current) return;
    started.current = true;
    void start();
  }, [initialError, start]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6 md:h-20">
          <div className="flex items-center gap-4">
            <BrandLogo priority className="h-8 md:h-9" />
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

      <main className="relative flex flex-1 items-center justify-center px-6 py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(65%_100%_at_50%_0%,hsl(16_60%_46%/0.09),transparent_72%)]"
        />
        <div className="relative w-full max-w-xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Onboarding
          </span>
          <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground md:text-5xl">
            Let&apos;s get your project started.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[17px] leading-8 text-muted-foreground">
            A short set of questions about your business and your project. It takes about ten minutes, and your progress
            is saved as you go.
          </p>

          {error ? (
            <div className="mt-10 rounded-xl border border-border/80 bg-card p-6 text-left shadow-card">
              <p className="text-sm text-foreground">{error}</p>
              <Button className="mt-4 rounded-full shadow-primary" onClick={start} disabled={starting}>
                {starting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Try again
              </Button>
            </div>
          ) : (
            <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-border/80 bg-card px-5 py-3 text-sm text-muted-foreground shadow-card">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Preparing your onboarding form...
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
