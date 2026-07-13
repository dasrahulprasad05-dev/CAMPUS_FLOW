import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getParentLinkedStudents, getStudentFees } from "@/app/actions/parent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

export const metadata = {
  title: "Fee Management | CampusFlow",
};

export default async function ParentFeesPage() {
  const profile = await requireUser();
  if (profile.role !== "parent") redirect("/login");

  const students = await getParentLinkedStudents();

  if (students.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Fee Management</h2>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">You are not linked to any student accounts yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Display fees for the first child
  const student = students[0];
  const fees = await getStudentFees(student.id);

  const totalDue = fees
    .filter(f => f.status !== "paid")
    .reduce((acc, f) => acc + (f.amount - f.paidAmount), 0);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Fee Management</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Showing fee records for <span className="font-semibold text-foreground">{student.name}</span>
      </p>

      {totalDue > 0 && (
        <Card className="border-red-500/50 bg-red-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-500">Total Outstanding Balance</p>
                <h3 className="text-3xl font-bold text-red-500">₹{totalDue.toLocaleString()}</h3>
              </div>
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                <CreditCard className="mr-2 h-4 w-4" /> Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Fee Breakdown</CardTitle>
          <CardDescription>Current and past fee records for the academic year.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No fee records found.</TableCell>
                </TableRow>
              ) : (
                fees.map((fee) => {
                  const isOverdue = fee.status !== "paid" && new Date(fee.dueDate) < new Date();
                  return (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.feeType}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{fee.description}</TableCell>
                      <TableCell>
                        <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">₹{fee.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹{fee.paidAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        {fee.status === "paid" ? (
                          <Badge className="bg-green-500/10 text-green-500">Paid</Badge>
                        ) : fee.status === "partial" ? (
                          <Badge className="bg-orange-500/10 text-orange-500">Partial</Badge>
                        ) : (
                          <Badge variant="destructive">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
