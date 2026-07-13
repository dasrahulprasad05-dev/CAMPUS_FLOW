import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherAssignments } from "@/app/actions/teacher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, Clock } from "lucide-react";

export const metadata = {
  title: "My Classes | CampusFlow",
};

export default async function TeacherClassesPage() {
  const profile = await requireUser();
  if (profile.role !== "teacher") redirect("/login");

  const assignments = await getTeacherAssignments();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Classes</h2>
      </div>

      {assignments.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">You have no classes assigned for the current academic year.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{assignment.subject.name}</CardTitle>
                  <Badge variant="outline">{assignment.subject.code}</Badge>
                </div>
                <CardDescription>
                  {assignment.department.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    <span>Semester {assignment.semester} • Section {assignment.section.name}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{assignment.subject.creditHours} Credit Hours</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{assignment.academicYear.name}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
