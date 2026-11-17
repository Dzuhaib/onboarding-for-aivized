import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Submission received",
};

export default function SubmissionSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">AIVized</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">Thank you. Your onboarding has been received.</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Our team has reviewed your submission and will reach out shortly to schedule the next step of your project.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/">Back to AIVized</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
