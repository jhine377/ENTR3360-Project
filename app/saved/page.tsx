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

type SavedOpportunity = {
  id: string;
  project_id: string;
  saved_at: string;
  projects: Project | Project[] | null;
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

  return (
    <RequireAuth>
      <main className="min-h-screen text-slate-900">
        <header className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-black">E</div>
              <div>
                <p className="text-sm font-bold">EPCMst Intelligence</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Opportunity platform</p>
              </div>
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

              <section className="space-y-3">
                {saved.map((item) => {
                  const project = Array.isArray(item.projects) ? item.projects[0] : item.projects;
                  if (!project) return null;

                  return (
                    <Link
                      key={item.id}
                      href={`/opportunities/${project.id}`}
                      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-950 group-hover:text-blue-700">{project.project_name}</h2>
                            {project.data_origin === "Public Reference" && (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Public reference</span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{project.company_name} · {project.region}, {project.country}</p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{project.project_type}</span>
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{project.lifecycle_stage}</span>
                          <span className="ml-1 text-sm font-bold text-blue-700">Open brief →</span>
                        </div>
                      </div>
                    </Link>
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
