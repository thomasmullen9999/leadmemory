"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="font-semibold text-slate-900">
          LeadMemory
        </Link>
        <Link href="/dashboard" className="text-sm text-slate-600 hover:text-slate-900">
          Dashboard
        </Link>
        <Link href="/clients" className="text-sm text-slate-600 hover:text-slate-900">
          Clients
        </Link>
      </div>

      {session && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">
            {session.user.name} <span className="text-slate-300">&middot;</span>{" "}
            <span className="uppercase text-xs tracking-wide">{session.user.role}</span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-slate-500 hover:text-red-600"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  );
}
