export const dynamic = "force-dynamic";

import { requireRole } from "@/lib/auth";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import {
  BarChart3,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const profile = await requireRole(["admin"]);

  return (
    <DashboardOverview
      eyebrow="Administrator portal"
      title={`Welcome, ${profile.fullName.split(" ")[0]}!`}
      description="Oversee users, manage academics, publish notices, and configure platform settings."
      statistics={[
        {
          label: "Total users",
          value: "1,284",
          description: "Active accounts",
          icon: <Users />,
          color: "indigo",
        },
        {
          label: "Departments",
          value: "08",
          description: "Active programs",
          icon: <School />,
          color: "cyan",
        },
        {
          label: "Avg. attendance",
          value: "88%",
          description: "Institution-wide",
          icon: <BarChart3 />,
          color: "emerald",
        },
        {
          label: "Pending requests",
          value: "14",
          description: "Require action",
          icon: <ShieldCheck />,
          color: "amber",
        },
      ]}
      notices={[
        {
          title: "Annual accreditation report due",
          category: "Compliance",
          date: "Today",
          priority: "Urgent",
        },
        {
          title: "New batch enrollment open",
          category: "Admissions",
          date: "Yesterday",
          priority: "Important",
        },
        {
          title: "Faculty evaluation forms distributed",
          category: "HR",
          date: "2 days ago",
          priority: "Normal",
        },
        {
          title: "Infrastructure maintenance scheduled",
          category: "Facilities",
          date: "5 days ago",
          priority: "Normal",
        },
      ]}
      upcoming={[
        {
          title: "Board of directors meeting",
          subtitle: "Conference room A",
          time: "Tomorrow 10:00 AM",
        },
        {
          title: "Semester start – Spring batch",
          subtitle: "All departments",
          time: "Jan 6, 2025",
        },
        {
          title: "Accreditation report submission",
          subtitle: "Quality assurance office",
          time: "Jan 15, 2025",
        },
      ]}
    />
  );
}

