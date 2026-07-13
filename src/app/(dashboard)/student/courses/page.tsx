import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getStudentCourses, getStudentProfile } from "@/app/actions/student";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, BookOpen } from "lucide-react";

export const metadata = {
  title: "My Courses | CampusFlow",
};

export default async function StudentCoursesPage() {
  const profile = await requireUser();
  if (profile.role !== "student") redirect("/login");

  const [studentData, courses] = await Promise.all([
    getStudentProfile(),
    getStudentCourses(),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">My Courses</h2>
      </div>
      
      {studentData && (
        <p className="text-muted-foreground mb-6">
          Showing enrolled courses for {studentData.department.name}, Semester {studentData.semester}, Section {studentData.section.name}.
        </p>
      )}

      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">You are not enrolled in any courses for the current semester.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{course.subject.name}</CardTitle>
                  <Badge variant="outline">{course.subject.code}</Badge>
                </div>
                <CardDescription>
                  {course.subject.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Prof. {course.teacher.user.name}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>{course.subject.creditHours} Credit Hours</span>
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
