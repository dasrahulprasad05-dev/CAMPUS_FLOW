"use client";

import { ParentRequest, User, ParentStudentLink, StudentProfile } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { approveParentRequest, rejectParentRequest } from "@/app/actions/parent-requests";
import { Check, X, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { toggleUserActive as toggleGlobalUserActive } from "@/app/actions/users";

type RequestData = ParentRequest & {
  parent: User;
};

type ApprovedData = ParentStudentLink & {
  parent: User;
  student: User & { studentProfile: StudentProfile | null };
};

interface ParentsTableProps {
  requests: RequestData[];
  approved: ApprovedData[];
}

export function ParentsTable({ requests, approved }: ParentsTableProps) {
  
  const handleApprove = async (id: string) => {
    try {
      await approveParentRequest(id);
      toast.success("Parent request approved!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to approve request");
      }
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectParentRequest(id);
      toast.success("Parent request rejected.");
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleGlobalUserActive(userId, !currentStatus);
      toast.success(`Account ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error("Failed to change account status");
    }
  };

  const pendingRequests = requests.filter(r => r.status === "pending");

  return (
    <div className="space-y-8">
      {pendingRequests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pending Approvals</h3>
          <div className="rounded-md border border-orange-500/20">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parent Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student Roll No</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.parent.name}</TableCell>
                    <TableCell>{req.parent.email}</TableCell>
                    <TableCell>{req.studentRollNumber}</TableCell>
                    <TableCell>{req.relationship}</TableCell>
                    <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleReject(req.id)}>
                        <X className="mr-2 h-4 w-4 text-red-500" /> Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(req.id)}>
                        <Check className="mr-2 h-4 w-4 text-green-500" /> Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Approved Parents</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approved.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No approved parents found.</TableCell>
                </TableRow>
              ) : (
                approved.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.parent.name}</TableCell>
                    <TableCell>{link.parent.email}</TableCell>
                    <TableCell>{link.student.name}</TableCell>
                    <TableCell>{link.student.studentProfile?.rollNumber}</TableCell>
                    <TableCell>{link.relationship}</TableCell>
                    <TableCell>
                      {link.parent.isActive ? (
                        <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleActive(link.parentId, link.parent.isActive)}
                        title={link.parent.isActive ? "Deactivate Account" : "Activate Account"}
                      >
                        {link.parent.isActive ? (
                          <PowerOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Power className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
