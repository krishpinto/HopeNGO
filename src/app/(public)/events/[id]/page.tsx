"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { useAppStore } from "@/lib/store";
import { Calendar, MapPin, Users, Info, ChevronLeft, CheckCircle2 } from "lucide-react";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const event = MOCK_EVENTS.find(e => e.id === resolvedParams.id);
  const { hasApplied, applyToEvent } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!event) {
    notFound();
  }

  const isCompleted = event.status === "completed";
  const applied = hasApplied(event.id);

  const handleApply = () => {
    applyToEvent(event.id);
  };

  return (
    <div className="flex flex-col min-h-screen -mt-16">
      {/* Visual Header */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-surface-container-low">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 w-full px-4 pb-12 pt-24">
          <div className="container mx-auto max-w-5xl">
            <Link href="/events" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Events
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground border-0 rounded-sm uppercase tracking-widest text-[10px]">
                {isCompleted ? "Completed" : "Upcoming"}
              </Badge>
              {event.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-white border-white/30 bg-black/20 backdrop-blur-md rounded-sm">
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid md:grid-cols-[1fr_350px] gap-12 lg:gap-20">
          
          {/* Left Column - Details */}
          <div className="space-y-12">
            <section>
              <h2 className="font-heading text-3xl font-bold mb-6">About the Event</h2>
              <div className="prose prose-lg prose-emerald text-muted-foreground leading-relaxed max-w-none">
                <p className="text-xl text-foreground font-medium mb-6">
                  {event.description}
                </p>
                <p>
                  {event.longDescription}
                </p>
              </div>
            </section>

            {isCompleted && event.coordinatorReport && (
              <section className="bg-surface-container-low border border-border/40 rounded-2xl p-8">
                <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" /> Post-Event Report
                </h3>
                <p className="text-muted-foreground mb-6 italic">
                  "{event.coordinatorReport.notes}"
                </p>
                {event.coordinatorReport.attendanceImages && (
                  <div>
                    <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 block">Attendance Verified</span>
                    <div className="flex gap-4">
                      {event.coordinatorReport.attendanceImages.map((img: string, i: number) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img key={i} src={img} alt="Attendance" className="w-24 h-24 object-cover rounded-lg border border-border/50 shadow-sm" />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-xl shadow-black/5 sticky top-24">
              <h3 className="font-heading text-xl font-bold mb-6 border-b border-border/40 pb-4">Event Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm uppercase tracking-wide">Date & Time</p>
                    <p className="text-muted-foreground mt-1">
                      {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(event.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm uppercase tracking-wide">Location</p>
                    <p className="text-muted-foreground mt-1">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="w-full">
                    <p className="font-bold text-foreground text-sm uppercase tracking-wide mb-1">Volunteers Needed</p>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-2xl font-heading text-primary font-bold">{event.volunteerCount}</span>
                      <span className="text-muted-foreground text-sm">/ {event.maxVolunteers || 'Unlimited'} filled</span>
                    </div>
                    {event.maxVolunteers && (
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((event.volunteerCount / event.maxVolunteers) * 100, 100)}%` }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!isCompleted && mounted && (
                <div className="mt-8 pt-8 border-t border-border/40 space-y-4">
                  {applied ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <div className="text-sm font-medium">You have volunteered for this event. Check your dashboard.</div>
                    </div>
                  ) : (
                    <Button size="lg" className="w-full h-14 text-base font-bold shadow-md" onClick={handleApply}>
                      Volunteer for this Event
                    </Button>
                  )}
                  
                  <div className="flex items-start gap-2 bg-surface-container-low p-3 rounded-lg text-xs text-muted-foreground">
                    <Info className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                    <span>Public participants can join on the day without registration. Volunteers must apply here.</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
