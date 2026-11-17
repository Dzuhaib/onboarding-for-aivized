"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Clock3, Loader2, RotateCcw, ShieldCheck } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  BUDGET_RANGES,
  BUSINESS_TYPES,
  COMMUNICATION_CHANNELS,
  COUNTRIES,
  INDUSTRIES,
  PROJECT_TYPES,
  PROJECT_URGENCIES,
  REFERRAL_OPTIONS,
} from "@/lib/constants";
import { submitOnboarding } from "@/actions/onboarding";
import { finalSubmissionSchema } from "@/lib/validations";
import { cn } from "@/lib/utils";

export interface OnboardingFormValues {
  fullName: string;
  workEmail: string;
  phoneNumber?: string;
  companyName?: string;
  country?: string;
  referredBy?: string;
  preferredChannel: string;
  industry?: string;
  businessType?: string;
  businessDescription?: string;
  projectType: string;
  projectDescription?: string;
  projectScope?: string;
  services: string[];
  desiredStartDate?: string;
  projectUrgency?: string;
  budgetRange?: string;
  confirmation: boolean;
}

const EMPTY_VALUES: OnboardingFormValues = {
  fullName: "",
  workEmail: "",
  phoneNumber: "",
  companyName: "",
  country: "",
  referredBy: "",
  preferredChannel: "Email",
  industry: "",
  businessType: "",
  businessDescription: "",
  projectType: "",
  projectDescription: "",
  projectScope: "",
  services: [],
  desiredStartDate: "",
  projectUrgency: "",
  budgetRange: "",
  confirmation: false,
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-card">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 border-b border-border/60 bg-surface/70 px-6 py-5 md:px-8">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-background text-[11px] font-bold tracking-[0.08em] text-primary shadow-sm">
          {step}
        </span>
        <div className="space-y-1">
          <CardTitle className="text-[17px] font-semibold tracking-tight md:text-lg">{title}</CardTitle>
          {description ? <CardDescription className="text-[13px] leading-5">{description}</CardDescription> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-6 py-7 md:px-8">{children}</CardContent>
    </Card>
  );
}

export function OnboardingForm() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(finalSubmissionSchema),
    defaultValues: EMPTY_VALUES,
    mode: "onSubmit",
  });

  const services = watch("services") ?? [];

  async function handleSubmitFinal(values: OnboardingFormValues) {
    setSubmitting(true);
    const result = await submitOnboarding(values);
    setSubmitting(false);

    if (!result.ok) {
      toast.error("Submission failed", { description: result.error });
      if (result.issues) {
        for (const issue of result.issues as { path: string; message: string }[]) {
          if (!issue.path) continue;
          setError(issue.path as never, { type: "validation", message: issue.message });
        }
      }
      return;
    }

    toast.success("Onboarding submitted", { description: "Our team will review your details shortly." });
    window.location.href = "/submission/success";
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-6 md:h-20">
          <div className="flex min-w-0 items-center gap-4">
            <BrandLogo priority className="h-8 md:h-9" />
            <span className="hidden h-7 w-px bg-border md:block" />
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground md:block">
              Client onboarding
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground lg:flex">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure portal
            </span>
            <Button
              variant="outline"
              size="sm"
              aria-label="Start over"
              className="rounded-full border-border/80 bg-background/70 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground sm:px-4"
              onClick={() => {
                reset(EMPTY_VALUES);
                clearErrors();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Start over</span>
            </Button>
          </div>
        </div>
        <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      </header>

      <main className="relative mx-auto max-w-4xl px-6 pb-20 pt-14 md:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-12 h-80 bg-[radial-gradient(65%_100%_at_50%_0%,hsl(16_60%_46%/0.09),transparent_72%)]"
        />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Onboarding
          </span>
          <h1 className="mt-6 text-balance text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.04em] text-foreground md:text-6xl">
            Let&apos;s get your project started.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] leading-8 text-muted-foreground">
            Tell us about your business and your project. Everything is on this single page and is sent straight to our
            team when you submit.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary/70" />
              About 10 minutes
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary/70" />
              Confidential by default
            </span>
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary/70" />
              One page, no account needed
            </span>
          </div>
        </div>

        <form className="relative mt-12 space-y-6" onSubmit={(event) => void handleSubmit(handleSubmitFinal)(event)}>
          <Section step="01" title="Client information" description="Tell us who you are and how to reach you.">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" {...register("fullName")} placeholder="Jane Cooper" />
                <FieldError message={errors.fullName?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workEmail">Work email</Label>
                <Input id="workEmail" type="email" {...register("workEmail")} placeholder="jane@company.com" />
                <FieldError message={errors.workEmail?.message} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input id="phoneNumber" {...register("phoneNumber")} placeholder="+971 50 000 0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company / business name</Label>
                <Input id="companyName" {...register("companyName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <option value="">Select country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referredBy">Referred by</Label>
                <Controller
                  control={control}
                  name="referredBy"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <option value="">Select a team member</option>
                      {REFERRAL_OPTIONS.map((member) => (
                        <option key={member} value={member}>
                          {member}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="preferredChannel">Preferred communication channel</Label>
                <Controller
                  control={control}
                  name="preferredChannel"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      {COMMUNICATION_CHANNELS.map((channel) => (
                        <option key={channel} value={channel}>
                          {channel}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </Section>

          <Section step="02" title="Business information" description="Help us understand your business.">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="industry">Business industry</Label>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessType">Business type</Label>
                <Controller
                  control={control}
                  name="businessType"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <option value="">Select type</option>
                      {BUSINESS_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessDescription">Short business description</Label>
              <Textarea id="businessDescription" {...register("businessDescription")} placeholder="What does your business do?" />
            </div>
          </Section>

          <Section step="03" title="Project overview" description="What do you want to build and why.">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project type</Label>
              <Controller
                control={control}
                name="projectType"
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <option value="">Select project type</option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                )}
              />
              <FieldError message={errors.projectType?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Project description</Label>
              <Textarea id="projectDescription" {...register("projectDescription")} placeholder="Describe the project in your own words." />
            </div>
            <div className="space-y-3">
              <Label>Services required</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {PROJECT_TYPES.map((type) => {
                  const selected = services.includes(type);
                  return (
                    <label
                      key={type}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-[13px] font-medium transition-all",
                        selected
                          ? "border-primary/50 bg-primary-muted/70 text-foreground shadow-sm"
                          : "border-border/80 bg-background text-foreground/80 hover:border-primary/30 hover:bg-surface"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={selected}
                        onChange={(event) =>
                          setValue(
                            "services",
                            event.target.checked ? [...services, type] : services.filter((service) => service !== type),
                            { shouldValidate: true }
                          )
                        }
                      />
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                          selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"
                        )}
                      >
                        {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                      </span>
                      <span>{type}</span>
                    </label>
                  );
                })}
              </div>
              <FieldError message={errors.services?.message} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectScope">Project scope</Label>
              <Textarea id="projectScope" {...register("projectScope")} placeholder="Pages, screens, features or deliverables you expect." />
            </div>
          </Section>

          <Section step="04" title="Timeline and budget" description="When you want to start and what it is worth.">
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="desiredStartDate">Desired start date</Label>
                <Input id="desiredStartDate" type="date" {...register("desiredStartDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectUrgency">Project urgency</Label>
                <Controller
                  control={control}
                  name="projectUrgency"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <option value="">Select urgency</option>
                      {PROJECT_URGENCIES.map((urgency) => (
                        <option key={urgency} value={urgency}>
                          {urgency}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget range</Label>
                <Controller
                  control={control}
                  name="budgetRange"
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <option value="">Select budget range</option>
                      {BUDGET_RANGES.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </Section>

          <Card className="relative overflow-hidden border-primary/20 bg-surface/70 shadow-card">
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 px-6 pb-2 pt-6 md:px-8">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-background text-[11px] font-semibold tracking-[0.08em] text-primary shadow-sm">
                05
              </span>
              <div className="space-y-1">
                <CardTitle className="text-[17px] font-semibold tracking-tight md:text-lg">Review and submit</CardTitle>
                <CardDescription className="text-[13px] leading-5">
                  Confirm that everything is accurate before sending it to our team.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-6 pb-7 pt-4 md:px-8">
              <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background p-4 shadow-sm">
                <Controller
                  control={control}
                  name="confirmation"
                  render={({ field }) => (
                    <Checkbox
                      id="confirmation"
                      checked={Boolean(field.value)}
                      onCheckedChange={(checked) => field.onChange(checked === true)}
                    />
                  )}
                />
                <div className="space-y-1">
                  <Label htmlFor="confirmation">I confirm that the information provided is accurate.</Label>
                  <p className="text-sm text-muted-foreground">
                    We will use these details to prepare the next steps for your project.
                  </p>
                  <FieldError message={errors.confirmation?.message} />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" className="rounded-full px-7 shadow-primary" disabled={submitting}>
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit onboarding
                </Button>
              </div>

              <p className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" />
                Your details are emailed directly to the AIVIZED team and are not stored on this site.
              </p>
            </CardContent>
          </Card>
        </form>

        <footer className="relative mt-14 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>Copyright {new Date().getFullYear()} AIVIZED. All rights reserved.</p>
          <p>
            Questions?{" "}
            <a
              href="mailto:info@aivized.com"
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
            >
              info@aivized.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}
