import { LoaderCircle } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-slate-400">
      <div className="relative flex items-center justify-center">
        <div className="absolute size-12 animate-ping rounded-full bg-indigo-500/20" />
        <div className="relative flex size-12 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 shadow-lg shadow-indigo-500/20 backdrop-blur-xl">
          <LoaderCircle className="size-6 animate-spin text-indigo-400" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-slate-300">
          Loading dashboard...
        </p>
        <p className="text-xs text-slate-500">
          Fetching the latest data
        </p>
      </div>
    </div>
  );
}
