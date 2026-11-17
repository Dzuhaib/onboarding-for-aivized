import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { CreateOnboardingLink } from "@/components/admin/CreateOnboardingLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentAdminSession } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const [total, drafts, submitted, inReview] = await Promise.all([
    prisma.clientSubmission.count(),
    prisma.clientSubmission.count({ where: { status: "DRAFT" } }),
    prisma.clientSubmission.count({ where: { status: "SUBMITTED" } }),
    prisma.clientSubmission.count({ where: { status: "IN_REVIEW" } }),
  ]);

  const recent = await prisma.clientSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Total submissions", value: total },
    { label: "Drafts", value: drafts },
    { label: "Submitted", value: submitted },
    { label: "In review", value: inReview },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Admin Dashboard</h1>
          <p className="mt-2 text-muted-foreground">Overview of client onboarding activity.</p>
        </div>
        <Link href="/admin/submissions">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">View all submissions</Badge>
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <CreateOnboardingLink />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recent.map((submission) => (
              <Link key={submission.id} href={`/admin/submissions/${submission.id}`}>
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">{submission.clientName ?? "Unknown client"}</p>
                    <p className="text-sm text-muted-foreground">{submission.clientEmail ?? "No email"}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                      {submission.status}
                    </Badge>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(submission.createdAt)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


