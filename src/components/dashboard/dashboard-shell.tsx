"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ChevronDown,
  GraduationCap,
  LogOut,
  Menu,
  Search,
} from "lucide-react";
import { navigationByRole } from "@/config/navigation";
import { logoutAction } from "@/app/actions/auth";
import type { AuthenticatedProfile } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardShellProps {
  profile: AuthenticatedProfile;
  children: React.ReactNode;
}

function UserAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt=""
        className="size-10 rounded-full border border-white/10 object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

  return (
    <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white shadow-lg">
      {initials}
    </span>
  );
}

export function DashboardShell({
  profile,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const navigation = navigationByRole[profile.role];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 selection:bg-indigo-500/30">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-slate-900/50 backdrop-blur-2xl lg:flex lg:flex-col"
      >
        <div className="flex h-20 items-center border-b border-white/5 px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <motion.span
              whileHover={{ scale: 1.05, rotate: -5 }}
              className="grid size-10 place-items-center rounded-2xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
            >
              <GraduationCap className="size-6" />
            </motion.span>

            <div>
              <p className="font-bold tracking-tight text-white">CampusFlow</p>
              <p className="text-xs capitalize text-indigo-400">
                {profile.role} portal
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map(({ label, href, icon: Icon }, idx) => {
            const isActive =
              pathname === href ||
              (href !== `/${profile.role}` &&
                pathname.startsWith(`${href}/`));

            return (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 shadow-inner ring-1 ring-indigo-500/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <Icon className="size-5" />
                  {label}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <UserAvatar
              name={profile.fullName}
              avatarUrl={profile.avatarUrl}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                {profile.fullName}
              </p>
              <p className="truncate text-xs text-slate-400">
                {profile.email}
              </p>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="size-5" />
              Sign out
            </button>
          </form>
        </div>
      </motion.aside>

      <div className="lg:pl-72 relative z-10">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="sticky top-0 z-30 flex h-20 items-center border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur-xl sm:px-6"
        >
          <button
            type="button"
            className="mr-3 grid size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

            <input
              type="search"
              placeholder="Search courses, people, or notices..."
              className="h-11 w-full rounded-2xl border border-white/10 bg-slate-900/50 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative grid size-11 place-items-center rounded-2xl border border-white/10 bg-slate-900/50 text-slate-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Open notifications"
            >
              <Bell className="size-5" />

              <span className="absolute right-2 top-2 size-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/50 p-1.5 pr-3 transition hover:bg-white/5"
            >
              <UserAvatar
                name={profile.fullName}
                avatarUrl={profile.avatarUrl}
              />

              <div className="hidden text-left md:block">
                <p className="max-w-36 truncate text-sm font-semibold text-white">
                  {profile.fullName}
                </p>
                <p className="text-xs capitalize text-slate-400">
                  {profile.role}
                </p>
              </div>

              <ChevronDown className="hidden size-4 text-slate-500 md:block" />
            </button>
          </div>
        </motion.header>

        <main className="p-4 pb-24 sm:p-6 lg:p-8">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-slate-950/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
          {navigation.slice(0, 5).map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium transition",
                  isActive ? "text-indigo-400" : "text-slate-500 hover:text-slate-300",
                )}
              >
                <Icon className="size-5" />
                <span className="max-w-full truncate">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
