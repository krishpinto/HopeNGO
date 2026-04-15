"use client";

import { use, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { MOCK_EVENTS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, UploadCloud, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CoordinatorSubmitReportPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const event = MOCK_EVENTS.find(e => e.id === resolvedParams.id && e.coordinatorId === "u4");
  
  const [submitted, setSubmitted] = useState(false);

  if (!event) {
    notFound();
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app we'd mutate state here. 
    // We will just show a success state and mock redirect back.
    setTimeout(() => {
        router.push('/coordinator');
    }, 2000);
  };

  return (
    <DashboardLayout role="coordinator">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link href={`/coordinator/events/${event.id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back to Event
          </Link>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Submit Event Report</h1>
          <p className="text-muted-foreground">Finalize attendance and post-event metrics for <strong className="text-foreground">{event.title}</strong>.</p>
        </div>

        {submitted ? (
           <Card className="border-green-200 bg-green-50 animate-in fade-in zoom-in-95 duration-500">
             <CardContent className="flex flex-col items-center text-center p-12">
               <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
               <h2 className="font-heading text-2xl font-bold text-green-900 mb-2">Report Submitted Successfully</h2>
               <p className="text-green-800/80 mb-6 max-w-sm">Your attendance images and activity notes have been uploaded to the centralized archive. Redirecting back to dashboard...</p>
             </CardContent>
           </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="shadow-sm border-border/40">
              <CardHeader className="bg-surface-container-low border-b border-border/20">
                <CardTitle className="font-heading text-xl">Execution Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="activities" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Activities Conducted</Label>
                  <Textarea id="activities" placeholder="Describe the step-by-step execution of the event..." className="min-h-32 bg-surface-container-lowest" required />
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="actualVols" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Actual Volunteers Present</Label>
                    <Input id="actualVols" type="number" defaultValue={event.volunteerCount} className="bg-surface-container-lowest" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="challenges" className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Challenges Faced (Optional)</Label>
                    <Input id="challenges" placeholder="e.g. Weather, logistics..." className="bg-surface-container-lowest" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/40">
              <CardHeader className="bg-surface-container-low border-b border-border/20">
                <CardTitle className="font-heading text-xl">Attendance Evidence</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-border p-12 rounded-xl flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 hover:bg-surface-container-lowest transition-colors cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-muted-foreground mb-4" />
                  <p className="font-bold mb-1">Click to upload Images (min. 2 required)</p>
                  <p className="text-xs text-muted-foreground">JPEG, PNG up to 10MB each</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" size="lg" className="font-bold px-8">Submit Final Report</Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
