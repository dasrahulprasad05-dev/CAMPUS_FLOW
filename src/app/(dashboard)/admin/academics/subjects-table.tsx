"use client";

import { useState } from "react";
import { Subject, Department } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createSubject, updateSubject, deleteSubject } from "@/app/actions/subjects";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface SubjectsTableProps {
  data: (Subject & { department: Department })[];
  departments: Department[];
}

export function SubjectsTable({ data, departments }: SubjectsTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", creditHours: 3, departmentId: "", description: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = (subject?: Subject) => {
    if (subject) {
      setEditingId(subject.id);
      setFormData({ 
        name: subject.name, 
        code: subject.code, 
        creditHours: subject.creditHours,
        departmentId: subject.departmentId,
        description: subject.description || "" 
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", code: "", creditHours: 3, departmentId: departments[0]?.id || "", description: "" });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId) {
      toast.error("Please select a department");
      return;
    }
    setIsLoading(true);
    try {
      if (editingId) {
        await updateSubject(editingId, formData);
        toast.success("Subject updated successfully");
      } else {
        await createSubject(formData);
        toast.success("Subject created successfully");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      toast.success("Subject deleted successfully");
    } catch (error) {
      toast.error("Failed to delete subject");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Subject
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No subjects found.</TableCell>
              </TableRow>
            ) : (
              data.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell className="font-medium">{subject.code}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.creditHours}</TableCell>
                  <TableCell>{subject.department.code}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(subject)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(subject.id)}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Subject" : "Add Subject"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input id="code" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. CS101" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name</Label>
              <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Database Systems" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creditHours">Credit Hours</Label>
              <Input id="creditHours" type="number" required value={formData.creditHours} onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })} min="1" max="6" />
            </div>
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
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
