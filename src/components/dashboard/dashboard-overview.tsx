import type { LucideIcon } from "lucide-react";

export interface DashboardStatistic {
  label: string;
  value: string;
  description: string;
  icon: LucideIcon;
  color: "indigo" | "cyan" | "emerald" | "amber";
}

interface DashboardOverviewProps {
  eyebrow: string;
  title: string;
  description: string;
  statistics: DashboardStatistic[];
  notices: Array<{
    title: string;
    category: string;
    date: string;
    priority: "Normal" | "Important" | "Urgent";
  }>;
  upcoming: Array<{
    title: string;
    subtitle: string;
    time: string;
  }>;
}

const colors = {
  indigo: "bg-indigo-50 text-indigo-600",
  cyan: "bg-cyan-50 text-cyan-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
};

const priorities = {
  Normal: "bg-slate-100 text-slate-600",
  Important: "bg-amber-100 text-amber-700",
  Urgent: "bg-red-100 text-red-700",
};

export function DashboardOverview({
  eyebrow,
  title,
  description,
  statistics,
  notices,
  upcoming,
}: DashboardOverviewProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.45),transparent_30%),radial-gradient(circle_at_10%_90%,rgba(6,182,212,0.2),transparent_30%)]" />

        <div className="relative max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            {description}
          </p>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistics.map(({ label, value, description, icon: Icon, color }) => (
          <article
            key={label}
            className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <span
                className={`grid size-12 place-items-center rounded-2xl ${colors[color]}`}
              >
                <Icon className="size-6" />
              </span>
            </div>

            <p className="mt-4 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 font-semibold text-slate-800">{label}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-semibold text-slate-950">Recent notices</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {notices.map((notice) => (
              <div key={notice.title} className="flex items-start gap-4 px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium text-slate-900">
                    {notice.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {notice.category} · {notice.date}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${priorities[notice.priority]}`}
                >
                  {notice.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-semibold text-slate-950">Upcoming</h2>
          </div>

          <div className="divide-y divide-slate-100">
            {upcoming.map((item) => (
              <div key={item.title} className="px-6 py-4">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{item.subtitle}</p>
                <p className="mt-1 text-xs font-medium text-indigo-600">
                  {item.time}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
