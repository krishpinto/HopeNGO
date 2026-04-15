import { MOCK_EVENTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

export default function EventsPage() {
  const events = MOCK_EVENTS;

  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] pb-24">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-border/40 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-primary mb-6">Our Initiatives</h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            Discover upcoming events, workshops, and community drives.
            Register as a participant or sign up to volunteer.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 mt-12 space-y-12">
        {events.map((event) => {
          const isCompleted = event.status === "completed";
          
          return (
            <div key={event.id} className={`group flex flex-col md:flex-row gap-0 overflow-hidden rounded-2xl border border-border/40 shadow-sm transition-shadow hover:shadow-lg ${isCompleted ? 'opacity-80' : 'bg-card'}`}>
              <div className="w-full md:w-[400px] h-64 md:h-auto overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={event.bannerImageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
              </div>
              
              <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${isCompleted ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                    {isCompleted ? 'Completed' : 'Upcoming'}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> 
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h2 className="font-heading text-3xl font-bold mb-4">{event.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{event.description}</p>
                
                <div className="grid grid-cols-2 gap-y-4 text-sm font-medium text-foreground mb-8">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" /> <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" /> 
                    <span>{event.participantCount} / {event.maxParticipants} Registered</span>
                  </div>
                </div>

                {!isCompleted && (
                  <div className="flex flex-wrap gap-4 mt-auto">
                    <Button size="lg" className="rounded-full tracking-wide">Register to Attend</Button>
                    <Button size="lg" variant="outline" className="rounded-full tracking-wide">Apply to Volunteer</Button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
