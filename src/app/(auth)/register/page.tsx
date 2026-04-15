import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="w-full max-w-[500px] space-y-8 bg-card border border-border/40 p-8 rounded-2xl shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Create an Account</h1>
        <p className="text-muted-foreground text-sm">Join the HopeNGO community to start making an impact.</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">First Name</Label>
            <Input id="firstName" placeholder="Jane" className="h-11 bg-surface-container-low" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Last Name</Label>
            <Input id="lastName" placeholder="Doe" className="h-11 bg-surface-container-low" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email Address</Label>
          <Input id="email" type="email" placeholder="jane@example.com" className="h-11 bg-surface-container-low" />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider font-bold text-muted-foreground">I want to join as a:</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="relative">
              <input type="radio" name="role" id="role-volunteer" className="peer sr-only" defaultChecked />
              <Label htmlFor="role-volunteer" className="flex flex-col items-center justify-center p-4 border-2 border-transparent bg-surface-container-low rounded-xl cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-muted">
                <span className="font-bold text-sm">Volunteer</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Participate in drives</span>
              </Label>
            </div>
            <div className="relative">
              <input type="radio" name="role" id="role-coordinator" className="peer sr-only" />
              <Label htmlFor="role-coordinator" className="flex flex-col items-center justify-center p-4 border-2 border-transparent bg-surface-container-low rounded-xl cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-muted">
                <span className="font-bold text-sm">Coordinator</span>
                <span className="text-xs text-muted-foreground text-center mt-1">Manage local events</span>
              </Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Password</Label>
          <Input id="password" type="password" className="h-11 bg-surface-container-low" />
          <p className="text-[10px] text-muted-foreground pt-1">Must be at least 8 characters long and contain a number.</p>
        </div>

        <Link href="/volunteer" className={buttonVariants({ className: "w-full h-12 font-bold tracking-wide mt-2 flex items-center justify-center" })}>
          Create Account
        </Link>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/20">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
