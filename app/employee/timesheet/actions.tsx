"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function TimesheetActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();

  async function submit() {
    const r = await fetch(`/api/timesheets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "SUBMITTED" }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.error(j.error || "Failed to submit");
      return;
    }
    toast.success("Submitted for approval");
    router.refresh();
  }

  async function del() {
    if (!confirm("Delete this draft?")) return;
    const r = await fetch(`/api/timesheets/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      toast.error(j.error || "Failed to delete");
      return;
    }
    toast.success("Deleted");
    router.refresh();
  }

  if (status !== "DRAFT") {
    return <span className="text-xs text-slate-400">Locked</span>;
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Button asChild size="icon" variant="ghost">
        <Link href={`/employee/timesheet/${id}/edit`}><Pencil className="h-3.5 w-3.5" /></Link>
      </Button>
      <Button size="icon" variant="ghost" onClick={submit}>
        <Send className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" onClick={del} className="text-red-600 hover:text-red-700 hover:bg-red-50">
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
