import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { MISData } from "@/lib/mis-engine";

export const MIS_COLUMNS = [
  "Month",
  "Week No.",
  "Week",
  "Date",
  "Resource",
  "Role",
  "Client Code",
  "Activity ID",
  "Description",
  "Hours",
  "Type",
  "Beeline Task / Project Activity Name",
  "Task ID",
  "PO Ref.",
  "Mins",
  "SAT",
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "Day Count",
];

export function misToAOA(mis: MISData): any[][] {
  const header = MIS_COLUMNS;
  const rows = mis.rows.map((r) => [
    r.month,
    r.weekNo,
    r.weekLabel,
    r.date,
    r.resource,
    r.role,
    r.clientCode,
    r.activityId,
    r.description,
    r.hours,
    r.type,
    r.beelineTask,
    r.taskId,
    r.poRef ?? "",
    r.minutes,
    r.sat || "",
    r.sun || "",
    r.mon || "",
    r.tue || "",
    r.wed || "",
    r.thu || "",
    r.fri || "",
    r.dayCount,
  ]);
  return [header, ...rows];
}

export function exportMISToWorkbook(mis: MISData, title: string): XLSX.WorkBook {
  const wb = XLSX.utils.book_new();

  const detailed = XLSX.utils.aoa_to_sheet(misToAOA(mis));
  XLSX.utils.book_append_sheet(wb, detailed, "Daily Timesheet");

  const empAOA = [
    ["Employee", "Hours", "Minutes", "Days"],
    ...mis.byEmployee.map((e) => [e.employee, e.hours, e.minutes, e.days]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(empAOA), "By Employee");

  const cliAOA = [
    ["Client Code", "Client Name", "Hours", "Minutes"],
    ...mis.byClient.map((c) => [c.clientCode, c.clientName, c.hours, c.minutes]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cliAOA), "By Client");

  const summary = [
    ["Title", title],
    ["Total Rows", mis.totals.totalRows],
    ["Total Hours", mis.totals.totalHours],
    ["Total Minutes", mis.totals.totalMinutes],
    ["Employees", mis.totals.employees],
    ["Clients", mis.totals.clients],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summary), "Summary");

  return wb;
}

export function exportMISToBuffer(mis: MISData, title: string): Buffer {
  const wb = exportMISToWorkbook(mis, title);
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

export function exportMISToPDF(mis: MISData, title: string): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  doc.setFontSize(16);
  doc.text(title, 40, 40);
  doc.setFontSize(10);
  doc.text(`Total Hours: ${mis.totals.totalHours}   Total Rows: ${mis.totals.totalRows}   Employees: ${mis.totals.employees}   Clients: ${mis.totals.clients}`, 40, 60);

  autoTable(doc, {
    startY: 80,
    head: [["Date", "Emp", "Client", "Activity ID", "Description", "Hrs", "Type", "Task ID"]],
    body: mis.rows.map((r) => [
      r.date,
      r.resource,
      r.clientCode,
      r.activityId,
      (r.description || "").slice(0, 60),
      r.hours,
      r.type,
      r.taskId,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [13, 27, 42] },
  });

  return doc.output("arraybuffer");
}
