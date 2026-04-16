"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MONTHLY_DONATION_DATA, VOLUNTEER_TRENDS_DATA } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { getEvents, getDonations, getAllUsers } from "@/lib/db-service";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [eData, dData, uData] = await Promise.all([
        getEvents(),
        getDonations(),
        getAllUsers()
      ]);
      setEvents(eData);
      setDonations(dData);
      setUsers(uData);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <DashboardLayout role="admin"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  const totalDonations = donations.reduce((acc, d) => acc + d.amount, 0);
  const activeEvents = events.filter(e => e.status !== "completed").length;
  const volunteers = users.filter((u: any) => u.role === "volunteer");

  // Keep charts static with mock data because real aggregation over time requires complicated firebase query structures out of scope for MVP
  // But display actual numbers on the cards and recent lists

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Platform Overview</h1>
          <p className="text-muted-foreground">High-level metrics across all HopeNGO activities.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-primary">${totalDonations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-primary">{activeEvents}</div>
              <p className="text-xs text-muted-foreground mt-1">Accepting volunteers now</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Volunteers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-primary">{volunteers.length}+</div>
              <p className="text-xs text-muted-foreground mt-1">Ready to serve</p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold font-heading text-primary">Live</div>
              <p className="text-xs text-muted-foreground mt-1">Issued per user automatically</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-sm overflow-hidden border-border/40">
            <CardHeader className="bg-surface-container-low border-b border-border/20">
              <CardTitle className="font-heading">Donation Revenue (YTD)</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MONTHLY_DONATION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#bfc9c1" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c635d' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c635d' }} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip cursor={{ fill: '#f2f4f0' }} contentStyle={{ borderRadius: '8px', border: '1px solid #bfc9c1', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="total" fill="#0f5238" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm overflow-hidden border-border/40">
            <CardHeader className="bg-surface-container-low border-b border-border/20">
              <CardTitle className="font-heading">Volunteer Growth</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={VOLUNTEER_TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#bfc9c1" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c635d' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5c635d' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #bfc9c1' }} />
                    <Line type="monotone" dataKey="active" stroke="#0f5238" strokeWidth={3} dot={{ r: 4, fill: '#0f5238' }} activeDot={{ r: 6 }} name="Active" />
                    <Line type="monotone" dataKey="new" stroke="#84a59d" strokeWidth={3} dot={{ r: 4, fill: '#84a59d' }} name="New Approvals" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-sm border-border/40">
            <CardHeader className="bg-surface-container-low border-b border-border/20">
              <CardTitle className="font-heading text-lg">Recent Drives</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {events.slice(0, 5).map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{event.volunteerCount} Vols</p>
                      <p className={`text-xs uppercase font-bold tracking-wider ${event.status === 'completed' ? 'text-green-600' : 'text-primary'}`}>{event.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/40">
            <CardHeader className="bg-surface-container-low border-b border-border/20">
              <CardTitle className="font-heading text-lg">Recent Donations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {donations.slice(0, 5).map(donation => (
                  <div key={donation.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-bold text-sm">{donation.donorName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">${donation.amount.toLocaleString()}</p>
                      <p className="text-xs uppercase font-bold tracking-wider text-green-600">{donation.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
