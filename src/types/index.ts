export const USER_ROLES = [
  "student",
  "parent",
  "teacher",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type AssignmentStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "late"
  | "returned"
  | "graded";

export type NoticePriority = "normal" | "important" | "urgent";

export interface DashboardUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  priority: NoticePriority;
  publishedAt: string;
  authorName: string;
  isRead: boolean;
}
