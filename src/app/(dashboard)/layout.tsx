export const dynamic = "force-dynamic";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireUser } from "@/lib/auth";
import { RealtimeNotices } from "@/components/dashboard/realtime-notices";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireUser();

  return (
    <>
      <DashboardShell profile={profile}>
        {children}
      </DashboardShell>
      <RealtimeNotices role={profile.role} />
    </>
  );
}

