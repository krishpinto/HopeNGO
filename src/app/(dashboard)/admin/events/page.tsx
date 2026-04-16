"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Loader2 } from "lucide-react";
import { getEvents } from "@/lib/db-service";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents().then(e => {
       setEvents(e);
       setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Event Management</h1>
            <p className="text-muted-foreground">Create, assign, and manage global HopeNGO initiatives.</p>
          </div>
          <Button className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Create Event
          </Button>
        </div>

        <Card className="shadow-sm border-border/40">
          <CardContent className="p-0">
            <div className="overflow-x-auto min-h-[300px]">
              {loading ? (
                <div className="flex justify-center items-center h-[300px]"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface-container-low text-xs uppercase text-muted-foreground border-b border-border/20">
                    <tr>
                      <th className="px-6 py-4 font-bold tracking-wider">Event Name</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Location</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                      <th className="px-6 py-4 font-bold tracking-wider">Vols</th>
                      <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    {events.map(event => (
                      <tr key={event.id} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-foreground">{event.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-muted-foreground">{event.location}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`rounded-sm capitalize ${event.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' : event.status === 'ongoing' ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-primary/20 text-primary bg-primary/5'}`}>
                            {event.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{event.volunteerCount} / {event.maxVolunteers || '∞'}</td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
