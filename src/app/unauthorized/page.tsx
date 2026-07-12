import Link from "next/link";
import { GraduationCap, ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-red-50 text-red-500">
          <ShieldAlert className="size-8" />
        </span>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
          Access denied
        </h1>

        <p className="mt-3 text-slate-500">
          You do not have permission to view this page. Contact your
          administrator if you believe this is a mistake.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500"
          >
            <GraduationCap className="size-5" />
            Go to dashboard
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign in with another account
          </Link>
        </div>
      </div>
    </main>
  );
}
