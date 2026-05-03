import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { audit, requireUser } from "@/lib/api-utils";
import { timesheetUpdateSchema } from "@/lib/validations";
import { dayCount, isoYearWeek, weekLabelForDate, weekdayKey } from "@/lib/utils";

async function loadAndAuthorize(id: number, user: { id: number; role: string }) {
  const ts = await prisma.timesheet.findUnique({ where: { id } });
  if (!ts) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) };
  if (user.role === "EMPLOYEE" && ts.userId !== user.id) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { ts };
}

export async function GET(_req: NextRequest, ctx: { params: { id: string } }) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;
  const id = parseInt(ctx.params.id, 10);
  const a = await loadAndAuthorize(id, user);
  if (a.error) return a.error;
  const data = await prisma.timesheet.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, employeeCode: true } },
      client: true,
      project: true,
      task: true,
    },
  });
  return NextResponse.json({ data });
}

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;

  const id = parseInt(ctx.params.id, 10);
  const a = await loadAndAuthorize(id, user);
  if (a.error) return a.error;
  const ts = a.ts!;

  const body = await req.json();
  const parsed = timesheetUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const v = parsed.data;

  // Employees can only edit DRAFT
  if (user.role === "EMPLOYEE" && ts.status !== "DRAFT") {
    return NextResponse.json({ error: "Only DRAFT timesheets can be edited" }, { status: 403 });
  }

  const data: any = {};
  if (v.date) {
    const date = new Date(v.date);
    data.date = date;
    const wk = isoYearWeek(date);
    data.weekNo = wk.week;
    data.weekLabel = weekLabelForDate(date);
    const key = weekdayKey(date);
    data.sat = 0; data.sun = 0; data.mon = 0; data.tue = 0; data.wed = 0; data.thu = 0; data.fri = 0;
    (data as any)[key] = v.hours ?? Number(ts.hours);
  }
  if (v.clientId !== undefined) data.clientId = v.clientId;
  if (v.projectId !== undefined) data.projectId = v.projectId;
  if (v.taskId !== undefined) data.taskId = v.taskId;
  if (v.description !== undefined) data.description = v.description;
  if (v.hours !== undefined) {
    data.hours = v.hours;
    data.minutes = Math.round(v.hours * 60);
    if (data.date == null) {
      const key = weekdayKey(ts.date);
      (data as any)[key] = v.hours;
    }
  }
  if (v.type !== undefined) data.type = v.type;

  if (v.status) {
    // Employees may only DRAFT or SUBMIT
    if (user.role === "EMPLOYEE" && !["DRAFT", "SUBMITTED"].includes(v.status)) {
      return NextResponse.json({ error: "Forbidden status change" }, { status: 403 });
    }
    data.status = v.status;
    if (v.status === "SUBMITTED") data.submittedAt = new Date();
    if (v.status === "APPROVED") {
      data.approvedAt = new Date();
      data.rejectionNote = null;
    }
    if (v.status === "REJECTED") data.rejectionNote = v.rejectionNote ?? null;
  }

  const updated = await prisma.timesheet.update({ where: { id }, data });
  await audit({ userId: user.id, action: "update", entity: "Timesheet", entityId: id, meta: { changes: Object.keys(data) } });

  return NextResponse.json({ data: updated });
}

export async function DELETE(_req: NextRequest, ctx: { params: { id: string } }) {
  const user = await requireUser();
  if (user instanceof NextResponse) return user;

  const id = parseInt(ctx.params.id, 10);
  const a = await loadAndAuthorize(id, user);
  if (a.error) return a.error;
  const ts = a.ts!;

  if (user.role === "EMPLOYEE" && ts.status !== "DRAFT") {
    return NextResponse.json({ error: "Only DRAFT timesheets can be deleted" }, { status: 403 });
  }

  await prisma.timesheet.delete({ where: { id } });
  await audit({ userId: user.id, action: "delete", entity: "Timesheet", entityId: id });
  return NextResponse.json({ ok: true });
}
