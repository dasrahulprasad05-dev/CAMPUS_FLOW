import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeachers, getStudents } from "@/app/actions/users";
import { getDepartments } from "@/app/actions/departments";
import { getSections } from "@/app/actions/sections";
import { getParentRequests, getApprovedParents } from "@/app/actions/parent-requests";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TeachersTable } from "./teachers-table";
import { StudentsTable } from "./students-table";
import { ParentsTable } from "./parents-table";

export const metadata = {
  title: "User Management | CampusFlow",
};

export default async function UsersPage() {
  const profile = await requireUser();
  if (profile.role !== "admin") {
    redirect("/login");
  }

  const [
    teachers, 
    students, 
    departments, 
    sections, 
    parentRequests, 
    approvedParents
  ] = await Promise.all([
    getTeachers(),
    getStudents(),
    getDepartments(),
    getSections(),
    getParentRequests(),
    getApprovedParents(),
  ]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>

      <Tabs defaultValue="teachers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="parents">Parents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="teachers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
              <CardDescription>
                Manage faculty members and their department assignments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeachersTable data={teachers} departments={departments} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
              <CardDescription>
                Manage student records, batches, and sections.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StudentsTable data={students} departments={departments} sections={sections} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Parents</CardTitle>
              <CardDescription>
                Review parent requests and manage parent-student links.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ParentsTable requests={parentRequests} approved={approvedParents} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
