import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SubmissionStatusActions } from "@/components/admin/SubmissionStatusActions";
import { getCurrentAdminSession } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

function DetailRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  let display = "Not provided";
  if (typeof value === "boolean") display = value ? "Yes" : "No";
  else if (value !== undefined && value !== null && String(value).trim().length > 0) display = String(value);

  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{display}</dd>
    </div>
  );
}

export default async function AdminSubmissionDetailPage({ params }: Props) {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const submission = await prisma.clientSubmission.findUnique({
    where: { id },
    include: { files: true },
  });

  if (!submission) {
    redirect("/admin/submissions");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/submissions" className="text-sm text-muted-foreground hover:text-foreground">
            Back to submissions
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {submission.clientName ?? "Unknown client"}
          </h1>
          <p className="mt-2 text-muted-foreground">{submission.companyName ?? "No company provided"}</p>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
            {submission.status}
          </Badge>
          <p className="mt-2 text-xs text-muted-foreground">Created {formatDateTime(submission.createdAt)}</p>
        </div>
      </div>

      <div className="mt-8">
        <SubmissionStatusActions submissionId={submission.id} status={submission.status} />
      </div>

      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Client information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow label="Full name" value={submission.clientName} />
              <DetailRow label="Work email" value={submission.clientEmail} />
              <DetailRow label="Phone" value={submission.clientPhone} />
              <DetailRow label="Company" value={submission.companyName} />
              <DetailRow label="Country" value={submission.country} />
              <DetailRow label="Referred by" value={submission.referredBy} />
              <DetailRow label="Preferred channel" value={submission.preferredChannel} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2">
              <DetailRow label="Industry" value={submission.industry} />
              <DetailRow label="Business type" value={submission.businessType} />
            </dl>
            <Separator className="my-5" />
            <DetailRow label="Business description" value={submission.businessDescription} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project overview</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2">
              <DetailRow label="Project type" value={submission.projectType} />
              <DetailRow label="Services" value={submission.services.join(", ")} />
            </dl>
            <Separator className="my-5" />
            <dl className="grid gap-5">
              <DetailRow label="Description" value={submission.projectDescription} />
              <DetailRow label="Scope" value={submission.projectScope} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline and budget</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-3">
              <DetailRow label="Desired start" value={submission.desiredStartDate ? formatDateTime(submission.desiredStartDate) : null} />
              <DetailRow label="Urgency" value={submission.projectUrgency} />
              <DetailRow label="Budget range" value={submission.budgetRange} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Uploaded files</CardTitle>
          </CardHeader>
          <CardContent>
            {submission.files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files uploaded.</p>
            ) : (
              <ul className="space-y-3">
                {submission.files.map((file) => (
                  <li key={file.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.max(1, Math.round(file.size / 1024))} KB - {file.mimeType}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={`/api/files/${file.id}`} prefetch={false}>Download</Link>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission metadata</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow label="Submission ID" value={submission.id} />
              <DetailRow label="Status" value={submission.status} />
              <DetailRow label="Notification" value={submission.notificationStatus} />
              <DetailRow label="Submitted at" value={submission.submittedAt ? formatDateTime(submission.submittedAt) : null} />
              <DetailRow label="Token expires" value={submission.tokenExpiresAt ? formatDateTime(submission.tokenExpiresAt) : null} />
              <DetailRow label="Revoked" value={Boolean(submission.revokedAt)} />
            </dl>
            <Separator className="my-5" />
            <DetailRow label="Admin notes" value={submission.adminNotes} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
