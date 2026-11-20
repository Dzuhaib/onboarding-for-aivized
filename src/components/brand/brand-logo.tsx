import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  priority,
  href,
}: {
  className?: string;
  priority?: boolean;
  href?: string;
}) {
  const image = (
    <Image
      src="/logo-transparent.png"
      alt="AIVIZED"
      width={958}
      height={194}
      priority={priority}
      className={cn("h-8 w-auto", className)}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} aria-label="AIVIZED home" className="inline-flex shrink-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      {image}
    </Link>
  );
}

export function BrandMark({ className, href }: { className?: string; href?: string }) {
  const image = (
    <Image
      src="/logo-mark-transparent.png"
      alt="AIVIZED"
      width={512}
      height={512}
      className={cn("h-10 w-10 rounded-xl", className)}
    />
  );

  if (!href) return image;

  return (
    <Link href={href} aria-label="AIVIZED home" className="inline-flex shrink-0 rounded-xl">
      {image}
    </Link>
  );
}
