"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, company, email }),
    });

    setSubmitting(false);
    setName("");
    setCompany("");
    setEmail("");
    setOpen(false);
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800"
      >
        + Add client
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap gap-3 items-end"
    >
      <div>
        <label className="block text-xs text-slate-500 mb-1">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Company</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs text-slate-500 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="bg-slate-900 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Save"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-sm text-slate-500 px-2"
      >
        Cancel
      </button>
    </form>
  );
}
