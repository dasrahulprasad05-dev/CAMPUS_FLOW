export const dynamic = "force-dynamic";

import { requireRole } from "@/lib/auth";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { prisma } from "@/lib/prisma";
import {
  BarChart3,
  School,
  ShieldCheck,
  Users,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const profile = await requireRole(["admin"]);

  // Fetch real statistics from database
  const [totalUsers, totalDepartments, pendingRequests] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.parentRequest.count({ where: { status: "pending" } }),
  ]);

  return (
    <DashboardOverview
      eyebrow="Administrator portal"
      title={`Welcome, ${profile.fullName.split(" ")[0]}!`}
      description="Oversee users, manage academics, publish notices, and configure platform settings."
      statistics={[
        {
          label: "Total users",
          value: totalUsers.toLocaleString(),
          description: "Active accounts",
          icon: <Users />,
          color: "indigo",
        },
        {
          label: "Departments",
          value: totalDepartments.toString().padStart(2, "0"),
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
          value: pendingRequests.toString(),
          description: "Require action",
          icon: <ShieldCheck />,
          color: "amber",
        },
      ]}
      notices={[
        {
          title: "System Update Complete",
          category: "System",
          date: "Today",
          priority: "Normal",
        },
      ]}
      upcoming={[
        {
          title: "Board of directors meeting",
          subtitle: "Conference room A",
          time: "Tomorrow 10:00 AM",
        },
      ]}
    />
  );
}

