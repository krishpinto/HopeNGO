"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getVolunteerCertificates } from "@/lib/db-service";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ScrollText, Download, Eye, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getVolunteerCertificates(user.uid);
        setCerts(data);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
     return <DashboardLayout role="volunteer"><div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout role="volunteer">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">My Certificates</h1>
          <p className="text-muted-foreground">View and download your official participation certificates.</p>
        </div>

        <div className="grid gap-4">
          {certs.length === 0 ? (
            <p className="text-muted-foreground italic">You haven't earned any certificates yet. Complete an event to get started.</p>
          ) : (
            certs.map(cert => (
              <Card key={cert.id} className="overflow-hidden border-border/40 shadow-sm">
                <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="p-4 bg-primary/10 text-primary rounded-xl shrink-0">
                    <ScrollText className="w-8 h-8" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-heading text-xl font-bold mb-1">{cert.eventTitle}</h3>
                    <div className="flex items-center justify-center sm:justify-start gap-4 text-sm text-muted-foreground">
                      <span>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-xs font-semibold">Verified</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 font-mono">CERT ID: {cert.id.toUpperCase()}-HOPE</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" className="flex-1 sm:flex-none flex items-center gap-2" />}>
                        <Eye className="w-4 h-4" /> View
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Certificate Preview</DialogTitle>
                        </DialogHeader>
                        <div className="aspect-[1.4/1] bg-surface-container-low border-8 border-double border-border rounded-lg flex items-center justify-center p-8 text-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-50" />
                          <div className="relative z-10 space-y-4">
                            <h2 className="font-heading text-3xl font-bold text-primary">Certificate of Excellence</h2>
                            <p className="text-muted-foreground text-sm uppercase tracking-widest">Awarded to</p>
                            <h3 className="font-heading text-2xl font-bold">{cert.recipientName}</h3>
                            <p className="text-sm text-muted-foreground">for outstanding contribution and dedicated service during</p>
                            <h4 className="font-bold text-lg">{cert.eventTitle}</h4>
                            <p className="text-xs text-muted-foreground pt-4">Date: {new Date(cert.issuedDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button className="flex-1 sm:flex-none flex items-center gap-2">
                      <Download className="w-4 h-4" /> Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
