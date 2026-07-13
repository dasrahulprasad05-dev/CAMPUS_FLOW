import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  School,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { UserRole } from "@/types";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navigationByRole: Record<UserRole, NavigationItem[]> = {
  student: [
    {
      label: "Overview",
      href: "/student",
      icon: LayoutDashboard,
    },
    {
      label: "My courses",
      href: "/student/courses",
      icon: BookOpen,
    },
    {
      label: "Attendance",
      href: "/student/attendance",
      icon: ClipboardCheck,
    },
    {
      label: "Assignments",
      href: "/student/assignments",
      icon: ClipboardCheck,
    },
    {
      label: "Schedule",
      href: "/student/schedule",
      icon: CalendarDays,
    },
    {
      label: "Grades",
      href: "/student/grades",
      icon: GraduationCap,
    },
    {
      label: "Study Materials",
      href: "/student/materials",
      icon: FileText,
    },
    {
      label: "Notices",
      href: "/student/notices",
      icon: Megaphone,
    },
  ],

  parent: [
    {
      label: "Overview",
      href: "/parent",
      icon: LayoutDashboard,
    },
    {
      label: "Academic progress",
      href: "/parent/progress",
      icon: BarChart3,
    },
    {
      label: "Attendance",
      href: "/parent/attendance",
      icon: ClipboardCheck,
    },
    {
      label: "Assignments",
      href: "/parent/assignments",
      icon: BookOpen,
    },
    {
      label: "Fees",
      href: "/parent/fees",
      icon: CreditCard,
    },
    {
      label: "Notices",
      href: "/parent/notices",
      icon: Bell,
    },
  ],

  teacher: [
    {
      label: "Overview",
      href: "/teacher",
      icon: LayoutDashboard,
    },
    {
      label: "My classes",
      href: "/teacher/classes",
      icon: School,
    },
    {
      label: "Attendance",
      href: "/teacher/attendance",
      icon: ClipboardCheck,
    },
    {
      label: "Assignments",
      href: "/teacher/assignments",
      icon: FileText,
    },
    {
      label: "Gradebook",
      href: "/teacher/gradebook",
      icon: GraduationCap,
    },
    {
      label: "Study Materials",
      href: "/teacher/materials",
      icon: FileText,
    },
    {
      label: "Publish notice",
      href: "/teacher/notices",
      icon: Megaphone,
    },
    {
      label: "Messages",
      href: "/teacher/messages",
      icon: MessageSquare,
    },
  ],

  admin: [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      label: "Academics",
      href: "/admin/academics",
      icon: School,
    },
    {
      label: "Notices",
      href: "/admin/notices",
      icon: Megaphone,
    },
    {
      label: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      label: "Permissions",
      href: "/admin/permissions",
      icon: ShieldCheck,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ],
};
