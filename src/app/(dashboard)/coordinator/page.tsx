"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { FileText, MapPin, Users, CheckCircle2, Loader2 } from "lucide-react";
import { getEventsByCoordinator, getReport } from "@/lib/db-service";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CoordinatorDashboard() {
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [reports, setReports] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const events = await getEventsByCoordinator(user.uid);
        setMyEvents(events);
        
        // Fetch reports for completed events
        const repMap: Record<string, any> = {};
        for (const e of events) {
          if (e.status === "completed") {
             const r = await getReport(e.id);
             if (r) repMap[e.id] = r;
          }
        }
        setReports(repMap);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
     return <DashboardLayout role="coordinator"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout role="coordinator">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Event Coordination</h1>
          <p className="text-muted-foreground">Manage your assigned chapters and submit execution reports.</p>
        </div>

        <div className="grid gap-6">
          {myEvents.map(event => {
            const hasReport = !!reports[event.id];
            const isCompleted = event.status === "completed" || hasReport;

            return (
              <Card key={event.id} className={`overflow-hidden border-border/40 shadow-sm ${isCompleted ? 'bg-surface-container-low' : 'bg-card'}`}>
                <div className="flex flex-col lg:flex-row">
                  <div className="w-full lg:w-64 h-48 lg:h-auto bg-muted shrink-0 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.bannerImageUrl} alt="" className="object-cover w-full h-full opacity-90 grayscale-[20%]" />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm border border-border/50">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="font-heading text-2xl font-bold text-primary">{event.title}</h2>
                        {isCompleted && (
                          <div className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200 font-medium">
                            <CheckCircle2 className="w-4 h-4" /> Report Submitted
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-muted-foreground mb-6 font-medium">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> {event.location}
                        </span>
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" /> {event.participantCount} Expected Px.
                        </span>
                        <span className="flex items-center gap-2">
                          <Users className="w-4 h-4" /> {event.volunteerCount} Volunteers
                        </span>
                      </div>

                      {hasReport ? (
                        <div className="bg-background rounded-lg p-4 border border-border/40 text-sm mt-4">
                          <h4 className="font-bold text-foreground mb-2 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> Submitted Notes
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">"{reports[event.id].notes}"</p>
                          <div className="mt-3 flex gap-2 overflow-x-auto">
                            {reports[event.id].attendanceImages?.map((img: string, i: number) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img key={i} src={img} alt="Attendance proof" className="w-16 h-16 object-cover rounded-md border border-border/50 shadow-sm" />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-none max-w-2xl leading-relaxed">
                          {event.description}
                        </p>
                      )}
                    </div>
                    
                    {!isCompleted && (
                      <div className="mt-6 pt-6 border-t border-border/20 flex flex-wrap gap-4 items-center">
                        <Link href={`/coordinator/events/${event.id}/report`} className={buttonVariants({ className: "font-medium h-10 px-6 shadow-sm" })}>
                          Submit Event Report
                        </Link>
                        <Link href={`/coordinator/events/${event.id}`} className={buttonVariants({ variant: "outline", className: "font-medium h-10 shadow-sm" })}>
                          View Volunteer Roster
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
