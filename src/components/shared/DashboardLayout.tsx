"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LogOut, Home, Calendar, Users, Briefcase, Award, Heart } from "lucide-react";

interface SidebarItem {
  icon: any;
  label: string;
  href: string;
}

const ADMIN_LINKS: SidebarItem[] = [
  { icon: Home, label: "Overview", href: "/admin" },
  { icon: Calendar, label: "Events", href: "/admin/events" },
  { icon: Users, label: "Volunteers", href: "/admin/volunteers" },
  { icon: Briefcase, label: "Assignments", href: "/admin/assignments" },
  { icon: Heart, label: "Donations", href: "/admin/donations" },
];

const VOLUNTEER_LINKS: SidebarItem[] = [
  { icon: Home, label: "Dashboard", href: "/volunteer" },
  { icon: Award, label: "Certificates", href: "/volunteer/certificates" },
];

const COORDINATOR_LINKS: SidebarItem[] = [
  { icon: Home, label: "Assigned Events", href: "/coordinator" },
];

export function DashboardLayout({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "admin" | "volunteer" | "coordinator";
}) {
  const pathname = usePathname();
  
  const links = 
    role === "admin" ? ADMIN_LINKS : 
    role === "volunteer" ? VOLUNTEER_LINKS : 
    COORDINATOR_LINKS;

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-surface-container-low hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border/20">
          <Link href="/" className="font-heading font-bold text-2xl tracking-tighter text-primary">
            HOPENGO
          </Link>
        </div>
        
        <div className="px-6 py-4 flex-1 space-y-1">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase mb-4 mt-2">
            {role} Portal
          </p>
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-surface-container-highest",
                  isActive ? "bg-surface-container-highest text-primary font-semibold" : "text-foreground/80 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.label}
              </Link>
            )
          })}
        </div>
        
        <div className="p-4 border-t border-border/20">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" />
            Switch Role / Exit
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border/20 bg-surface-container-lowest/50 backdrop-blur flex flex-shrink-0 items-center px-6 md:hidden">
          <Link href="/" className="font-heading font-bold text-xl tracking-tighter text-primary mr-auto">
            HOPENGO
          </Link>
        </header>
        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
