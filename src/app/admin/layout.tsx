import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Badge } from "@/components/ui/badge";
import { SignOutButton } from "@/components/admin/SignOutButton";
import { getCurrentAdminSession } from "@/actions/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentAdminSession();

  return (
    <div className="min-h-screen bg-background">
      {session ? (
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 md:h-[72px]">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-4">
                <BrandLogo priority className="h-9" />
                <span className="hidden h-6 w-px bg-border sm:block" />
                <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
                  Admin
                </span>
              </Link>
              <Badge variant="outline" className="rounded-full border-border/80 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Console
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-muted-foreground md:inline">{session.email}</span>
              <Link
                href="/admin/submissions"
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Submissions
              </Link>
              <SignOutButton />
            </div>
          </div>
          <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </header>
      ) : null}
      {children}
    </div>
  );
}
