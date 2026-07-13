export const dynamic = "force-dynamic";

import { requireRole } from "@/lib/auth";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  CreditCard,
} from "lucide-react";

export default async function ParentDashboardPage() {
  const profile = await requireRole(["parent"]);

  return (
    <DashboardOverview
      eyebrow="Parent portal"
      title={`Welcome, ${profile.fullName.split(" ")[0]}!`}
      description="Monitor your child's academic progress, attendance, assignments, and fee payments."
      statistics={[
        {
          label: "Attendance",
          value: "89%",
          description: "This month",
          icon: <ClipboardCheck />,
          color: "emerald",
        },
        {
          label: "Pending fees",
          value: "₹4,200",
          description: "Due by 30th",
          icon: <CreditCard />,
          color: "amber",
        },
        {
          label: "GPA",
          value: "3.6",
          description: "Current semester",
          icon: <BarChart3 />,
          color: "indigo",
        },
        {
          label: "New notices",
          value: "03",
          description: "Unread messages",
          icon: <Bell />,
          color: "cyan",
        },
      ]}
      notices={[
        {
          title: "Fee payment reminder – Q3",
          category: "Finance",
          date: "Today",
          priority: "Urgent",
        },
        {
          title: "Parent-teacher meeting scheduled",
          category: "Meeting",
          date: "Yesterday",
          priority: "Important",
        },
        {
          title: "Semester report cards available",
          category: "Academics",
          date: "3 days ago",
          priority: "Normal",
        },
      ]}
      upcoming={[
        {
          title: "Fee payment deadline",
          subtitle: "Q3 tuition fees",
          time: "In 5 days",
        },
        {
          title: "Parent-teacher meeting",
          subtitle: "Main conference hall",
          time: "Saturday 10:00 AM",
        },
        {
          title: "Mid-semester examination",
          subtitle: "Results expected after 2 weeks",
          time: "Wednesday",
        },
      ]}
    />
  );
}

