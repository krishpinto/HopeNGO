import { DashboardLayout } from "@/components/shared/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_USERS, MOCK_VOLUNTEER_APPLICATIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminVolunteersPage() {
  const volunteers = MOCK_USERS.filter(u => u.role === "volunteer");

  return (
    <DashboardLayout role="admin">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight mb-2">Volunteer Directory</h1>
          <p className="text-muted-foreground">Manage volunteer profiles and verify identities.</p>
        </div>

        <Card className="shadow-sm border-border/40">
          <div className="p-4 border-b border-border/20 bg-surface-container-low flex justify-between items-center">
            <div className="relative w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search volunteers..." className="pl-9 h-9 bg-background" />
            </div>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-container-low text-xs uppercase text-muted-foreground border-b border-border/20">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Name</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Approval Status</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {volunteers.map(user => (
                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">{user.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`rounded-sm ${user.isApproved ? 'border-green-200 text-green-700 bg-green-50' : 'border-yellow-200 text-yellow-700 bg-yellow-50'}`}>
                          {user.isApproved ? 'Verified' : 'Pending Verification'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!user.isApproved ? (
                          <Button variant="outline" size="sm" className="h-8">Verify</Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">View Profile</Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Generate some dummy rows so the table is dense */}
                  {Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`mock-${i}`} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-foreground">Pending Volunteer {i + 1}</td>
                      <td className="px-6 py-4 text-muted-foreground">applicant{i}@example.com</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="rounded-sm border-yellow-200 text-yellow-700 bg-yellow-50">Pending Verification</Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm" className="h-8">Verify</Button>
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
