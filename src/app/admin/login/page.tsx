"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { signInAdmin } from "@/actions/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await signInAdmin(email, password);
    setPending(false);
    if (result.ok) {
      router.push("/admin");
      router.refresh();
      return;
    }
    setError(result.error ?? "Unable to sign in");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-surface/60 px-6 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,hsl(16_60%_46%/0.10),transparent_70%)]"
      />
      <div className="relative w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <BrandLogo priority className="h-9" />
          <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Admin console
          </span>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/70 bg-card p-8 shadow-lift">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Review client onboarding submissions and manage links.</p>
          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full rounded-full shadow-primary" disabled={pending}>
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized AIVIZED team members only.
        </p>
      </div>
    </main>
  );
}
