"use client";

import { useState } from "react";
import { User, StudentProfile, Department, Section } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createStudent, toggleUserActive } from "@/app/actions/users";
import { Plus, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type StudentData = StudentProfile & {
  user: User;
  department: Department;
  section: Section;
};

interface StudentsTableProps {
  data: StudentData[];
  departments: Department[];
  sections: Section[];
}

export function StudentsTable({ data, departments, sections }: StudentsTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    name: "", email: "", phone: "", rollNumber: "", departmentId: "", semester: 1, sectionId: "", admissionYear: new Date().getFullYear()
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId || !formData.sectionId) {
      toast.error("Please select department and section");
      return;
    }
    setIsLoading(true);
    try {
      await createStudent(formData);
      toast.success("Student account created with default password 'password123'");
      setIsOpen(false);
      setFormData({ name: "", email: "", phone: "", rollNumber: "", departmentId: "", semester: 1, sectionId: "", admissionYear: new Date().getFullYear() });
    } catch (error) {
      toast.error("Failed to create student. Email or Roll Number might exist.");
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
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll Number</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Sem</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No students found.</TableCell>
              </TableRow>
            ) : (
              data.map((student) => (
                <TableRow key={student.userId}>
                  <TableCell className="font-medium">{student.rollNumber}</TableCell>
                  <TableCell>{student.user.name}</TableCell>
                  <TableCell>{student.department?.code}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>{student.section?.name}</TableCell>
                  <TableCell>
                    {student.user.isActive ? (
                      <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleToggleActive(student.userId, student.user.isActive)}
                      title={student.user.isActive ? "Deactivate Account" : "Activate Account"}
                    >
                      {student.user.isActive ? (
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Student</DialogTitle>
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
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" required value={formData.rollNumber} onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admissionYear">Admission Year</Label>
                <Input id="admissionYear" type="number" required value={formData.admissionYear} onChange={(e) => setFormData({ ...formData, admissionYear: parseInt(e.target.value) })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departmentId">Department</Label>
                <select 
                  id="departmentId" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.departmentId} 
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.code}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input id="semester" type="number" min="1" max="8" required value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sectionId">Section</Label>
                <select 
                  id="sectionId" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.sectionId} 
                  onChange={(e) => setFormData({ ...formData, sectionId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select</option>
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Student"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
