import Image from "next/image";

import { cn } from "@/lib/utils";

export function BrandLogo({ className, priority }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/logo-transparent.png"
      alt="AIVIZED"
      width={958}
      height={194}
      priority={priority}
      className={cn("h-8 w-auto", className)}
    />
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-mark-transparent.png"
      alt="AIVIZED"
      width={512}
      height={512}
      className={cn("h-10 w-10 rounded-xl", className)}
    />
  );
}
