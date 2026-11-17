"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOutAdmin } from "@/actions/admin";

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="rounded-full text-muted-foreground"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await signOutAdmin();
          router.push("/admin/login");
          router.refresh();
        })
      }
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </Button>
  );
}
