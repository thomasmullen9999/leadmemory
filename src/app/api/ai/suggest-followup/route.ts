import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/ai/suggest-followup — generates a short, context-aware follow-up
// message suggestion for a client, based on their notes and deal history.
//
// This mirrors the kind of OpenAI API integration used in production
// (see: Twilio + OpenAI messaging system, Maddison Clarke Ltd).
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clientId } = await request.json();
  if (!clientId) return NextResponse.json({ error: "clientId is required" }, { status: 400 });

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      deals: { orderBy: { createdAt: "desc" }, take: 5 },
      notes: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  if (session.user.role !== "ADMIN" && client.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const context = `
Client: ${client.name} at ${client.company ?? "an unspecified company"}
Recent deals: ${client.deals.map((d) => `${d.title} (${d.stage}, £${(d.value / 100).toFixed(2)})`).join("; ") || "none"}
Recent notes: ${client.notes.map((n) => n.content).join(" | ") || "none"}
`.trim();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not set. Add it to .env to enable this feature." },
      { status: 501 }
    );
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful sales assistant. Given brief client context, write ONE short, natural follow-up message a sales rep could send. Keep it under 40 words, friendly, and specific to the context given. Do not use placeholders like [Name].",
        },
        { role: "user", content: context },
      ],
      max_tokens: 100,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json({ error: "OpenAI request failed", details: errText }, { status: 502 });
  }

  const data = await response.json();
  const suggestion = data.choices?.[0]?.message?.content ?? "No suggestion generated.";

  return NextResponse.json({ suggestion });
}
