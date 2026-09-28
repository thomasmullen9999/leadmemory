import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/NavBar";
import { PipelineChart } from "@/components/PipelineChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const clientWhere =
    session.user.role === "ADMIN"
      ? {}
      : { ownerId: session.user.id };

  const dealWhere =
    session.user.role === "ADMIN"
      ? {}
      : {
          client: {
            ownerId: session.user.id,
          },
        };

  const [deals, clients] = await Promise.all([
    prisma.deal.findMany({
      where: dealWhere,
      include: {
        client: true,
      },
    }),
    prisma.client.findMany({
      where: clientWhere,
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  const totalPipelineValue = deals
    .filter((deal) => deal.stage !== "LOST")
    .reduce((sum, deal) => sum + deal.value, 0);

  const wonThisMonth = deals.filter((deal) => {
    const now = new Date();

    return (
      deal.stage === "WON" &&
      deal.updatedAt.getMonth() === now.getMonth() &&
      deal.updatedAt.getFullYear() === now.getFullYear()
    );
  });

  const newEnquiries = clients.filter(
    (client) => client.status === "NEW_ENQUIRY",
  ).length;

  const stageCounts = [
    "LEAD",
    "CONTACTED",
    "NEGOTIATING",
    "WON",
    "LOST",
  ].map((stage) => ({
    stage,
    count: deals.filter((deal) => deal.stage === stage).length,
  }));

  const formatGBP = (pence: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(pence / 100);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
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
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor claim enquiries, active cases, and pipeline activity.
            </p>
          </div>

          <Link
            href="/start-a-claim"
            className="inline-flex items-center justify-center rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
          >
            Start a claim
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="New enquiries"
            value={String(newEnquiries)}
            detail="Awaiting first review"
          />

          <StatCard
            label="Claimants tracked"
            value={String(clients.length)}
            detail="Your visible claimant records"
          />

          <StatCard
            label="Active case value"
            value={formatGBP(totalPipelineValue)}
            detail="Excludes closed cases"
          />

          <StatCard
            label="Cases resolved this month"
            value={String(wonThisMonth.length)}
            detail="Based on completed case records"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-semibold text-slate-700">
              Cases by progress stage
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              A summary of internal case records linked to claimants.
            </p>

            <div className="mt-5">
              <PipelineChart data={stageCounts} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-700">
                  Recent enquiries
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Latest claim form submissions
                </p>
              </div>

              <Link
                href="/clients"
                className="text-sm font-medium text-teal-700 hover:text-teal-900"
              >
                View all
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="block px-5 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {client.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {client.claimType ?? "General enquiry"}
                      </p>
                    </div>

                    <span className="whitespace-nowrap text-xs text-slate-400">
                      {formatDate(client.createdAt)}
                    </span>
                  </div>
                </Link>
              ))}

              {clients.length === 0 && (
                <p className="px-5 py-10 text-center text-sm text-slate-400">
                  No enquiries have been submitted yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-400">{detail}</p>
    </div>
  );
}