"use client";

import { useState } from "react";
import { TeachingAssignment, Subject, Department, Section, AcademicYear, Assignment } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createAssignment, deleteAssignment } from "@/app/actions/assignments";
import { Plus, Trash2, CalendarIcon, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type TeachingData = TeachingAssignment & {
  subject: Subject;
  department: Department;
  section: Section;
  academicYear: AcademicYear;
};

type AssignmentData = Assignment & {
  teachingAssignment: TeachingAssignment & {
    subject: Subject;
    section: Section;
  };
  submissions: { id: string }[]; // count array
};

interface AssignmentsManagerProps {
  teachingAssignments: TeachingData[];
  createdAssignments: AssignmentData[];
}

export function AssignmentsManager({ teachingAssignments, createdAssignments }: AssignmentsManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    teachingAssignmentId: "",
    title: "",
    description: "",
    dueDate: "",
    totalMarks: 100
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createAssignment({
        ...formData,
        dueDate: new Date(formData.dueDate)
      });
      toast.success("Assignment created successfully");
      setIsOpen(false);
      setFormData({
        teachingAssignmentId: "",
        title: "",
        description: "",
        dueDate: "",
        totalMarks: 100
      });
    } catch (error) {
      toast.error("Failed to create assignment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this assignment? All student submissions will also be deleted.")) return;
    try {
      await deleteAssignment(id);
      toast.success("Assignment deleted");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Assignment
        </Button>
      </div>

      {createdAssignments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">You haven&apos;t created any assignments yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {createdAssignments.map((a) => (
            <Card key={a.id} className="hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <CardHeader className="pb-2">
                <div className="space-y-1 pr-8">
                  <CardTitle className="text-lg line-clamp-1">{a.title}</CardTitle>
                  <CardDescription className="text-xs font-medium text-primary">
                    {a.teachingAssignment.subject.name} (Sec {a.teachingAssignment.section.name})
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                  {a.description}
                </p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center text-muted-foreground">
                      <CalendarIcon className="mr-2 h-3 w-3" /> Due Date
                    </div>
                    <span className="font-medium text-foreground">
                      {new Date(a.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center text-muted-foreground">
                      <FileText className="mr-2 h-3 w-3" /> Max Marks
                    </div>
                    <span className="font-medium text-foreground">{a.totalMarks}</span>
                  </div>
                  <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center text-muted-foreground">
                      <Users className="mr-2 h-3 w-3" /> Submissions
                    </div>
                    <Badge variant="secondary" className="font-mono">{a.submissions?.length || 0}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class">Select Class</Label>
              <select 
                id="class" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.teachingAssignmentId} 
                onChange={(e) => setFormData({ ...formData, teachingAssignmentId: e.target.value })}
                required
              >
                <option value="" disabled>Select Class</option>
                {teachingAssignments.map((ta) => (
                  <option key={ta.id} value={ta.id}>
                    {ta.subject.name} - Sem {ta.semester} Sec {ta.section.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Instructions / Description</Label>
              <Textarea 
                id="description" 
                required 
                rows={4}
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" required value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input id="totalMarks" type="number" required value={formData.totalMarks} onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Assignment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
