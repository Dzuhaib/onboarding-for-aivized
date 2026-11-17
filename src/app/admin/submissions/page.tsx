import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentAdminSession } from "@/actions/admin";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";

export default async function AdminSubmissionsPage() {
  const session = await getCurrentAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const submissions = await prisma.clientSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Submissions</h1>
          <p className="mt-2 text-muted-foreground">All client onboarding submissions.</p>
        </div>
        <Link href="/admin">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">Back to dashboard</Badge>
        </Link>
      </div>

      <div className="mt-10 space-y-4">
        {submissions.map((submission) => (
          <Link key={submission.id} href={`/admin/submissions/${submission.id}`}>
            <div className="rounded-xl border bg-card p-6 shadow-card transition-colors hover:shadow-lift">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-foreground">{submission.clientName ?? "Unknown client"}</p>
                  <p className="text-sm text-muted-foreground">{submission.clientEmail ?? "No email"}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{submission.companyName ?? "No company"}</p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                    {submission.status}
                  </Badge>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(submission.createdAt)}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


