"use client";

import { useState } from "react";
import { User, TeacherProfile, Department } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createTeacher, toggleUserActive } from "@/app/actions/users";
import { Plus, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type TeacherData = TeacherProfile & {
  user: User;
  department: Department | null;
};

interface TeachersTableProps {
  data: TeacherData[];
  departments: Department[];
}

export function TeachersTable({ data, departments }: TeachersTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", employeeNumber: "", departmentId: "", designation: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId) {
      toast.error("Please select a department");
      return;
    }
    setIsLoading(true);
    try {
      await createTeacher(formData);
      toast.success("Teacher account created with default password 'password123'");
      setIsOpen(false);
      setFormData({ name: "", email: "", phone: "", employeeNumber: "", departmentId: "", designation: "" });
    } catch (error) {
      toast.error("Failed to create teacher. Email or Employee Number might exist.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserActive(userId, !currentStatus);
      toast.success(`Account ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error("Failed to change account status");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Emp. ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">No teachers found.</TableCell>
              </TableRow>
            ) : (
              data.map((teacher) => (
                <TableRow key={teacher.userId}>
                  <TableCell className="font-medium">{teacher.employeeNumber}</TableCell>
                  <TableCell>{teacher.user.name}</TableCell>
                  <TableCell>{teacher.user.email}</TableCell>
                  <TableCell>{teacher.department?.name || "Unassigned"}</TableCell>
                  <TableCell>
                    {teacher.user.isActive ? (
                      <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleActive(teacher.userId, teacher.user.isActive)}
                      title={teacher.user.isActive ? "Deactivate Account" : "Activate Account"}
                    >
                      {teacher.user.isActive ? (
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">Employee Number</Label>
                <Input id="employeeNumber" required value={formData.employeeNumber} onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <select 
                  id="departmentId" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.departmentId} 
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} placeholder="e.g. Assistant Professor" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Teacher"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
