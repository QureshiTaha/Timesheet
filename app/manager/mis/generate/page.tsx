import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/shared/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { MISBuilder } from "./builder";

export default async function GenerateMISPage() {
  const [users, clients, sandboxes] = await Promise.all([
    prisma.user.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.client.findMany({ where: { isActive: true }, orderBy: { clientCode: "asc" } }),
    prisma.sandboxEntry.groupBy({
      by: ["sandboxLabel"],
      _count: { id: true },
    }),
  ]);

  return (
    <>
      <Topbar title="Generate MIS" subtitle="Build a new report" />
      <div className="p-6">
        <PageHeader
          title="MIS Generator"
          description="Build a fresh MIS preview from timesheets or a sandbox snapshot. Finalize and export when ready."
        />
        <MISBuilder
          users={users.map((u) => ({ id: u.id, name: u.name, employeeCode: u.employeeCode }))}
          clients={clients.map((c) => ({ id: c.id, clientCode: c.clientCode, clientName: c.clientName }))}
          sandboxes={sandboxes.map((s) => ({ label: s.sandboxLabel, count: s._count.id }))}
        />
      </div>
    </>
  );
}
