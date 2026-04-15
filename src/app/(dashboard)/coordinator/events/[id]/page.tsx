"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { MOCK_EVENTS, MOCK_USERS, MOCK_VOLUNTEER_APPLICATIONS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, CheckSquare, FileText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function CoordinatorEventRosterPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const event = MOCK_EVENTS.find(e => e.id === resolvedParams.id && e.coordinatorId === "u4");
  
  if (!event) {
    notFound();
  }

  const isCompleted = event.status === "completed" || !!event.coordinatorReport;

  // Derive mock roster strictly matching this event
  const applications = MOCK_VOLUNTEER_APPLICATIONS.filter(a => a.eventId === event.id);
  // Add some fake dummy data so it feels dense if empty
  const mockRoster = applications.map((app, i) => {
    const user = MOCK_USERS.find(u => u.id === app.volunteerId) || MOCK_USERS[1];
    return { ...app, user: user };
  });

  // Pad the roster if too small to look believable for presentation
  const extendedRoster = [...mockRoster];
  if (extendedRoster.length < 5) {
     for (let i = 0; i < 6; i++) {
         extendedRoster.push({
             id: `mock-roster-${i}`,
             eventId: event.id,
             volunteerId: `mock-${i}`,
             status: "approved",
             user: { id: `mock-${i}`, name: `Local Volunteer ${i+1}`, email: `vol${i}@example.com`, role: "volunteer", isApproved: true }
         });
     }
  }

  return (
    <DashboardLayout role="coordinator">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <Link href="/coordinator" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Assignments
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Event Roster</h1>
            {!isCompleted && (
              <Link href={`/coordinator/events/${event.id}/report`} className={buttonVariants({ className: "shadow-md" })}>
                <FileText className="w-4 h-4 mr-2" /> Start Report
              </Link>
            )}
          </div>
          <p className="text-muted-foreground">Managing active volunteers for <strong className="text-foreground">{event.title}</strong>.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 shadow-sm border-border/40">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-container-low text-xs uppercase text-muted-foreground border-b border-border/20">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Volunteer Name</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Contact E-Mail</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Clearance</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-right">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {extendedRoster.map(row => (
                      <tr key={row.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{row.user.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{row.user.email}</td>
                        <td className="px-6 py-4">
                           <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50 rounded-sm">Verified</Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <Button variant="outline" size="sm" className="h-8 gap-2 bg-surface text-muted-foreground hover:text-foreground hover:border-foreground/30">
                             <CheckSquare className="w-3.5 h-3.5" /> Mark Present
                           </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm border-border/40 bg-surface-container-low">
              <CardContent className="p-6 space-y-4">
                 <h3 className="font-heading text-xl font-bold border-b border-border/40 pb-4">Event Context</h3>
                 <div className="space-y-3 text-sm">
                    <p><span className="font-bold text-muted-foreground block text-xs uppercase tracking-wider mb-1">Date</span> {new Date(event.date).toLocaleDateString()}</p>
                    <p><span className="font-bold text-muted-foreground block text-xs uppercase tracking-wider mb-1">Location</span> {event.location}</p>
                    <p><span className="font-bold text-muted-foreground block text-xs uppercase tracking-wider mb-1">Status</span> {event.status.toUpperCase()}</p>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
