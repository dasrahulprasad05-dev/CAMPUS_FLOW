import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, KeyRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-10 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-indigo-600 text-white">
            <GraduationCap className="size-6" />
          </span>
          <span className="text-xl font-bold text-slate-950">CampusFlow</span>
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <span className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <KeyRound className="size-6" />
          </span>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
            Reset your password
          </h1>

          <p className="mt-2 text-slate-500">
            Enter your email address and we will send you a link to reset your
            password.
          </p>

          <form className="mt-6 space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="reset-email"
                className="text-sm font-medium text-slate-700"
              >
                Email address
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                required
                placeholder="name@university.edu"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-indigo-600 font-semibold text-white transition hover:bg-indigo-500"
            >
              Send reset link
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Remember your password?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
