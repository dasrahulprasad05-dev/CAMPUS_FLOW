import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentAssignments } from "@/app/actions/student";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Assignments | CampusFlow",
};

export default async function StudentAssignmentsPage() {
  const profile = await requireUser();
  if (profile.role !== "student") redirect("/login");

  const assignments = await getStudentAssignments();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">You have no pending assignments.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => {
            const hasSubmitted = assignment.submissions.length > 0;
            const dueDate = new Date(assignment.dueDate);
            const isPastDue = !hasSubmitted && dueDate < new Date();

            return (
              <Card key={assignment.id} className="relative overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    {hasSubmitted ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle2 className="mr-1 h-3 w-3" /> Submitted
                      </Badge>
                    ) : isPastDue ? (
                      <Badge variant="destructive">
                        <AlertCircle className="mr-1 h-3 w-3" /> Overdue
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-500 border-orange-500/50">
                        Pending
                      </Badge>
                    )}
                    <Badge variant="secondary">{assignment.teachingAssignment.subject.code}</Badge>
                  </div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {assignment.teachingAssignment.subject.name} • {assignment.teachingAssignment.teacher.user.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {assignment.description}
                  </p>
                  <div className="space-y-2 text-xs mb-4">
                    <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarIcon className="mr-2 h-3 w-3" /> Due Date
                      </div>
                      <span className={`font-medium ${isPastDue ? "text-red-500" : "text-foreground"}`}>
                        {dueDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                      <div className="flex items-center text-muted-foreground">
                        <FileText className="mr-2 h-3 w-3" /> Max Marks
                      </div>
                      <span className="font-medium text-foreground">{assignment.totalMarks}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant={hasSubmitted ? "outline" : "default"}>
                    {hasSubmitted ? "View Submission" : "Submit Assignment"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
