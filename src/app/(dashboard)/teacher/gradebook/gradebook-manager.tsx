"use client";

import { useState, useEffect } from "react";
import { TeachingAssignment, Subject, Department, Section, AcademicYear, StudentProfile, User, InternalMarks, ExamType } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEnrolledStudents } from "@/app/actions/teacher";
import { getMarksForAssignment, saveMarks } from "@/app/actions/marks";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type AssignmentData = TeachingAssignment & {
  subject: Subject;
  department: Department;
  section: Section;
  academicYear: AcademicYear;
};

type StudentData = StudentProfile & {
  user: User;
};

interface GradebookManagerProps {
  assignments: AssignmentData[];
}

export function GradebookManager({ assignments }: GradebookManagerProps) {
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("");
  const [examType, setExamType] = useState<ExamType>("mid_semester");
  const [title, setTitle] = useState<string>("Mid Semester Exam");
  const [maxMarks, setMaxMarks] = useState<number>(30);
  
  const [students, setStudents] = useState<StudentData[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [pastMarks, setPastMarks] = useState<InternalMarks[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!selectedAssignmentId) return;
      
      setIsLoading(true);
      try {
        const assignment = assignments.find(a => a.id === selectedAssignmentId);
        if (!assignment) return;

        // Fetch students
        const fetchedStudents = await getEnrolledStudents(
          assignment.departmentId, 
          assignment.semester, 
          assignment.sectionId
        );
        setStudents(fetchedStudents);

        // Fetch past marks for this assignment
        const existingMarks = await getMarksForAssignment(selectedAssignmentId);
        setPastMarks(existingMarks);
        
        // Initialize marks map (empty strings)
        const marksMap: Record<string, string> = {};
        fetchedStudents.forEach(s => {
          marksMap[s.userId] = "";
        });
        setMarks(marksMap);
      } catch (error) {
        toast.error("Failed to load class data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [selectedAssignmentId, assignments]);

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedAssignmentId || students.length === 0 || !title) {
      toast.error("Please fill in all details");
      return;
    }
    
    // Validate marks
    const records = [];
    for (const s of students) {
      const val = marks[s.userId];
      if (val !== "") {
        const num = parseFloat(val);
        if (isNaN(num) || num < 0 || num > maxMarks) {
          toast.error(`Invalid mark for ${s.user.name}. Must be between 0 and ${maxMarks}.`);
          return;
        }
        records.push({ studentId: s.userId, marksObtained: num });
      }
    }

    if (records.length === 0) {
      toast.error("No marks entered");
      return;
    }

    setIsSaving(true);
    try {
      await saveMarks(selectedAssignmentId, title, examType, maxMarks, records);
      toast.success("Marks saved successfully");
      
      // Reload past marks
      const existingMarks = await getMarksForAssignment(selectedAssignmentId);
      setPastMarks(existingMarks);
      
      // Clear inputs
      const marksMap: Record<string, string> = {};
      students.forEach(s => { marksMap[s.userId] = ""; });
      setMarks(marksMap);
      
    } catch (error) {
      toast.error("Failed to save marks");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Class Selection</CardTitle>
          <CardDescription>Select a class to manage grades.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-w-md">
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
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : selectedAssignmentId && students.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload Marks</CardTitle>
              <CardDescription>Enter new marks for the selected class.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type</Label>
                  <select 
                    id="examType" 
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={examType} 
                    onChange={(e) => setExamType(e.target.value as ExamType)}
                  >
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz</option>
                    <option value="mid_semester">Mid Semester</option>
                    <option value="end_semester">End Semester</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Mid Term 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxMarks">Max Marks</Label>
                  <Input 
                    id="maxMarks" 
                    type="number" 
                    value={maxMarks} 
                    onChange={(e) => setMaxMarks(parseInt(e.target.value) || 0)} 
                  />
                </div>
              </div>

              <div className="rounded-md border mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Roll Number</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="w-[120px]">Marks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.userId}>
                        <TableCell className="font-medium text-xs">{student.rollNumber}</TableCell>
                        <TableCell className="text-sm">{student.user.name}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max={maxMarks}
                            step="0.5"
                            className="h-8"
                            value={marks[student.userId] || ""}
                            onChange={(e) => handleMarkChange(student.userId, e.target.value)}
                            placeholder={`/${maxMarks}`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Submit Marks"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Past Uploads</CardTitle>
              <CardDescription>History of marks uploaded for this class.</CardDescription>
            </CardHeader>
            <CardContent>
              {pastMarks.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">No marks uploaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {/* Group past marks by Title + Exam Type for a cleaner view */}
                  {Array.from(new Set(pastMarks.map(m => m.title))).map(uniqueTitle => {
                    const marksGroup = pastMarks.filter(m => m.title === uniqueTitle);
                    if(marksGroup.length === 0) return null;
                    const maxM = marksGroup[0].maxMarks;
                    const eType = marksGroup[0].examType;
                    const d = new Date(marksGroup[0].createdAt).toLocaleDateString();

                    return (
                      <div key={uniqueTitle} className="flex flex-col space-y-2 p-3 rounded-lg border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-sm">{uniqueTitle}</h4>
                            <p className="text-xs text-muted-foreground">{d} • Max: {maxM}</p>
                          </div>
                          <Badge variant="outline" className="capitalize">{eType.replace('_', ' ')}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {marksGroup.length} student records submitted.
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
