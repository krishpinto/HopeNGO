import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";

export default function DonationsPage() {
  return (
    <div className="bg-surface min-h-[calc(100vh-64px)] pb-24">
      {/* Header */}
      <div className="bg-surface-container-low border-b border-border/40 py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="font-heading text-5xl font-bold tracking-tight text-primary mb-6">Support the Archive</h1>
          <p className="text-xl text-muted-foreground max-w-2xl font-light leading-relaxed">
            Your generous contribution fuels our ongoing efforts to restore forgotten urban spaces
            and empower underserved communities. 
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 mt-16">
        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-8">
            <h2 className="font-heading text-3xl font-bold">Why Donate?</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Every dollar donated goes directly into funding operational costs for our 
                grassroots chapters, from purchasing saplings for reforestation drives to 
                securing educational materials for inner-city literacy programs.
              </p>
              <p>
                As a fully transparent organization, your donations are visible and their 
                impact is tracked directly by our community coordinators in the field.
              </p>
            </div>
            
            <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
              <h3 className="font-heading text-xl font-bold text-primary flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 fill-primary" /> Tax Deductible
              </h3>
              <p className="text-sm text-primary/80">
                HopeNGO is a registered non-profit. All generous donations are fully tax-deductible 
                under section 501(c)(3). Receipts are automatically generated and emailed to you.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-card p-8 rounded-2xl border border-border/40 shadow-xl shadow-black/5">
              <h2 className="font-heading text-2xl font-bold mb-6">Make a Contribution</h2>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Select Amount</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="h-12 border-primary/20 text-primary hover:bg-primary/5">$50</Button>
                    <Button className="h-12 bg-primary hover:bg-primary/90 shadow-md">$100</Button>
                    <Button variant="outline" className="h-12 border-primary/20 text-primary hover:bg-primary/5">$250</Button>
                  </div>
                  <Input type="number" placeholder="Custom Amount" className="h-12 bg-surface-container-lowest" />
                </div>

                <div className="space-y-4 pb-2 border-b border-border/40">
                  <div className="space-y-2">
                    <Label htmlFor="donorName" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Full Name</Label>
                    <Input id="donorName" placeholder="Jane Doe" className="h-12 bg-surface-container-lowest" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="donorEmail" className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Email Address</Label>
                    <Input id="donorEmail" type="email" placeholder="jane@example.com" className="h-12 bg-surface-container-lowest" />
                  </div>
                </div>

                <Button className="w-full h-14 text-base font-bold tracking-wide rounded-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 fill-primary-foreground" />
                  Confirm Donation
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-4">Safe and secure payments processed via Stripe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
