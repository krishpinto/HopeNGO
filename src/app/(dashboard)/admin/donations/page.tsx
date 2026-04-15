import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_DONATIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AdminDonationsPage() {
  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Donations Ledger</h1>
          <p className="text-muted-foreground">Track transaction status and export tax-deductible donor sheets.</p>
        </div>

        <Card className="shadow-sm border-border/40">
          <div className="p-4 border-b border-border/20 bg-surface-container-low flex justify-between items-center">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search donor name..." className="pl-9 h-9 bg-background" />
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-container-low text-xs uppercase text-muted-foreground border-b border-border/20">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Transaction ID</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Donor</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Amount</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {MOCK_DONATIONS.map((donation, i) => (
                    <tr key={donation.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground uppercase">{donation.id}-TXN</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{donation.donorName}</td>
                      <td className="px-6 py-4 text-muted-foreground">{new Date(donation.date).toLocaleString()}</td>
                      <td className="px-6 py-4 font-semibold text-primary">${donation.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`rounded-sm capitalize ${donation.status === 'verified' ? 'border-green-200 text-green-700 bg-green-50' : 'border-yellow-200 text-yellow-700 bg-yellow-50'}`}>
                          {donation.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {/* Padding to look denser */}
                  {Array.from({ length: 15 }).map((_, i) => (
                    <tr key={`mock-d-${i}`} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-muted-foreground uppercase">D-{400+i}-TXN</td>
                      <td className="px-6 py-4 font-semibold text-foreground">Anonymous #{i+1}</td>
                      <td className="px-6 py-4 text-muted-foreground">4/{(i%30)+1}/2026, 10:00:00 AM</td>
                      <td className="px-6 py-4 font-semibold text-primary">${(10 * i + 50).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="rounded-sm border-green-200 text-green-700 bg-green-50 capitalize">Verified</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
