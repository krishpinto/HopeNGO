import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-transparent bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-2xl tracking-tighter text-primary">
          HOPENGO
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">Home</Link>
          <Link href="/events" className="text-foreground/80 hover:text-foreground transition-colors">Events</Link>
          <Link href="/donations" className="text-foreground/80 hover:text-foreground transition-colors">Donations</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex hover:bg-primary/5 hover:text-primary transition" })}>
            Sign In
          </Link>
          <Link href="/donations" className={buttonVariants({ className: "rounded-md bg-gradient-to-r from-primary to-[#2d6a4f] shadow-lg shadow-primary/20 hover:text-white dark:hover:text-white" })}>
            Donate Now
          </Link>
        </div>
      </div>
    </header>
  );
}
