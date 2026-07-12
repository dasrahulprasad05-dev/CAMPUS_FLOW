import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Assignment tracking",
    description:
      "Manage upcoming, submitted, overdue, returned, and graded assignments.",
  },
  {
    icon: GraduationCap,
    title: "Four connected portals",
    description:
      "Dedicated dashboards for students, parents, teachers, and administrators.",
  },
  {
    icon: ShieldCheck,
    title: "Secure role access",
    description:
      "Users receive only the information and actions allowed for their role.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.3),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(6,182,212,0.22),transparent_30%)]" />

      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-indigo-500 shadow-lg shadow-indigo-500/30">
            <GraduationCap className="size-6" />
          </span>

          <span className="text-xl font-bold tracking-tight">
            CampusFlow
          </span>
        </Link>

        <Link
          href="/login"
          className="rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-white/15"
        >
          Sign in
        </Link>
      </nav>

      <section className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            <Sparkles className="size-4" />
            A smarter way to manage campus life
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Everything your institution needs in{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              one connected platform.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Track assignments, publish notices, record attendance, monitor
            progress, and connect students, parents, teachers, and
            administrators.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3.5 font-semibold shadow-xl shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:bg-indigo-400"
            >
              Open CampusFlow
              <ArrowRight className="size-5" />
            </Link>

            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold transition hover:bg-white/10"
            >
              Explore features
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-10 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl backdrop-blur-xl">
            <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Student dashboard</p>
                  <h2 className="mt-1 text-xl font-semibold">
                    Good morning, Alex
                  </h2>
                </div>

                <div className="size-11 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Attendance", "92%"],
                  ["Assignments", "08"],
                  ["New notices", "04"],
                  ["Courses", "06"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-bold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
                <p className="text-xs font-medium text-amber-300">
                  IMPORTANT NOTICE
                </p>
                <p className="mt-2 font-medium">
                  Semester examination schedule has been published.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative mx-auto max-w-7xl px-6 py-20"
      >
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur transition hover:-translate-y-1 hover:border-indigo-400/30 hover:bg-white/[0.08]"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-indigo-500/15 text-indigo-300">
                <Icon className="size-6" />
              </span>

              <h2 className="mt-5 text-xl font-semibold">{title}</h2>
              <p className="mt-3 leading-7 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
