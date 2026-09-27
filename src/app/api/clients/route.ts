import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/clients — list clients.
// Admins see everyone's clients; sales reps only see their own.
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clients = await prisma.client.findMany({
    where: session.user.role === "ADMIN" ? {} : { ownerId: session.user.id },
    include: { deals: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(clients);
}

// POST /api/clients — create a new client, owned by the current user.
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, company, email, phone } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: { name, company, email, phone, ownerId: session.user.id },
  });

  return NextResponse.json(client, { status: 201 });
}
