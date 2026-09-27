"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Deal = {
  id: string;
  title: string;
  value: number;
  stage: string;
};

const STAGES = ["LEAD", "CONTACTED", "NEGOTIATING", "WON", "LOST"];

const stageColors: Record<string, string> = {
  LEAD: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  NEGOTIATING: "bg-amber-100 text-amber-700",
  WON: "bg-green-100 text-green-700",
  LOST: "bg-red-100 text-red-700",
};

export function DealList({ clientId, deals }: { clientId: string; deals: Deal[] }) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  async function updateStage(dealId: string, stage: string) {
    await fetch(`/api/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage }),
    });
    router.refresh();
  }

  async function addDeal(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, title, value: Math.round(parseFloat(value) * 100) }),
    });
    setTitle("");
    setValue("");
    setAdding(false);
    router.refresh();
  }

  const formatGBP = (pence: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

  return (
    <div className="space-y-2">
      {deals.map((deal) => (
        <div
          key={deal.id}
          className="bg-white border border-slate-200 rounded-lg p-3 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-medium text-slate-900">{deal.title}</p>
            <p className="text-xs text-slate-500">{formatGBP(deal.value)}</p>
          </div>
          <select
            value={deal.stage}
            onChange={(e) => updateStage(deal.id, e.target.value)}
            className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${stageColors[deal.stage]}`}
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ))}

      {adding ? (
        <form onSubmit={addDeal} className="bg-white border border-slate-200 rounded-lg p-3 flex gap-2 items-end">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Deal title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-slate-300 rounded-lg px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Value (£)</label>
            <input
              required
              type="number"
              step="0.01"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="border border-slate-300 rounded-lg px-2 py-1 text-sm w-28"
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white text-sm px-3 py-1.5 rounded-lg">
            Add
          </button>
          <button type="button" onClick={() => setAdding(false)} className="text-sm text-slate-500 px-2">
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setAdding(true)} className="text-sm text-slate-600 hover:text-slate-900">
          + Add deal
        </button>
      )}
    </div>
  );
}
