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
        className="size-10 rounded-full object-cover"
      />
    );
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-bold text-white">
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
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
              <GraduationCap className="size-6" />
            </span>

            <div>
              <p className="font-bold tracking-tight">CampusFlow</p>
              <p className="text-xs capitalize text-slate-500">
                {profile.role} portal
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== `/${profile.role}` &&
                pathname.startsWith(`${href}/`));

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
            <UserAvatar
              name={profile.fullName}
              avatarUrl={profile.avatarUrl}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {profile.fullName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {profile.email}
              </p>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="size-5" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-slate-200 bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="mr-3 grid size-10 place-items-center rounded-xl border border-slate-200 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu className="size-5" />
          </button>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              placeholder="Search courses, people, or notices..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="relative grid size-11 place-items-center rounded-2xl border border-slate-200 bg-white transition hover:bg-slate-50"
              aria-label="Open notifications"
            >
              <Bell className="size-5" />

              <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-1.5 pr-3"
            >
              <UserAvatar
                name={profile.fullName}
                avatarUrl={profile.avatarUrl}
              />

              <div className="hidden text-left md:block">
                <p className="max-w-36 truncate text-sm font-semibold">
                  {profile.fullName}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {profile.role}
                </p>
              </div>

              <ChevronDown className="hidden size-4 text-slate-400 md:block" />
            </button>
          </div>
        </header>

        <main className="p-4 pb-24 sm:p-6 lg:p-8">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
          {navigation.slice(0, 5).map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-medium",
                  isActive ? "text-indigo-600" : "text-slate-500",
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
