
import type { Metadata } from "next";
import Link from "next/link";
import {
  BellRing,
  BookOpenCheck,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

const benefits = [
  {
    icon: BookOpenCheck,
    text: "Track assignments, grades, and academic progress.",
  },
  {
    icon: BellRing,
    text: "Receive notices and important campus updates.",
  },
  {
    icon: ShieldCheck,
    text: "Secure access tailored to your account role.",
  },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.45),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(6,182,212,0.25),transparent_32%)]" />

        <Link href="/" className="relative flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-500/30">
            <GraduationCap className="size-6" />
          </span>

          <span className="text-xl font-bold">CampusFlow</span>
        </Link>

        <div className="relative max-w-xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Your connected campus
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Learn, manage, communicate, and grow from one platform.
          </h1>

          <div className="mt-10 space-y-5">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/10">
                  <Icon className="size-5 text-indigo-200" />
                </span>

                <p className="text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-sm text-slate-500">
          Built for universities and colleges.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 flex items-center gap-3 lg:hidden"
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-indigo-600 text-white">
              <GraduationCap className="size-6" />
            </span>

            <span className="text-xl font-bold text-slate-950">
              CampusFlow
            </span>
          </Link>

          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Welcome back
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
            Sign in to continue
          </h2>

          <p className="mt-3 text-slate-500">
            Enter the account information provided by your institution.
          </p>

          <LoginForm />
        </div>
      </section>
    </main>
  );
}
