"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export function Sidebar({
  items,
  portalLabel,
  portalAccent,
}: {
  items: NavItem[];
  portalLabel: string;
  portalAccent: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-navy-gradient text-white">
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-gradient flex items-center justify-center font-bold text-lg shadow-brand">
            P
          </div>
          <div>
            <p className="font-display text-lg font-semibold tracking-tight leading-none">Ptex</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">
              {portalLabel}
            </p>
          </div>
        </Link>
      </div>

      <div className="px-3 mt-2">
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider",
            portalAccent
          )}
        >
          {portalLabel} Portal
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-white/10 text-white shadow-inner"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-brand" />
              )}
              <Icon className={cn("h-4 w-4 shrink-0", active ? "text-brand" : "text-white/50 group-hover:text-white/80")} />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-brand text-white text-[10px] font-bold px-1.5 py-0.5 leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10 text-[11px] text-white/40">
        v1.0 · © {new Date().getFullYear()} Ptex
      </div>
    </aside>
  );
}
