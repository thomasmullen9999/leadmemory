import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/deals/:id — typically used to move a deal to a new pipeline stage
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id }, include: { client: true } });
  if (!deal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role !== "ADMIN" && deal.client.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await prisma.deal.update({
    where: { id },
    data: {
      stage: body.stage,
      value: body.value,
      title: body.title,
    },
  });

  return NextResponse.json(updated);
}
