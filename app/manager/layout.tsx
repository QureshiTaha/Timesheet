"use client";
import { Sidebar, type NavItem } from "@/components/shared/sidebar";
import {
  LayoutDashboard,
  FileSpreadsheet,
  Beaker,
  BarChart3,
  Users,
  Building2,
  Settings,
} from "lucide-react";

const items: NavItem[] = [
  { href: "/manager/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/manager/timesheets", label: "All Timesheets", icon: FileSpreadsheet },
  { href: "/manager/sandbox", label: "Sandbox MIS", icon: Beaker },
  { href: "/manager/mis", label: "MIS Reports", icon: BarChart3 },
  { href: "/manager/employees", label: "Employees", icon: Users },
  { href: "/manager/clients", label: "Clients & Projects", icon: Building2 },
  { href: "/manager/settings", label: "Settings", icon: Settings },
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface">
      <Sidebar items={items} portalLabel="Manager" portalAccent="bg-brand/15 text-brand-300" />
      <div className="flex-1 flex flex-col min-w-0">{children}</div>
    </div>
  );
}
