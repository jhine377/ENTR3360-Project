"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";

type Project = {
  id: string;
  project_name: string;
  company_name: string;
  country: string;
  region: string;
  project_type: string;
  lifecycle_stage: string;
  budget_status: string;
  description: string | null;
  data_origin: string;
};

type ProjectSignal = {
  project_id: string;
  signal_title: string;
  signal_date: string;
};

type ProjectWithSignal = Project & {
  latest_signal: string;
};

export default function OpportunitiesPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithSignal[]>([]);
  const [country, setCountry] = useState("All Countries");
  const [type, setType] = useState("All Project Types");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function loadProjects() {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("id, project_name, company_name, country, region, project_type, lifecycle_stage, budget_status, description, data_origin")
        .order("project_name", { ascending: true });

      if (projectError) {
        setError(projectError.message);
        setLoading(false);
        return;
      }

      const { data: signalData, error: signalError } = await supabase
        .from("project_signals")
        .select("project_id, signal_title, signal_date")
        .order("signal_date", { ascending: false });

      if (signalError) {
        setError(signalError.message);
        setLoading(false);
        return;
      }

      const latestSignalByProject = new Map<string, string>();
      (signalData as ProjectSignal[] | null)?.forEach((signal) => {
        if (!latestSignalByProject.has(signal.project_id)) {
          latestSignalByProject.set(signal.project_id, signal.signal_title);
        }
      });

      setProjects(
        (((projectData as Project[] | null) ?? []).map((project) => ({
          ...project,
          latest_signal: latestSignalByProject.get(project.id) ?? "No signal recorded",
        })))
      );
      setLoading(false);
    }

    loadProjects();
  }, [user]);

  const filtered = useMemo(() => {
    return projects.filter(
      (project) =>
        (country === "All Countries" || project.country === country) &&
        (type === "All Project Types" || project.project_type === type)
    );
  }, [projects, country, type]);

  const filtersActive = country !== "All Countries" || type !== "All Project Types";

  return (
    <RequireAuth>
      <main className="min-h-screen text-slate-900">
        <header className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
            <Link href="/" className="flex items-center" aria-label="EPCMst Intelligence home">
              <img
                src="/epcmst-logo.png"
                alt="EPCMst"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white">Dashboard</Link>
              <Link href="/opportunities" className="text-white">Opportunities</Link>
              <Link href="/saved" className="hidden hover:text-white sm:inline">Saved</Link>
            </nav>
          </div>
        </header>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Opportunity pipeline</p>
            <div className="mt-2 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <h1 className="text-3xl font-black tracking-[-0.025em] text-slate-950 md:text-4xl">Early-stage project opportunities</h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                  Scan the market, narrow by geography and project type, then open a project intelligence brief for lifecycle, signal, and leadership context.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                <p className="text-2xl font-black text-slate-950">{filtered.length}</p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">visible opportunities</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Refine</p>
                  <h2 className="mt-1 font-bold text-slate-950">Market filters</h2>
                </div>
                {filtersActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setCountry("All Countries");
                      setType("All Project Types");
                    }}
                    className="text-xs font-bold text-blue-700 hover:text-blue-800"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="mt-6 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Country</span>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                  >
                    <option>All Countries</option>
                    <option>Canada</option>
                    <option>USA</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Project type</span>
                  <select
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none"
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                  >
                    <option>All Project Types</option>
                    <option>Pipeline</option>
                    <option>Facility</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Dataset note</p>
                <p className="mt-2 text-xs leading-5 text-blue-900">
                  Public-reference and synthetic records are clearly labeled. This prototype is not live market intelligence.
                </p>
              </div>
            </aside>

            <section aria-label="Project results">
              {loading && (
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                  Loading opportunity intelligence…
                </div>
              )}

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
                  <strong>Unable to load opportunities:</strong> {error}
                </div>
              )}

              {!loading && !error && (
                <div className="space-y-3">
                  {filtered.map((project) => (
                    <Link
                      href={`/opportunities/${project.id}`}
                      key={project.id}
                      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{project.company_name}</span>
                            <span
                              className={
                                project.data_origin === "Public Reference"
                                  ? "rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700"
                                  : "rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500"
                              }
                            >
                              {project.data_origin === "Public Reference" ? "Public reference" : "Synthetic demo"}
                            </span>
                          </div>

                          <h3 className="mt-2 text-lg font-bold text-slate-950 group-hover:text-blue-700">{project.project_name}</h3>
                          <p className="mt-1 text-sm text-slate-500">{project.region}, {project.country}</p>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                            <span className="font-semibold text-slate-800">Latest signal:</span> {project.latest_signal}
                          </p>
                        </div>

                        <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 xl:w-[430px]">
                          <div className="rounded-xl bg-slate-50 px-3 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Type</p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">{project.project_type}</p>
                          </div>
                          <div className="rounded-xl bg-blue-50 px-3 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-blue-400">Stage</p>
                            <p className="mt-1 text-sm font-semibold text-blue-800">{project.lifecycle_stage}</p>
                          </div>
                          <div className="col-span-2 rounded-xl bg-slate-50 px-3 py-3 sm:col-span-1">
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Budget</p>
                            <p className="mt-1 text-sm font-semibold text-slate-700">{project.budget_status}</p>
                          </div>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-blue-700">Open brief →</span>
                      </div>
                    </Link>
                  ))}

                  {filtered.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                      <h3 className="font-bold text-slate-900">No matches found</h3>
                      <p className="mt-2 text-sm text-slate-500">Try a different country or project type.</p>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>

          <footer className="mt-10 border-t border-slate-200 py-6 text-xs text-slate-400">
            ENTR 3360 · EPCMst Opportunity Intelligence · Supabase-backed prototype
          </footer>
        </div>
      </main>
    </RequireAuth>
  );
}
