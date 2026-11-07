"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";

type Project = {
  id: string;
  project_name: string;
  company_name: string;
  country: string;
  region: string;
  project_type: string;
  lifecycle_stage: string;
  budget_status: string;
  data_origin: string;
};

type PursuitStatus = "Saved" | "Monitoring" | "Researching" | "Outreach" | "Active Pursuit";

type SavedOpportunity = {
  id: string;
  project_id: string;
  saved_at: string;
  pursuit_status: PursuitStatus;
  projects: Project | Project[] | null;
};

const pursuitStatuses: PursuitStatus[] = [
  "Saved",
  "Monitoring",
  "Researching",
  "Outreach",
  "Active Pursuit",
];

const pursuitStatusMeta: Record<
  PursuitStatus,
  { icon: string; description: string; badge: string; panel: string }
> = {
  Saved: {
    icon: "☆",
    description: "Saved for review. Decide whether this opportunity should be monitored or actively worked.",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    panel: "border-violet-100 bg-violet-50/60",
  },
  Monitoring: {
    icon: "◉",
    description: "Watching for stronger project signals before taking action.",
    badge: "border-slate-200 bg-slate-100 text-slate-700",
    panel: "border-slate-200 bg-slate-50",
  },
  Researching: {
    icon: "⌕",
    description: "Validating scope, leadership, timing, and commercial fit.",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    panel: "border-blue-100 bg-blue-50/60",
  },
  Outreach: {
    icon: "↗",
    description: "Preparing or making contact with project stakeholders.",
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    panel: "border-amber-100 bg-amber-50/60",
  },
  "Active Pursuit": {
    icon: "◆",
    description: "Actively pursuing the opportunity with defined next actions.",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-emerald-100 bg-emerald-50/60",
  },
};

export default function SavedOpportunitiesPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const userId = user.id;

    async function loadSaved() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("saved_opportunities")
        .select(`
          id,
          project_id,
          saved_at,
          pursuit_status,
          projects (
            id,
            project_name,
            company_name,
            country,
            region,
            project_type,
            lifecycle_stage,
            budget_status,
            data_origin
          )
        `)
        .eq("user_id", userId)
        .order("saved_at", { ascending: false });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setSaved((data ?? []) as SavedOpportunity[]);
      setLoading(false);
    }

    loadSaved();
  }, [user]);

  async function updatePursuitStatus(id: string, pursuit_status: PursuitStatus) {
    if (!user) return;

    const { error } = await supabase
      .from("saved_opportunities")
      .update({ pursuit_status })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      setError(error.message);
      return;
    }

    setSaved((current) =>
      current.map((item) =>
        item.id === id ? { ...item, pursuit_status } : item
      )
    );
  }

  return (
    <RequireAuth>
      <main className="min-h-screen text-slate-900">
        <header className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
            <Link href="/" className="flex items-center" aria-label="EPCMst Intelligence home">
              <img
                src="/epcmst-logo.png"
                alt="EPCMst"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white">Dashboard</Link>
              <Link href="/opportunities" className="hover:text-white">Opportunities</Link>
              <Link href="/saved" className="text-white">Saved</Link>
            </nav>
          </div>
        </header>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Personal watchlist</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.025em] text-slate-950 md:text-4xl">Saved opportunities</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Keep priority projects close at hand. Saved records are tied to your authenticated account and persist in Supabase.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-6 py-8">
          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading saved opportunities…
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              <strong>Unable to load saved opportunities:</strong> {error}
            </div>
          )}

          {!loading && !error && saved.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-700">☆</div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">No saved opportunities yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Open a project intelligence brief and save the opportunities you want to revisit.
              </p>
              <Link href="/opportunities" className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700">
                Explore opportunities
              </Link>
            </div>
          )}

          {!loading && !error && saved.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-500">{saved.length} saved {saved.length === 1 ? "project" : "projects"}</p>
                <Link href="/opportunities" className="text-sm font-bold text-blue-700 hover:text-blue-800">Explore more →</Link>
              </div>

              <section className="space-y-4">
                {pursuitStatuses.map((groupStatus) => {
                  const groupItems = saved.filter(
                    (item) => (item.pursuit_status ?? "Saved") === groupStatus
                  );
                  const groupMeta = pursuitStatusMeta[groupStatus];

                  return (
                    <details
                      key={groupStatus}
                      open={groupStatus === "Saved" || groupItems.length > 0}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg font-black ${groupMeta.badge}`}>
                            {groupMeta.icon}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-bold text-slate-950">{groupStatus}</h2>
                              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">
                                {groupItems.length}
                              </span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">{groupMeta.description}</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-slate-400 transition group-open:rotate-180">⌄</span>
                      </summary>

                      <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                        {groupItems.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-6 text-center text-sm text-slate-400">
                            No opportunities in this stage.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {groupItems.map((item) => {
                              const project = Array.isArray(item.projects)
                                ? item.projects[0]
                                : item.projects;
                              if (!project) return null;

                              return (
                                <div
                                  key={item.id}
                                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                          href={`/opportunities/${project.id}`}
                                          className="text-lg font-bold text-slate-950 hover:text-blue-700"
                                        >
                                          {project.project_name}
                                        </Link>
                                        {project.data_origin === "Public Reference" && (
                                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                            Public reference
                                          </span>
                                        )}
                                      </div>
                                      <p className="mt-1 text-sm text-slate-500">
                                        {project.company_name} · {project.region}, {project.country}
                                      </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                        {project.project_type}
                                      </span>
                                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                                        {project.lifecycle_stage}
                                      </span>
                                      <Link
                                        href={`/opportunities/${project.id}`}
                                        className="ml-1 text-sm font-bold text-blue-700"
                                      >
                                        Open brief →
                                      </Link>
                                    </div>
                                  </div>

                                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Next action
                                      </p>
                                      <p className="mt-1 text-sm text-slate-600">
                                        {groupStatus === "Saved"
                                          ? "Review the opportunity and decide whether it should enter the pursuit workflow."
                                          : groupStatus === "Monitoring"
                                          ? "Watch for stronger project, funding, leadership, or regulatory signals."
                                          : groupStatus === "Researching"
                                          ? "Validate project scope, timing, key stakeholders, and commercial fit."
                                          : groupStatus === "Outreach"
                                          ? "Prepare or complete stakeholder outreach and capture what you learn."
                                          : "Advance the opportunity with defined BD actions and follow-up."}
                                      </p>
                                    </div>

                                    <label className="shrink-0">
                                      <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                                        Move to
                                      </span>
                                      <select
                                        value={groupStatus}
                                        onChange={(event) =>
                                          updatePursuitStatus(
                                            item.id,
                                            event.target.value as PursuitStatus
                                          )
                                        }
                                        className="min-w-44 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 shadow-sm outline-none transition hover:border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                      >
                                        {pursuitStatuses.map((option) => (
                                          <option key={option} value={option}>
                                            {option}
                                          </option>
                                        ))}
                                      </select>
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })}
              </section>
            </>
          )}

          <footer className="mt-10 border-t border-slate-200 py-6 text-xs text-slate-400">
            ENTR 3360 · EPCMst Opportunity Intelligence · Supabase-backed prototype
          </footer>
        </div>
      </main>
    </RequireAuth>
  );
}
