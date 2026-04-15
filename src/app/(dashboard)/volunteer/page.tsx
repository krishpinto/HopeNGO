"use client";

import Link from "next/link";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { MOCK_EVENTS, MOCK_VOLUNTEER_APPLICATIONS } from "@/lib/mock-data";
import { MapPin, Calendar as CalendarIcon, CheckCircle2, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function VolunteerDashboard() {
  const { appliedEvents } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Current user mock ID is "u2"
  const baselineApplications = MOCK_VOLUNTEER_APPLICATIONS.filter(a => a.volunteerId === "u2").map(a => a.eventId);
  const myAppliedEventIds = Array.from(new Set([...baselineApplications, ...appliedEvents]));
  
  const availableEvents = mounted ? MOCK_EVENTS.filter(e => 
    e.status !== "completed" && 
    !myAppliedEventIds.includes(e.id) &&
    e.volunteerCount < (e.maxVolunteers || 999)
  ) : [];

  const myEventDetails = myAppliedEventIds.map(id => MOCK_EVENTS.find(e => e.id === id)).filter(Boolean);

  return (
    <DashboardLayout role="volunteer">
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">My Applications</h1>
            <p className="text-muted-foreground mb-6">Track your volunteering status across HopeNGO events.</p>
          </div>
          
          <div className="space-y-4">
            {!mounted ? null : myEventDetails.length === 0 ? (
              <p className="text-muted-foreground italic">You haven't applied to any events yet.</p>
            ) : (
              myEventDetails.map((event) => {
                if (!event) return null;
                // If it's a built-in mock app it might be approved, otherwise pending
                const builtinApp = MOCK_VOLUNTEER_APPLICATIONS.find(a => a.eventId === event.id && a.volunteerId === "u2");
                const isApproved = builtinApp?.status === "approved" || event.id === "e3" || event.id === "e12"; // mock logic

                return (
                  <Card key={event.id} className="overflow-hidden border-border/40 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-48 h-32 sm:h-auto bg-muted relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={event.bannerImageUrl} alt="" className="object-cover w-full h-full" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-center">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-heading text-xl font-bold">{event.title}</h3>
                          {isApproved ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 flex items-center gap-1.5 px-2.5 py-0.5 shadow-none rounded-md">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md">
                              <Clock className="w-3.5 h-3.5" /> Pending Review
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon className="w-4 h-4" /> 
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5 hidden sm:flex">
                            <MapPin className="w-4 h-4" /> 
                            {event.location}
                          </span>
                        </div>
                        {isApproved && (
                          <div className="p-3 bg-surface-container-low rounded-md text-sm border border-border/20">
                            <strong>Coordinator Note:</strong> Please arrive 30 mins early at the main entrance. Contact David for queries.
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </section>

        <section>
          <div>
            <h2 className="font-heading text-3xl font-bold tracking-tight mb-2">Available Events</h2>
            <p className="text-muted-foreground mb-6">Discover active drives looking for volunteers.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {availableEvents.map(event => (
              <Card key={event.id} className="flex flex-col border-border/40 overflow-hidden shadow-sm">
                <div className="h-40 bg-muted relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={event.bannerImageUrl} alt="" className="object-cover w-full h-full" />
                </div>
                <CardContent className="p-5 flex-1 flex flex-col">
                  <h3 className="font-heading text-lg font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" /> {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span>{event.maxVolunteers ? event.maxVolunteers - event.volunteerCount : 'Unlimited'} Spots Left</span>
                  </div>
                  <p className="text-muted-foreground text-sm flex-1 mb-4 line-clamp-2">{event.description}</p>
                  <Link href={`/events/${event.id}`} className={buttonVariants({ className: "w-full mt-auto text-center" })}>
                    View Details & Apply
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
