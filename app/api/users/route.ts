import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { audit, requireManager } from "@/lib/api-utils";
import { userSchema } from "@/lib/validations";

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS ?? "12", 10);

export async function GET(_req: NextRequest) {
  const user = await requireManager();
  if (user instanceof NextResponse) return user;
  const data = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      employeeCode: true,
      isActive: true,
      createdAt: true,
    },
  });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const user = await requireManager();
  if (user instanceof NextResponse) return user;
  const body = await req.json();
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  const { password, ...rest } = parsed.data;
  if (!password) return NextResponse.json({ error: "Password required" }, { status: 400 });
  const created = await prisma.user.create({
    data: { ...rest, password: await bcrypt.hash(password, ROUNDS) },
    select: { id: true, name: true, email: true, role: true, employeeCode: true, isActive: true },
  });
  await audit({ userId: user.id, action: "create", entity: "User", entityId: created.id });
  return NextResponse.json({ data: created }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await requireManager();
  if (user instanceof NextResponse) return user;
  const body = await req.json();
  const id = Number(body?.id);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const parsed = userSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  const data: any = { ...parsed.data };
  if (data.password) data.password = await bcrypt.hash(data.password, ROUNDS);
  else delete data.password;
  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, employeeCode: true, isActive: true },
  });
  await audit({ userId: user.id, action: "update", entity: "User", entityId: id });
  return NextResponse.json({ data: updated });
}

export async function DELETE(req: NextRequest) {
  const user = await requireManager();
  if (user instanceof NextResponse) return user;
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.user.update({ where: { id }, data: { isActive: false } });
  await audit({ userId: user.id, action: "deactivate", entity: "User", entityId: id });
  return NextResponse.json({ ok: true });
}
