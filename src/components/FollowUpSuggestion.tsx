"use client";

import { useState } from "react";

export function FollowUpSuggestion({ clientId }: { clientId: string }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setSuggestion(null);

    const res = await fetch("/api/ai/suggest-followup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      return;
    }

    setSuggestion(data.suggestion);
  }

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-indigo-900">AI follow-up suggestion</h2>
        <button
          onClick={generate}
          disabled={loading}
          className="text-xs bg-indigo-900 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-800 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Generate suggestion"}
        </button>
      </div>

      {suggestion && <p className="text-sm text-indigo-950 mt-3 italic">&ldquo;{suggestion}&rdquo;</p>}
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </div>
  );
}
