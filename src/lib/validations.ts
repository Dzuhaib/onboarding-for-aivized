import { z } from "zod";

function emptyToUndefined(value: unknown) {
  if (typeof value === "string" && value.trim().length === 0) return undefined;
  return value;
}

const optionalText = (max: number) => z.preprocess(emptyToUndefined, z.string().max(max).optional());

const optionalDate = z.preprocess(emptyToUndefined, z.string().optional());

export const clientInfoSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  workEmail: z.string().email("A valid work email is required").max(254),
  phoneNumber: optionalText(40),
  companyName: optionalText(160),
  country: optionalText(80),
  referredBy: optionalText(120),
  preferredChannel: z.enum(["Email", "WhatsApp", "Phone call", "Other"]).default("Email"),
});

export const businessInfoSchema = z.object({
  industry: optionalText(120),
  businessType: optionalText(80),
  businessDescription: optionalText(2000),
});

export const projectOverviewSchema = z.object({
  projectType: z.string().min(1, "Project type is required").max(120),
  projectDescription: optionalText(8000),
  projectScope: optionalText(8000),
  services: z.array(z.string()).min(1, "Select at least one service").max(12),
});

export const timelineBudgetSchema = z.object({
  desiredStartDate: optionalDate,
  projectUrgency: optionalText(40),
  budgetRange: optionalText(60),
});

export const finalSubmissionSchema = z.object({
  ...clientInfoSchema.shape,
  ...businessInfoSchema.shape,
  ...projectOverviewSchema.shape,
  ...timelineBudgetSchema.shape,
  confirmation: z.boolean().refine((value) => value === true, {
    message: "Please confirm that the information provided is accurate.",
  }),
});

export type FinalSubmissionValues = z.infer<typeof finalSubmissionSchema>;
