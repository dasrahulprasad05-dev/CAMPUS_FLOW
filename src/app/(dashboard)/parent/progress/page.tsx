import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getParentLinkedStudents, getStudentProgress } from "@/app/actions/parent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata = {
  title: "Academic Progress | CampusFlow",
};

export default async function ParentProgressPage() {
  const profile = await requireUser();
  if (profile.role !== "parent") redirect("/login");

  const students = await getParentLinkedStudents();

  if (students.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Academic Progress</h2>
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">You are not linked to any student accounts yet.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Support multiple children, but for now we'll just display the first one
  const student = students[0];
  const progress = await getStudentProgress(student.id);

  // Calculate simple stats
  const totalClasses = progress.attendance.length;
  const presentClasses = progress.attendance.filter(a => a.status === "present").length;
  const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

  const totalExams = progress.grades.length;
  const averagePercentage = totalExams > 0 
    ? progress.grades.reduce((acc, g) => acc + (g.marksObtained / g.maxMarks), 0) / totalExams * 100 
    : 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Academic Progress</h2>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Showing progress for <span className="font-semibold text-foreground">{student.name}</span> 
        {" "} ({student.studentProfile?.rollNumber})
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Attendance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              <span className={attendancePercentage >= 75 ? "text-green-500" : "text-red-500"}>
                {attendancePercentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              {presentClasses} out of {totalClasses} classes attended
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Grade Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              <span className={averagePercentage >= 60 ? "text-green-500" : "text-orange-500"}>
                {averagePercentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Across {totalExams} recorded examinations
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Examination Results</CardTitle>
          <CardDescription>Latest grades published by teachers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Title</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progress.grades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No grades published yet.</TableCell>
                </TableRow>
              ) : (
                progress.grades.map((grade) => {
                  const percentage = (grade.marksObtained / grade.maxMarks) * 100;
                  return (
                    <TableRow key={grade.id}>
                      <TableCell>{new Date(grade.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{grade.teachingAssignment.subject.name}</TableCell>
                      <TableCell>{grade.title}</TableCell>
                      <TableCell className="text-right font-medium">
                        {grade.marksObtained} / {grade.maxMarks}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-semibold ${percentage >= 80 ? 'text-green-500' : percentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                          {percentage.toFixed(1)}%
                        </span>
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
