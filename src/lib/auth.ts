import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/types";

export interface AuthenticatedProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
}

export async function getCurrentProfile(): Promise<AuthenticatedProfile | null> {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      isActive: true,
    },
  });

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.name ?? "User",
    email: user.email,
    role: user.role as UserRole,
    avatarUrl: user.image,
    isActive: user.isActive,
  };
}

export async function requireUser(): Promise<AuthenticatedProfile> {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await getCurrentProfile();

  if (!profile) {
    // Stale session (user deleted or DB reset). Clear the next-auth cookie!
    // redirect('/login') will cause a loop if middleware thinks we're logged in.
    redirect("/api/auth/signout");
  }

  if (!profile.isActive) {
    redirect("/account-disabled");
  }

  return profile;
}

export async function requireRole(
  allowedRoles: UserRole[],
): Promise<AuthenticatedProfile> {
  const profile = await requireUser();

  if (!allowedRoles.includes(profile.role)) {
    redirect("/unauthorized");
  }

  return profile;
}

export function dashboardForRole(role: UserRole): string {
  const destinations: Record<UserRole, string> = {
    student: "/student",
    parent: "/parent",
    teacher: "/teacher",
    admin: "/admin",
  };

  return destinations[role];
}
