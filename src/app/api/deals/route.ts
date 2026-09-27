import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/deals — create a new deal against a client the user owns (or any client, if admin)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { clientId, title, value, stage } = body;

  if (!clientId || !title || value === undefined) {
    return NextResponse.json({ error: "clientId, title, and value are required" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { id: clientId } });
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  if (session.user.role !== "ADMIN" && client.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const deal = await prisma.deal.create({
    data: { clientId, title, value, stage: stage ?? "LEAD" },
  });

  return NextResponse.json(deal, { status: 201 });
}
