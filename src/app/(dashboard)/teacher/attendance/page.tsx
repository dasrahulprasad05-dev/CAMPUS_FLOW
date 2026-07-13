import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTeacherAssignments } from "@/app/actions/teacher";
import { AttendanceManager } from "./attendance-manager";

export const metadata = {
  title: "Take Attendance | CampusFlow",
};

export default async function AttendancePage() {
  const profile = await requireUser();
  if (profile.role !== "teacher") redirect("/login");

  const assignments = await getTeacherAssignments();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Take Attendance</h2>
      </div>

      <AttendanceManager assignments={assignments} />
    </div>
  );
}
