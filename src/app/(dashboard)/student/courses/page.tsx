export const dynamic = "force-dynamic";

import { requireRole } from "@/lib/auth";

export default async function Page() {
  await requireRole(["student"]);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">My courses</h1>
        <p className="mt-2 text-slate-500">
          This page is under construction. It will be implemented in the next phase.
        </p>
      </div>
    </div>
  );
}
