import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="w-full max-w-[400px] space-y-8 bg-card border border-border/40 p-8 rounded-2xl shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Enter your credentials to access your dashboard</p>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email</Label>
          <Input id="email" type="email" placeholder="jane@example.com" className="h-11 bg-surface-container-low" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Password</Label>
            <Link href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input id="password" type="password" className="h-11 bg-surface-container-low" />
        </div>
        <Link href="/volunteer" className={buttonVariants({ className: "w-full h-11 font-bold tracking-wide flex items-center justify-center" })}>
          Sign In
        </Link>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/20">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create one now
        </Link>
      </div>
    </div>
  );
}
