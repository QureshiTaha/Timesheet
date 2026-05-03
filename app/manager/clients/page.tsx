import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/shared/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { ClientsManager } from "./manager";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    where: { isActive: true },
    orderBy: { clientCode: "asc" },
    include: {
      projects: {
        where: { isActive: true },
        include: { tasks: { where: { isActive: true } } },
      },
    },
  });

  return (
    <>
      <Topbar title="Clients & Projects" subtitle="Master data for timesheet entries" />
      <div className="p-6">
        <PageHeader
          title="Clients, Projects & Tasks"
          description="Define your clients, the activities (projects) under them, and the Beeline tasks that employees can log against."
        />
        <ClientsManager initial={clients as any} />
      </div>
    </>
  );
}
