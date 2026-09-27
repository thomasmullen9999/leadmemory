import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/NavBar";
import { DealList } from "@/components/DealList";
import { FollowUpSuggestion } from "@/components/FollowUpSuggestion";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      deals: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) notFound();
  if (session.user.role !== "ADMIN" && client.ownerId !== session.user.id) notFound();

  return (
    <div>
      <NavBar />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{client.name}</h1>
          <p className="text-slate-500 text-sm">
            {client.company} {client.email ? `· ${client.email}` : ""}
          </p>
        </div>

        <FollowUpSuggestion clientId={client.id} />

        <section>
          <h2 className="text-sm font-medium text-slate-500 mb-2">Deals</h2>
          <DealList clientId={client.id} deals={client.deals} />
        </section>

        <section>
          <h2 className="text-sm font-medium text-slate-500 mb-2">Notes</h2>
          <div className="space-y-2">
            {client.notes.length === 0 && (
              <p className="text-slate-400 text-sm">No notes yet.</p>
            )}
            {client.notes.map((note) => (
              <div key={note.id} className="bg-white border border-slate-200 rounded-lg p-3 text-sm text-slate-700">
                {note.content}
                <div className="text-xs text-slate-400 mt-1">
                  {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(note.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
