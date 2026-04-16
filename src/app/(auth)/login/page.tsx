"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants, Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUser } from "@/lib/db-service";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Fetch user role from Firestore to route correctly
      const userData = await getUser(cred.user.uid);
      
      if (userData?.role === "admin") {
        router.push("/admin");
      } else if (userData?.role === "coordinator") {
        router.push("/coordinator");
      } else {
        router.push("/volunteer");
      }
    } catch (err: any) {
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password Sign-In is disabled. Please enable it in Firebase Console -> Authentication.");
      } else {
        setError("Failed to log in. Have you seeded the database?");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] space-y-8 bg-card border border-border/40 p-8 rounded-2xl shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 duration-500">
      <div className="space-y-2 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">Enter your credentials to access your dashboard</p>
      </div>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="jane@example.com" 
            className="h-11 bg-surface-container-low" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Password</Label>
            <Link href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input 
            id="password" 
            type="password" 
            className="h-11 bg-surface-container-low" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md border border-red-100 font-medium">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full h-11 font-bold tracking-wide flex items-center justify-center">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In"}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground pt-4 border-t border-border/20">
        Demo Accounts:
        <div className="mt-2 text-xs flex flex-col gap-1 text-foreground">
           <p><strong>Admin:</strong> sarah@hopengo.org</p>
           <p><strong>Coordinator:</strong> david@hopengo.org</p>
           <p><strong>Volunteer:</strong> john@example.com</p>
           <p><strong>Password:</strong> password123</p>
        </div>
      </div>
    </div>
  );
}
