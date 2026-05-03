import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";

const map: Record<string, { variant: "default" | "success" | "warning" | "danger" | "info" | "brand"; icon: any; label: string }> = {
  DRAFT: { variant: "default", icon: FileText, label: "Draft" },
  SUBMITTED: { variant: "info", icon: Clock, label: "Submitted" },
  APPROVED: { variant: "success", icon: CheckCircle2, label: "Approved" },
  REJECTED: { variant: "danger", icon: XCircle, label: "Rejected" },
};

export function StatusPill({ status }: { status: string }) {
  const cfg = map[status] ?? map.DRAFT;
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {cfg.label}
    </Badge>
  );
}
