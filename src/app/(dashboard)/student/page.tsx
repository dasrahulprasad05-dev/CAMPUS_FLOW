export const dynamic = "force-dynamic";

import { requireRole } from "@/lib/auth";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import {
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";

export default async function StudentDashboardPage() {
  const profile = await requireRole(["student"]);

  return (
    <DashboardOverview
      eyebrow="Student portal"
      title={`Good to see you, ${profile.fullName.split(" ")[0]}!`}
      description="Track your courses, assignments, grades, and campus notices all in one place."
      statistics={[
        {
          label: "Attendance",
          value: "92%",
          description: "This semester",
          icon: ClipboardCheck,
          color: "emerald",
        },
        {
          label: "Assignments",
          value: "08",
          description: "Due this week",
          icon: BookOpen,
          color: "indigo",
        },
        {
          label: "Grades",
          value: "A-",
          description: "Current GPA: 3.7",
          icon: GraduationCap,
          color: "cyan",
        },
        {
          label: "Courses",
          value: "06",
          description: "Active this semester",
          icon: CalendarDays,
          color: "amber",
        },
      ]}
      notices={[
        {
          title: "Semester examination schedule published",
          category: "Academics",
          date: "Today",
          priority: "Urgent",
        },
        {
          title: "Library extended hours during exam week",
          category: "Campus",
          date: "Yesterday",
          priority: "Important",
        },
        {
          title: "Sports day registration open",
          category: "Events",
          date: "2 days ago",
          priority: "Normal",
        },
        {
          title: "Scholarship applications for next term",
          category: "Finance",
          date: "3 days ago",
          priority: "Important",
        },
      ]}
      upcoming={[
        {
          title: "Database Systems – Assignment 3",
          subtitle: "Submit via portal",
          time: "Due tomorrow at 11:59 PM",
        },
        {
          title: "Software Engineering – Lab",
          subtitle: "Room 204, Block B",
          time: "Monday 09:00–11:00 AM",
        },
        {
          title: "Mid-semester examination",
          subtitle: "Computer Science Dept.",
          time: "Wednesday 10:00 AM",
        },
      ]}
    />
  );
}

