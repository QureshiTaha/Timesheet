import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatHours(value: number | string | null | undefined) {
  const n = typeof value === "string" ? parseFloat(value) : Number(value ?? 0);
  if (Number.isNaN(n)) return "0.00";
  return n.toFixed(2);
}

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function isoYearWeek(date: Date): { year: number; week: number } {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { year: target.getUTCFullYear(), week };
}

// Returns the SAT–FRI week label for a given date, e.g. "28/03 - 03/04"
export function weekLabelForDate(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 6=Sat
  // diff to last Saturday
  const diff = (day + 1) % 7;
  const sat = new Date(d);
  sat.setDate(d.getDate() - diff);
  const fri = new Date(sat);
  fri.setDate(sat.getDate() + 6);
  const fmt = (x: Date) =>
    `${String(x.getDate()).padStart(2, "0")}/${String(x.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(sat)} - ${fmt(fri)}`;
}

// Day Count: SUN=1, MON=2 ... SAT=7
export function dayCount(date: Date): number {
  const d = new Date(date).getDay(); // 0..6
  return d === 0 ? 1 : d + 1;
}

// Returns which weekday key the date belongs to among sat..fri
export function weekdayKey(date: Date): "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri" {
  const map = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;
  return map[new Date(date).getDay()] as any;
}

export function monthName(date: Date): string {
  return date.toLocaleString("en-US", { month: "long" });
}
