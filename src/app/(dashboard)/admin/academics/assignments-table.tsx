"use client";

import { useState } from "react";
import { TeachingAssignment, Subject, Department, Section, AcademicYear, TeacherProfile, User } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createTeachingAssignment, deleteTeachingAssignment } from "@/app/actions/teaching-assignments";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type AssignmentData = TeachingAssignment & {
  teacher: TeacherProfile & { user: User };
  subject: Subject;
  department: Department;
  section: Section;
  academicYear: AcademicYear;
};

interface AssignmentsTableProps {
  data: AssignmentData[];
  teachers: (TeacherProfile & { user: User })[];
  subjects: Subject[];
  departments: Department[];
  sections: Section[];
  academicYears: AcademicYear[];
}

export function AssignmentsTable({ data, teachers, subjects, departments, sections, academicYears }: AssignmentsTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    teacherProfileId: "", subjectId: "", departmentId: "", semester: 1, sectionId: "", academicYearId: "" 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherProfileId || !formData.subjectId || !formData.departmentId || !formData.sectionId || !formData.academicYearId) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    try {
      await createTeachingAssignment(formData);
      toast.success("Teaching assignment created successfully");
      setIsOpen(false);
      setFormData({ teacherProfileId: "", subjectId: "", departmentId: "", semester: 1, sectionId: "", academicYearId: "" });
    } catch (error) {
      toast.error("Failed to create assignment. Ensure it does not already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teaching assignment?")) return;
    try {
      await deleteTeachingAssignment(id);
      toast.success("Teaching assignment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete teaching assignment");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Assignment
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Academic Year</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No teaching assignments found.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.teacher.user.name}</TableCell>
                  <TableCell>{item.subject.name}</TableCell>
                  <TableCell>{item.department.code}</TableCell>
                  <TableCell>{item.semester}</TableCell>
                  <TableCell>{item.section.name}</TableCell>
                  <TableCell>{item.academicYear.name}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Assign Teacher to Class</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacherProfileId">Teacher</Label>
                <select 
                  id="teacherProfileId" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.teacherProfileId} 
                  onChange={(e) => setFormData({ ...formData, teacherProfileId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t.userId} value={t.userId}>{t.user.name} ({t.employeeNumber})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subjectId">Subject</Label>
                <select 
                  id="subjectId" 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.subjectId} 
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Subject</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
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
            <div className="space-y-2">
              <Label htmlFor="academicYearId">Academic Year</Label>
              <select 
                id="academicYearId" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.academicYearId} 
                onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                required
              >
                <option value="" disabled>Select Year</option>
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>{ay.name}</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Assigning..." : "Create Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
