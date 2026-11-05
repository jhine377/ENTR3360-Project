"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthControls from "@/components/AuthControls";
import RequireAuth from "@/components/RequireAuth";
import { supabase } from "@/lib/supabase";
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

type Signal = {
  project_id: string;
  signal_type: string;
  signal_title: string;
  signal_date: string;
};

type ProjectWithSignal = Project & {
  latest_signal: string;
};

export default function Home() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectWithSignal[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function loadDashboard() {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("id, project_name, company_name, country, region, project_type, lifecycle_stage, budget_status, data_origin")
        .order("project_name", { ascending: true });

      if (projectError) {
        setError(projectError.message);
        setLoading(false);
        return;
      }

      const { data: signalData, error: signalError } = await supabase
        .from("project_signals")
        .select("project_id, signal_type, signal_title, signal_date")
        .order("signal_date", { ascending: false });

      if (signalError) {
        setError(signalError.message);
        setLoading(false);
        return;
      }

      const latestSignalByProject = new Map<string, string>();
      (signalData as Signal[] | null)?.forEach((signal) => {
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
      setSignals((signalData as Signal[] | null) ?? []);
      setLoading(false);
    }

    loadDashboard();
  }, [user]);

  const metrics = useMemo(() => {
    const earlyStages = ["Discovery", "Early Planning", "Feasibility", "Regulatory & Environmental"];
    const leadershipProjectIds = new Set(
      signals
        .filter((signal) => signal.signal_type.toLowerCase().includes("leadership"))
        .map((signal) => signal.project_id)
    );

    return [
      { label: "Tracked", value: projects.length, note: "Total opportunities" },
      { label: "Early stage", value: projects.filter((p) => earlyStages.includes(p.lifecycle_stage)).length, note: "Before procurement" },
      { label: "Budget approved", value: projects.filter((p) => p.budget_status === "Approved").length, note: "Capital signal" },
      { label: "Leadership signals", value: leadershipProjectIds.size, note: "People signal" },
    ];
  }, [projects, signals]);

  const featuredProjects = useMemo(() => {
    const refs = projects.filter((project) => project.data_origin === "Public Reference");
    return refs.length >= 3 ? refs.slice(0, 3) : projects.slice(0, 3);
  }, [projects]);

  return (
    <RequireAuth>
      <main className="min-h-screen text-slate-900">
        <header className="bg-slate-950 text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-black">E</div>
              <div>
                <p className="text-sm font-bold">EPCMst Intelligence</p>
                <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Opportunity platform</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 lg:flex">
              <Link href="/" className="text-white">Dashboard</Link>
              <Link href="/opportunities" className="hover:text-white">Opportunities</Link>
              <Link href="/saved" className="hover:text-white">Saved</Link>
            </nav>

            <AuthControls />
          </div>
        </header>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10 md:py-12">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  Business development intelligence
                </div>
                <h1 className="text-4xl font-black tracking-[-0.03em] text-slate-950 md:text-5xl">
                  Find the signal before the RFP.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                  Surface early-stage capital projects, assess project momentum, and identify the right time for commercial pursuit.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link href="/saved" className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50">
                  Saved opportunities
                </Link>
                <Link href="/opportunities" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700">
                  Explore opportunities →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
            <p><span className="font-bold">Prototype dataset.</span> 40 projects and 120 signals combine synthetic records with selected public references.</p>
            <span className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-amber-700">Not live market intelligence</span>
          </div>

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
              Loading opportunity intelligence…
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              <strong>Unable to load dashboard:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <section className="mb-8">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Portfolio pulse</p>
                    <h2 className="mt-1 text-xl font-bold text-slate-950">Opportunity overview</h2>
                  </div>
                  <span className="text-xs font-medium text-slate-500">Canada & United States</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {metrics.map((metric) => (
                    <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="mb-5 h-1 w-10 rounded-full bg-blue-600" />
                      <p className="text-sm font-semibold text-slate-500">{metric.label}</p>
                      <div className="mt-2 flex items-end justify-between gap-4">
                        <p className="text-4xl font-black tracking-tight text-slate-950">{metric.value}</p>
                        <p className="text-right text-xs text-slate-400">{metric.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Priority review</p>
                      <h2 className="mt-1 text-xl font-bold text-slate-950">Featured opportunities</h2>
                    </div>
                    <Link href="/opportunities" className="text-sm font-semibold text-blue-700 hover:text-blue-800">
                      View all →
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {featuredProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/opportunities/${project.id}`}
                        className="group block px-6 py-5 hover:bg-slate-50"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate font-bold text-slate-950 group-hover:text-blue-700">{project.project_name}</h3>
                              {project.data_origin === "Public Reference" && (
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">Public</span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{project.company_name} · {project.region}, {project.country}</p>
                            <p className="mt-3 text-sm text-slate-700">
                              <span className="font-semibold">Latest signal:</span> {project.latest_signal}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-wrap gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{project.project_type}</span>
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{project.lifecycle_stage}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>

                <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">How to use it</p>
                  <h2 className="mt-2 text-2xl font-bold">From market noise to pursuit decision.</h2>
                  <div className="mt-7 space-y-6">
                    {[
                      ["01", "Discover", "Spot pipeline and facility opportunities through early public signals."],
                      ["02", "Evaluate", "Review lifecycle stage, capital status, leadership, and project activity."],
                      ["03", "Prioritize", "Open the intelligence brief and decide whether the opportunity warrants pursuit."],
                    ].map(([number, title, description]) => (
                      <div key={number} className="flex gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-xs font-black text-blue-300">{number}</div>
                        <div>
                          <h3 className="font-bold">{title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <footer className="mt-10 border-t border-slate-200 py-6 text-xs text-slate-400">
                ENTR 3360 · EPCMst Opportunity Intelligence · Supabase-backed prototype
              </footer>
            </>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}
