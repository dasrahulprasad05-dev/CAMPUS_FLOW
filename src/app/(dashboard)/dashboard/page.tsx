export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { dashboardForRole, requireUser } from "@/lib/auth";

export default async function DashboardRedirectPage() {
  const profile = await requireUser();

  redirect(dashboardForRole(profile.role));
}

