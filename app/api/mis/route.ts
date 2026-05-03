import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { audit, requireManager } from "@/lib/api-utils";
import { generateMIS } from "@/lib/mis-engine";
import { misGenerateSchema } from "@/lib/validations";

export async function GET(_req: NextRequest) {
  const user = await requireManager();
  if (user instanceof NextResponse) return user;
  const data = await prisma.mISReport.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: { select: { id: true, name: true } } },
    take: 100,
  });
  return NextResponse.json({ data });
}

// POST: generate (preview) or save final
export async function POST(req: NextRequest) {
  const user = await requireManager();
  if (user instanceof NextResponse) return user;

  const body = await req.json();
  const finalize = !!body.finalize;
  const title = String(body.title ?? "MIS Report");

  const parsed = misGenerateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  const v = parsed.data;

  const mis = await generateMIS({
    source: v.source,
    sandboxLabel: v.sandboxLabel,
    dateFrom: new Date(v.dateFrom),
    dateTo: new Date(v.dateTo),
    employeeIds: v.employeeIds,
    clientIds: v.clientIds,
  });

  if (!finalize) {
    return NextResponse.json({ data: mis });
  }

  const report = await prisma.mISReport.create({
    data: {
      title,
      periodStart: new Date(v.dateFrom),
      periodEnd: new Date(v.dateTo),
      sandboxLabel: v.sandboxLabel ?? null,
      isFinal: true,
      createdById: user.id,
      data: mis as any,
    },
  });
  await audit({ userId: user.id, action: "finalize", entity: "MISReport", entityId: report.id, meta: { title } });

  return NextResponse.json({ data: { id: report.id, title } }, { status: 201 });
}
