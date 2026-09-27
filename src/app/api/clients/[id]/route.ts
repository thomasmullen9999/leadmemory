import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getClientOr403(id: string, userId: string, role: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: { deals: { orderBy: { createdAt: "desc" } }, notes: { orderBy: { createdAt: "desc" } } },
  });

  if (!client) return { client: null, status: 404 };
  if (role !== "ADMIN" && client.ownerId !== userId) return { client: null, status: 403 };

  return { client, status: 200 };
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { client, status } = await getClientOr403(id, session.user.id, session.user.role);
  if (!client) return NextResponse.json({ error: "Not found or forbidden" }, { status });

  return NextResponse.json(client);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { client, status } = await getClientOr403(id, session.user.id, session.user.role);
  if (!client) return NextResponse.json({ error: "Not found or forbidden" }, { status });

  const body = await request.json();
  const updated = await prisma.client.update({
    where: { id },
    data: {
      name: body.name,
      company: body.company,
      email: body.email,
      phone: body.phone,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { client, status } = await getClientOr403(id, session.user.id, session.user.role);
  if (!client) return NextResponse.json({ error: "Not found or forbidden" }, { status });

  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
