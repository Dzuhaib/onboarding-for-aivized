import { Body, Heading, Hr, Html, Preview, Section, Text } from "@react-email/components";

export interface OnboardingEmailPayload {
  fullName: string;
  workEmail: string;
  phoneNumber?: string;
  companyName?: string;
  country?: string;
  referredBy?: string;
  preferredChannel?: string;
  industry?: string;
  businessType?: string;
  businessDescription?: string;
  projectDescription?: string;
  services: string[];
  projectScope?: string;
  desiredStartDate?: string;
  projectUrgency?: string;
  budgetRange?: string;
}

const labelStyle = {
  margin: 0,
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#8a8f98",
};

const valueStyle = {
  margin: "4px 0 0",
  fontSize: "15px",
  lineHeight: "24px",
  color: "#16181d",
  whiteSpace: "pre-wrap" as const,
};

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div style={{ marginTop: "16px" }}>
      <p style={labelStyle}>{label}</p>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

export function NewSubmissionNotificationEmail({ payload }: { payload: OnboardingEmailPayload }) {
  const services = payload.services.length > 0 ? payload.services.join(", ") : undefined;

  return (
    <Html lang="en">
      <Preview>
        New onboarding submission from {payload.fullName}
        {payload.companyName ? ` (${payload.companyName})` : ""}
      </Preview>
      <Body style={{ fontFamily: "Manrope, Arial, sans-serif", backgroundColor: "#ffffff", color: "#16181d" }}>
        <Section style={{ padding: "32px 16px" }}>
          <div
            style={{
              maxWidth: 560,
              margin: "0 auto",
              backgroundColor: "#ffffff",
              border: "1px solid #e7e2d9",
              borderRadius: "12px",
              padding: "32px",
            }}
          >
            <Heading style={{ fontSize: "24px", margin: 0, color: "#16181d" }}>New onboarding submission</Heading>
            <Text style={{ marginTop: "12px", fontSize: "15px", lineHeight: "24px", color: "#4b5563" }}>
              Submitted {new Date().toLocaleString("en-GB", { timeZone: "Asia/Dubai" })} (Dubai time). Reply to this
              email to reach the client directly.
            </Text>

            <Hr style={{ borderColor: "#e7e2d9", margin: "24px 0 8px" }} />

            <Text style={{ ...labelStyle, marginTop: "16px", color: "#bc542f" }}>Client</Text>
            <Field label="Full name" value={payload.fullName} />
            <Field label="Work email" value={payload.workEmail} />
            <Field label="Phone number" value={payload.phoneNumber} />
            <Field label="Company" value={payload.companyName} />
            <Field label="Country" value={payload.country} />
            <Field label="Referred by" value={payload.referredBy} />
            <Field label="Preferred channel" value={payload.preferredChannel} />

            <Hr style={{ borderColor: "#e7e2d9", margin: "24px 0 8px" }} />

            <Text style={{ ...labelStyle, marginTop: "16px", color: "#bc542f" }}>Business</Text>
            <Field label="Industry" value={payload.industry} />
            <Field label="Business type" value={payload.businessType} />
            <Field label="Business description" value={payload.businessDescription} />

            <Hr style={{ borderColor: "#e7e2d9", margin: "24px 0 8px" }} />

            <Text style={{ ...labelStyle, marginTop: "16px", color: "#bc542f" }}>Project</Text>
            <Field label="Services" value={services} />
            <Field label="Project description" value={payload.projectDescription} />
            <Field label="Project scope" value={payload.projectScope} />

            <Hr style={{ borderColor: "#e7e2d9", margin: "24px 0 8px" }} />

            <Text style={{ ...labelStyle, marginTop: "16px", color: "#bc542f" }}>Timeline and budget</Text>
            <Field label="Desired start date" value={payload.desiredStartDate} />
            <Field label="Urgency" value={payload.projectUrgency} />
            <Field label="Budget range" value={payload.budgetRange} />

            <Text style={{ marginTop: "28px", fontSize: "13px", lineHeight: "22px", color: "#8a8f98" }}>
              Sent from the AIVized client onboarding form.
            </Text>
          </div>
        </Section>
      </Body>
    </Html>
  );
}
