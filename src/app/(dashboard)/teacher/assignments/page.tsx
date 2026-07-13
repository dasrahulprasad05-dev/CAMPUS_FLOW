import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherAssignments } from "@/app/actions/teacher";
import { getTeacherAssignments as getAssignmentsList } from "@/app/actions/assignments";
import { AssignmentsManager } from "./assignments-manager";

export const metadata = {
  title: "Assignments | CampusFlow",
};

export default async function AssignmentsPage() {
  const profile = await requireUser();
  if (profile.role !== "teacher") redirect("/login");

  // Get teaching assignments (the classes they teach)
  const teachingAssignments = await getTeacherAssignments();
  
  // Get homework assignments they've created
  const createdAssignments = await getAssignmentsList();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
      </div>

      <AssignmentsManager 
        teachingAssignments={teachingAssignments} 
        createdAssignments={createdAssignments} 
      />
    </div>
  );
}
