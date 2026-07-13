import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentGrades } from "@/app/actions/student";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award } from "lucide-react";

export const metadata = {
  title: "My Grades | CampusFlow",
};

export default async function StudentGradesPage() {
  const profile = await requireUser();
  if (profile.role !== "student") redirect("/login");

  const grades = await getStudentGrades();

  // Calculate some simple statistics
  const totalExams = grades.length;
  const totalPercentage = totalExams > 0 
    ? grades.reduce((acc, g) => acc + (g.marksObtained / g.maxMarks), 0) / totalExams * 100 
    : 0;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Grades</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Performance</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across {totalExams} recorded exams</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Internal Marks</CardTitle>
          <CardDescription>Your performance in assignments, quizzes, and mid-semesters.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Exam Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Score</TableHead>
                <TableHead className="text-right">Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No grades published yet.</TableCell>
                </TableRow>
              ) : (
                grades.map((grade) => {
                  const percentage = (grade.marksObtained / grade.maxMarks) * 100;
                  return (
                    <TableRow key={grade.id}>
                      <TableCell>{new Date(grade.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{grade.teachingAssignment.subject.name}</TableCell>
                      <TableCell>{grade.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {grade.examType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
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
