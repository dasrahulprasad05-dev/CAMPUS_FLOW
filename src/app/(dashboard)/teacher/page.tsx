export const dynamic = "force-dynamic";

import { requireRole } from "@/lib/auth";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import {
  ClipboardCheck,
  FileText,
  MessageSquare,
  School,
} from "lucide-react";

export default async function TeacherDashboardPage() {
  const profile = await requireRole(["teacher"]);

  return (
    <DashboardOverview
      eyebrow="Teacher portal"
      title={`Hello, ${profile.fullName.split(" ")[0]}!`}
      description="Manage your classes, record attendance, review assignments, and communicate with students."
      statistics={[
        {
          label: "Active classes",
          value: "04",
          description: "This semester",
          icon: <School />,
          color: "indigo",
        },
        {
          label: "Assignments",
          value: "12",
          description: "Pending review",
          icon: <FileText />,
          color: "amber",
        },
        {
          label: "Attendance rate",
          value: "87%",
          description: "Class average",
          icon: <ClipboardCheck />,
          color: "emerald",
        },
        {
          label: "Messages",
          value: "06",
          description: "Unread",
          icon: <MessageSquare />,
          color: "cyan",
        },
      ]}
      notices={[
        {
          title: "Grade submission deadline – Dec 20",
          category: "Academics",
          date: "Today",
          priority: "Urgent",
        },
        {
          title: "Department meeting rescheduled",
          category: "Admin",
          date: "Yesterday",
          priority: "Important",
        },
        {
          title: "New curriculum guidelines issued",
          category: "Policy",
          date: "4 days ago",
          priority: "Normal",
        },
      ]}
      upcoming={[
        {
          title: "Database Systems – Lecture",
          subtitle: "Room 101, Block A · 45 students",
          time: "Today 11:00 AM",
        },
        {
          title: "Assignment review session",
          subtitle: "Software Engineering batch",
          time: "Tomorrow 2:00 PM",
        },
        {
          title: "Grade submission deadline",
          subtitle: "All courses",
          time: "Dec 20, 11:59 PM",
        },
      ]}
    />
  );
}

