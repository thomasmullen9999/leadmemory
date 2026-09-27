import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/NavBar";
import { NewClientForm } from "@/components/NewClientForm";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const clients = await prisma.client.findMany({
    where: session.user.role === "ADMIN" ? {} : { ownerId: session.user.id },
    include: { deals: true },
    orderBy: { createdAt: "desc" },
  });

  const formatGBP = (pence: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

  return (
    <div>
      <NavBar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">Clients</h1>
        </div>

        <NewClientForm />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Open deals</th>
                <th className="px-4 py-3 font-medium">Pipeline value</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => {
                const openValue = client.deals
                  .filter((d) => d.stage !== "LOST" && d.stage !== "WON")
                  .reduce((sum, d) => sum + d.value, 0);
                return (
                  <tr key={client.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/clients/${client.id}`} className="text-slate-900 font-medium hover:underline">
                        {client.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{client.company ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {client.deals.filter((d) => d.stage !== "LOST" && d.stage !== "WON").length}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{formatGBP(openValue)}</td>
                  </tr>
                );
              })}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                    No clients yet. Add one above to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
