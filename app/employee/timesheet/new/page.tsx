import { Topbar } from "@/components/shared/topbar";
import { PageHeader } from "@/components/shared/page-header";
import { TimesheetForm } from "@/components/employee/timesheet-form";

export default function NewTimesheetPage() {
  return (
    <>
      <Topbar title="New Timesheet" subtitle="Log a new work entry" />
      <div className="p-6">
        <PageHeader title="Log Time" description="Capture one task per row, mirroring the daily timesheet sheet." />
        <TimesheetForm mode="create" />
      </div>
    </>
  );
}
