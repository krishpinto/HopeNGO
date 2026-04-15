"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function DemoNav() {
  return (
    <div className="fixed bottom-4 right-4 flex gap-2 z-50 p-2 bg-surface-container-lowest/80 backdrop-blur-md border border-border/20 shadow-[0_10px_40px_-10px_rgba(25,28,26,0.1)] rounded-full items-center">
      <span className="text-xs font-semibold px-2 uppercase tracking-tight text-primary">Demo Routes:</span>
      <Link href="/admin" className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full text-xs h-7" })}>
        Admin
      </Link>
      <Link href="/volunteer" className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full text-xs h-7" })}>
        Volunteer
      </Link>
      <Link href="/coordinator" className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full text-xs h-7" })}>
        Coordinator
      </Link>
      <Link href="/" className={buttonVariants({ variant: "outline", size: "sm", className: "rounded-full text-xs h-7" })}>
        Public
      </Link>
    </div>
  );
}
