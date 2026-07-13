"use client";

import type { LucideIcon } from "lucide-react";
import { motion, Variants } from "framer-motion";

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
  indigo: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

const priorities = {
  Normal: "bg-white/5 text-slate-300 border-white/10",
  Important: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Urgent: "bg-red-500/10 text-red-400 border-red-500/20",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="mx-auto max-w-7xl"
    >
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-slate-900/50 p-6 text-white shadow-2xl ring-1 ring-white/10 backdrop-blur-3xl sm:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.25),transparent_40%),radial-gradient(circle_at_10%_90%,rgba(6,182,212,0.15),transparent_40%)]" />

        <div className="relative max-w-3xl">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-400"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-3 max-w-2xl leading-7 text-slate-400"
          >
            {description}
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        variants={containerVariants}
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {statistics.map(({ label, value, description, icon: Icon, color }, idx) => (
          <motion.article
            key={label}
            variants={itemVariants}
            whileHover={{ y: -5, scale: 1.02, rotateX: 5, rotateY: -5 }}
            style={{ perspective: 1000 }}
            className="group relative overflow-hidden rounded-3xl bg-slate-900/40 p-5 shadow-xl ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/60 hover:ring-white/20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex items-start justify-between">
              <span
                className={`grid size-12 place-items-center rounded-2xl border ${colors[color]}`}
              >
                <Icon className="size-6" />
              </span>
            </div>

            <div className="relative mt-4">
              <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
              <p className="mt-1 font-medium text-slate-300">{label}</p>
              <p className="mt-1 text-sm text-slate-500">{description}</p>
            </div>
          </motion.article>
        ))}
      </motion.section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
        <motion.section variants={itemVariants} className="overflow-hidden rounded-3xl bg-slate-900/40 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
          <div className="border-b border-white/5 bg-white/5 px-6 py-4">
            <h2 className="font-semibold text-white">Recent notices</h2>
          </div>

          <div className="divide-y divide-white/5">
            {notices.map((notice, idx) => (
              <motion.div
                key={notice.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-start gap-4 px-6 py-4 transition hover:bg-white/[0.02]"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-slate-200">
                    {notice.title}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {notice.category} · {notice.date}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${priorities[notice.priority]}`}
                >
                  {notice.priority}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="overflow-hidden rounded-3xl bg-slate-900/40 shadow-xl ring-1 ring-white/10 backdrop-blur-xl">
          <div className="border-b border-white/5 bg-white/5 px-6 py-4">
            <h2 className="font-semibold text-white">Upcoming</h2>
          </div>

          <div className="divide-y divide-white/5">
            {upcoming.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="px-6 py-4 transition hover:bg-white/[0.02]"
              >
                <p className="font-medium text-slate-200">{item.title}</p>
                <p className="mt-0.5 text-sm text-slate-400">{item.subtitle}</p>
                <p className="mt-1 text-xs font-medium text-indigo-400">
                  {item.time}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
