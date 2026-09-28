"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-slate-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            href={session ? "/dashboard" : "/start-a-claim"}
            className="font-semibold tracking-tight text-slate-900"
          >
            ClaimTrack
          </Link>

          {session && (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-slate-600 transition hover:text-slate-900"
              >
                Dashboard
              </Link>

              <Link
                href="/clients"
                className="text-sm text-slate-600 transition hover:text-slate-900"
              >
                Claimants
              </Link>
            </>
          )}

          <Link
            href="/start-a-claim"
            className="text-sm font-medium text-teal-700 transition hover:text-teal-900"
          >
            Start a claim
          </Link>
        </div>

        {session ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {session.user.name}
              <span className="mx-1 text-slate-300">&middot;</span>
              <span className="text-xs uppercase tracking-wide">
                {session.user.role}
              </span>
            </span>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-sm text-slate-500 transition hover:text-red-600"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-slate-600 transition hover:text-slate-900"
            >
              Staff login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}