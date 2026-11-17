import { Body, Heading, Html, Preview, Section, Text } from "@react-email/components";

interface NewSubmissionNotificationEmailProps {
  submission: {
    id: string;
    clientName: string;
    clientEmail: string;
    companyName?: string | null;
    services: string[];
    status: string;
    submittedAt?: Date | null;
    budgetRange?: string | null;
    urgency?: string | null;
    files: { name: string; url: string; size: number; mimeType: string }[];
  };
  agency: {
    name: string;
    email: string;
  };
}

export function NewSubmissionNotificationEmail({ submission, agency }: NewSubmissionNotificationEmailProps) {
  return (
    <Html lang="en">
      <Body style={{ fontFamily: "Manrope, sans-serif", backgroundColor: "#ffffff", color: "#16181d" }}>
        <Section style={{ padding: "32px 16px" }}>
          <div style={{ maxWidth: 560, margin: "0 auto", backgroundColor: "#ffffff", border: "1px solid #e7e2d9", borderRadius: "12px", padding: "32px" }}>
            <Heading style={{ fontSize: "24px", margin: 0, color: "#16181d" }}>
              New onboarding submission
            </Heading>
            <Text style={{ marginTop: "16px", fontSize: "15px", lineHeight: "24px" }}>
              {submission.clientName} has submitted an onboarding form for {agency.name}.
            </Text>
            <Text style={{ marginTop: "8px", fontSize: "15px", lineHeight: "24px" }}>
              Company: {submission.companyName ?? "Not specified"}
            </Text>
            <Text style={{ marginTop: "8px", fontSize: "15px", lineHeight: "24px" }}>
              Services: {(submission.services ?? []).join(", ") || "Not specified"}
            </Text>
            <Text style={{ marginTop: "8px", fontSize: "15px", lineHeight: "24px" }}>
              Client email: {submission.clientEmail}
            </Text>
            <Text style={{ marginTop: "8px", fontSize: "15px", lineHeight: "24px" }}>
              Budget range: {submission.budgetRange ?? "Not specified"}
            </Text>
            {submission.files && submission.files.length > 0 ? (
              <Text style={{ marginTop: "8px", fontSize: "15px", lineHeight: "24px" }}>
                Uploaded assets: {(submission.files ?? []).map((file) => file.name).join(", ")}
              </Text>
            ) : null}
            <Text style={{ marginTop: "24px", fontSize: "14px", lineHeight: "24px", color: "#6b7280" }}>
              This is the beginning of a new AIVized client engagement.
            </Text>
          </div>
        </Section>
      </Body>
    </Html>
  );
}
