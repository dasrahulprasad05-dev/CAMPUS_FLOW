"use client";

import { useState } from "react";
import { AcademicYear } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { createAcademicYear, updateAcademicYear, deleteAcademicYear } from "@/app/actions/academic-years";
import { Plus, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface AcademicYearsTableProps {
  data: AcademicYear[];
}

export function AcademicYearsTable({ data }: AcademicYearsTableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    startDate: "", 
    endDate: "", 
    isCurrent: false 
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenDialog = (year?: AcademicYear) => {
    if (year) {
      setEditingId(year.id);
      setFormData({ 
        name: year.name, 
        startDate: new Date(year.startDate).toISOString().split('T')[0], 
        endDate: new Date(year.endDate).toISOString().split('T')[0], 
        isCurrent: year.isCurrent 
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", startDate: "", endDate: "", isCurrent: false });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        isCurrent: formData.isCurrent,
      };

      if (editingId) {
        await updateAcademicYear(editingId, payload);
        toast.success("Academic year updated successfully");
      } else {
        await createAcademicYear(payload);
        toast.success("Academic year created successfully");
      }
      setIsOpen(false);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this academic year?")) return;
    try {
      await deleteAcademicYear(id);
      toast.success("Academic year deleted successfully");
    } catch (error) {
      toast.error("Failed to delete academic year");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Academic Year
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No academic years found.</TableCell>
              </TableRow>
            ) : (
              data.map((year) => (
                <TableRow key={year.id}>
                  <TableCell className="font-medium">{year.name}</TableCell>
                  <TableCell>{new Date(year.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(year.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {year.isCurrent ? (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Current
                      </Badge>
                    ) : (
                      <Badge variant="outline">Archived</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(year)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(year.id)}>
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
            <DialogTitle>{editingId ? "Edit Academic Year" : "Add Academic Year"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. 2026-2027" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCurrent"
                className="h-4 w-4 rounded border-gray-300"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
              />
              <Label htmlFor="isCurrent">Set as current academic year</Label>
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
