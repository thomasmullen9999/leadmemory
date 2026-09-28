import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/NavBar";

const claimStatusStyles: Record<string, string> = {
  NEW_ENQUIRY: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  EVIDENCE_REQUESTED: "bg-violet-100 text-violet-700",
  SUBMITTED: "bg-cyan-100 text-cyan-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  NOT_PROCEEDING: "bg-red-100 text-red-700",
};

const claimStatusLabels: Record<string, string> = {
  NEW_ENQUIRY: "New enquiry",
  CONTACTED: "Contacted",
  UNDER_REVIEW: "Under review",
  EVIDENCE_REQUESTED: "Evidence requested",
  SUBMITTED: "Submitted",
  RESOLVED: "Resolved",
  NOT_PROCEEDING: "Not proceeding",
};

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const clients = await prisma.client.findMany({
    where:
      session.user.role === "ADMIN"
        ? {}
        : { ownerId: session.user.id },
    include: {
      deals: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Internal workspace
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Claimants
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review incoming claim enquiries and manage active cases.
            </p>
          </div>

          <Link
            href="/start-a-claim"
            className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            View public claim form
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Claimant</th>
                  <th className="px-4 py-3">Claim type</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Open cases</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => {
                  const openCases = client.deals.filter(
                    (deal) =>
                      deal.stage !== "LOST" && deal.stage !== "WON",
                  ).length;

                  return (
                    <tr
                      key={client.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/clients/${client.id}`}
                          className="font-medium text-slate-900 hover:text-teal-700 hover:underline"
                        >
                          {client.name}
                        </Link>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {client.email ?? "No email address"}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-slate-700">
                        {client.claimType ?? "General enquiry"}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {client.providerName ?? "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            claimStatusStyles[client.status]
                          }`}
                        >
                          {claimStatusLabels[client.status]}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(client.createdAt)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {openCases}
                      </td>
                    </tr>
                  );
                })}

                {clients.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-12 text-center text-slate-400"
                    >
                      No claim enquiries have been submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}