import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/NavBar";
import { PipelineChart } from "@/components/PipelineChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null; // middleware handles the redirect

  const deals = await prisma.deal.findMany({
    where:
      session.user.role === "ADMIN"
        ? {}
        : { client: { ownerId: session.user.id } },
    include: { client: true },
  });

  const totalPipelineValue = deals
    .filter((d) => d.stage !== "LOST")
    .reduce((sum, d) => sum + d.value, 0);

  const wonThisMonth = deals.filter((d) => {
    const now = new Date();
    return (
      d.stage === "WON" &&
      d.updatedAt.getMonth() === now.getMonth() &&
      d.updatedAt.getFullYear() === now.getFullYear()
    );
  });

  const stageCounts = ["LEAD", "CONTACTED", "NEGOTIATING", "WON", "LOST"].map((stage) => ({
    stage,
    count: deals.filter((d) => d.stage === stage).length,
  }));

  const formatGBP = (pence: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

  return (
    <div>
      <NavBar />
      <main className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Active pipeline value" value={formatGBP(totalPipelineValue)} />
          <StatCard label="Deals won this month" value={String(wonThisMonth.length)} />
          <StatCard label="Total deals tracked" value={String(deals.length)} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-medium text-slate-500 mb-4">Deals by pipeline stage</h2>
          <PipelineChart data={stageCounts} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
