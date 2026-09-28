import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/NavBar";
import { DealList } from "@/components/DealList";
import { FollowUpSuggestion } from "@/components/FollowUpSuggestion";

const statusLabels: Record<string, string> = {
  NEW_ENQUIRY: "New enquiry",
  CONTACTED: "Contacted",
  UNDER_REVIEW: "Under review",
  EVIDENCE_REQUESTED: "Evidence requested",
  SUBMITTED: "Submitted",
  RESOLVED: "Resolved",
  NOT_PROCEEDING: "Not proceeding",
};

const statusStyles: Record<string, string> = {
  NEW_ENQUIRY: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  UNDER_REVIEW: "bg-amber-100 text-amber-700",
  EVIDENCE_REQUESTED: "bg-violet-100 text-violet-700",
  SUBMITTED: "bg-cyan-100 text-cyan-700",
  RESOLVED: "bg-emerald-100 text-emerald-700",
  NOT_PROCEEDING: "bg-red-100 text-red-700",
};

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: {
      id,
    },
    include: {
      deals: {
        orderBy: {
          createdAt: "desc",
        },
      },
      notes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!client) {
    notFound();
  }

  if (
    session.user.role !== "ADMIN" &&
    client.ownerId !== session.user.id
  ) {
    notFound();
  }

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
                Claimant profile
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                {client.name}
              </h1>

              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500">
                {client.email && <span>{client.email}</span>}
                {client.phone && <span>{client.phone}</span>}
                {client.postcode && <span>{client.postcode}</span>}
              </div>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${
                statusStyles[client.status]
              }`}
            >
              {statusLabels[client.status]}
            </span>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-base font-semibold text-slate-900">
            Claim enquiry
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <DetailItem
              label="Claim type"
              value={client.claimType ?? "General enquiry"}
            />

            <DetailItem
              label="Provider or company"
              value={client.providerName ?? "Not provided"}
            />

            <DetailItem
              label="Account or reference"
              value={client.claimReference ?? "Not provided"}
            />

            <DetailItem
              label="Approximate issue date"
              value={client.issueStartDate ?? "Not provided"}
            />

            <DetailItem
              label="Preferred contact method"
              value={client.preferredContact ?? "Not provided"}
            />

            <DetailItem
              label="Submitted"
              value={formatDate(client.createdAt)}
            />

            <DetailItem
              label="Previous complaint raised"
              value={client.previousComplaint ? "Yes" : "No"}
            />

            <DetailItem
              label="Supporting evidence available"
              value={client.hasSupportingEvidence ? "Yes" : "No"}
            />
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-slate-700">
              Enquiry summary
            </p>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {client.claimSummary ?? "No summary was provided."}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm font-medium text-slate-700">Consent</p>

            <div className="mt-2 space-y-1 text-sm text-slate-600">
              <p>
                Contact consent:{" "}
                <span className="font-medium text-slate-800">
                  {client.consentToContact ? "Provided" : "Not recorded"}
                </span>
              </p>

              <p>
                Privacy acknowledgment:{" "}
                <span className="font-medium text-slate-800">
                  {client.privacyAcceptedAt
                    ? formatDate(client.privacyAcceptedAt)
                    : "Not recorded"}
                </span>
              </p>
            </div>
          </div>
        </section>

        <FollowUpSuggestion clientId={client.id} />

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Claim cases
          </h2>

          <DealList clientId={client.id} deals={client.deals} />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Internal notes
          </h2>

          <div className="space-y-3">
            {client.notes.length === 0 && (
              <p className="text-sm text-slate-400">
                No internal notes have been added yet.
              </p>
            )}

            {client.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700"
              >
                <p className="whitespace-pre-wrap">{note.content}</p>

                <p className="mt-2 text-xs text-slate-400">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">{value}</p>
    </div>
  );
}