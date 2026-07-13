"use client";

import { useState, useEffect } from "react";
import { TeachingAssignment, Subject, Department, Section, AcademicYear, StudentProfile, User } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEnrolledStudents } from "@/app/actions/teacher";
import { getAttendanceByDateAndAssignment, saveAttendance } from "@/app/actions/attendance";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type AssignmentData = TeachingAssignment & {
  subject: Subject;
  department: Department;
  section: Section;
  academicYear: AcademicYear;
};

type StudentData = StudentProfile & {
  user: User;
};

interface AttendanceManagerProps {
  assignments: AssignmentData[];
}

type AttendanceRecord = {
  studentId: string;
  status: "present" | "absent" | "late" | "excused";
};

export function AttendanceManager({ assignments }: AttendanceManagerProps) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [students, setStudents] = useState<StudentData[]>([]);
  const [attendance, setAttendance] = useState<Record<string, "present" | "absent" | "late" | "excused">>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!selectedAssignmentId || !selectedDate) return;
      
      setIsLoading(true);
      try {
        const assignment = assignments.find(a => a.id === selectedAssignmentId);
        if (!assignment) return;

        // Fetch students in this class
        const fetchedStudents = await getEnrolledStudents(
          assignment.departmentId, 
          assignment.semester, 
          assignment.sectionId
        );
        setStudents(fetchedStudents);

        // Fetch existing attendance records for this date
        const existingRecords = await getAttendanceByDateAndAssignment(selectedAssignmentId, new Date(selectedDate));
        
        // Initialize attendance map
        const attendanceMap: Record<string, "present" | "absent" | "late" | "excused"> = {};
        
        // Default all to present if no records exist
        if (existingRecords.length === 0) {
          fetchedStudents.forEach(s => {
            attendanceMap[s.userId] = "present";
          });
        } else {
          // Map existing records
          fetchedStudents.forEach(s => {
            const record = existingRecords.find(r => r.studentId === s.userId);
            attendanceMap[s.userId] = (record?.status as "present"|"absent"|"late"|"excused") || "present";
          });
        }
        
        setAttendance(attendanceMap);
      } catch (error) {
        toast.error("Failed to load class data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedAssignmentId, selectedDate, assignments]);

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late" | "excused") => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status: "present" | "absent" | "late" | "excused") => {
    const newAttendance = { ...attendance };
    students.forEach(s => {
      newAttendance[s.userId] = status;
    });
    setAttendance(newAttendance);
  };

  const handleSave = async () => {
    if (!selectedAssignmentId || !selectedDate || students.length === 0) return;
    
    setIsSaving(true);
    try {
      const records = students.map(s => ({
        studentId: s.userId,
        status: attendance[s.userId] || "present"
      }));

      await saveAttendance(selectedAssignmentId, new Date(selectedDate), records);
      toast.success("Attendance saved successfully");
    } catch (error) {
      toast.error("Failed to save attendance");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Details</CardTitle>
          <CardDescription>Select a class and date to take attendance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignment">Class</Label>
              <select 
                id="assignment" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedAssignmentId} 
                onChange={(e) => setSelectedAssignmentId(e.target.value)}
              >
                <option value="" disabled>Select a class</option>
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.subject.name} - Sem {a.semester} Sec {a.section.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : selectedAssignmentId && students.length > 0 ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Student List</CardTitle>
              <CardDescription>Mark attendance for {students.length} students.</CardDescription>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleMarkAll("present")}>Mark All Present</Button>
              <Button variant="outline" size="sm" onClick={() => handleMarkAll("absent")}>Mark All Absent</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.userId}>
                      <TableCell className="font-medium">{student.rollNumber}</TableCell>
                      <TableCell>{student.user.name}</TableCell>
                      <TableCell>
                        <select
                          className="flex h-9 w-[130px] items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-sm"
                          value={attendance[student.userId] || "present"}
                          onChange={(e) => handleStatusChange(student.userId, e.target.value as "present"|"absent"|"late"|"excused")}
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                          <option value="excused">Excused</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Attendance"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : selectedAssignmentId && students.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No students are currently enrolled in this section.</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
