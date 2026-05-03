import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/shared/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { EmployeesManager } from "./manager";

export default async function EmployeesPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true, name: true, email: true, role: true, employeeCode: true, isActive: true, createdAt: true,
    },
  });

  return (
    <>
      <Topbar title="Employees" subtitle="Manage your team" />
      <div className="p-6">
        <PageHeader
          title="Employees"
          description="Add, edit, deactivate users and assign roles."
        />
        <EmployeesManager initial={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))} />
      </div>
    </>
  );
}
