import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDepartments } from "@/app/actions/departments";
import { getSections } from "@/app/actions/sections";
import { getSubjects } from "@/app/actions/subjects";
import { getAcademicYears } from "@/app/actions/academic-years";
import { getTeachingAssignments } from "@/app/actions/teaching-assignments";
import { getTeachers } from "@/app/actions/users";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DepartmentsTable } from "./departments-table";
import { SectionsTable } from "./sections-table";
import { SubjectsTable } from "./subjects-table";
import { AcademicYearsTable } from "./academic-years-table";
import { AssignmentsTable } from "./assignments-table";

export const metadata = {
  title: "Academic Management | CampusFlow",
};

export default async function AcademicsPage() {
  const profile = await requireUser();
  if (profile.role !== "admin") {
    redirect("/login");
  }

  const [departments, sections, subjects, academicYears, teachingAssignments, teachers] = await Promise.all([
    getDepartments(),
    getSections(),
    getSubjects(),
    getAcademicYears(),
    getTeachingAssignments(),
    getTeachers(),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Academic Management</h2>
      </div>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="years">Academic Years</TabsTrigger>
          <TabsTrigger value="assignments">Teaching Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>
                Manage university departments (e.g., Computer Science, Mechanical Engineering).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DepartmentsTable data={departments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>
                Manage class sections (e.g., Section A, Section B).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SectionsTable data={sections} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
              <CardDescription>
                Manage subjects and courses offered by departments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubjectsTable data={subjects} departments={departments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="years" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Years</CardTitle>
              <CardDescription>
                Manage academic years and terms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AcademicYearsTable data={academicYears} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Assignments</CardTitle>
              <CardDescription>
                Assign teachers to specific subjects and classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssignmentsTable 
                data={teachingAssignments} 
                teachers={teachers}
                subjects={subjects}
                departments={departments}
                sections={sections}
                academicYears={academicYears}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
