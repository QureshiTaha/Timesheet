import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  accent = "brand",
  hint,
}: {
  label: string;
  value: string | number;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  accent?: "brand" | "navy" | "emerald" | "sky" | "amber" | "violet";
  hint?: string;
}) {
  const accents: Record<string, string> = {
    brand: "from-brand/20 to-brand/5 text-brand",
    navy: "from-navy/20 to-navy/5 text-navy",
    emerald: "from-emerald-200/60 to-emerald-50 text-emerald-600",
    sky: "from-sky-200/60 to-sky-50 text-sky-600",
    amber: "from-amber-200/60 to-amber-50 text-amber-600",
    violet: "from-violet-200/60 to-violet-50 text-violet-600",
  };
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft hover:shadow-elevated transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold text-navy tabular-nums tracking-tight">
            {value}
          </p>
          {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
        </div>
        <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center", accents[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {delta && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          {trend === "up" ? (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-semibold">
              <ArrowUpRight className="h-3 w-3" /> {delta}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-red-600 font-semibold">
              <ArrowDownRight className="h-3 w-3" /> {delta}
            </span>
          )}
          <span className="text-slate-400">vs last week</span>
        </div>
      )}
    </div>
  );
}
