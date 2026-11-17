"use client";

import { useState } from "react";
import { Check, Copy, Link2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOnboardingToken } from "@/actions/onboarding";

export function CreateOnboardingLink() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const result = await createOnboardingToken({
      email: email.trim() || undefined,
      name: name.trim() || undefined,
    });
    setPending(false);

    if (!result.ok) {
      toast.error("Could not create onboarding link");
      return;
    }

    const url = `${window.location.origin}/onboard/${result.token}`;
    setLink(url);
    setCopied(false);
    toast.success("Onboarding link created", { description: "Share it with your client." });
  }

  async function handleCopy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Copy failed. Select and copy the link manually.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an onboarding link</CardTitle>
        <CardDescription>Generate a secure, single-client link to send to a new client.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
          <div className="space-y-2">
            <Label htmlFor="link-name">Client name</Label>
            <Input id="link-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Jane Cooper" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="link-email">Client email</Label>
            <Input
              id="link-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="jane@company.com"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" className="rounded-full" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
              {pending ? "Creating link..." : "Generate link"}
            </Button>
          </div>
        </form>

        {link ? (
          <div className="space-y-2 rounded-lg border border-border bg-surface/60 p-4">
            <Label htmlFor="generated-link">Onboarding link</Label>
            <div className="flex flex-wrap items-center gap-2">
              <Input id="generated-link" readOnly value={link} className="flex-1" onFocus={(event) => event.target.select()} />
              <Button type="button" variant="outline" className="rounded-full" onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              The link is valid for 30 days. Only a hash of the token is stored on the server.
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
