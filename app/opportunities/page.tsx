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
    if (!user) {
      return;
    }

    async function loadProjects() {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select(
          `
          id,
          project_name,
          company_name,
          country,
          region,
          project_type,
          lifecycle_stage,
          budget_status,
          description,
          data_origin
        `
        )
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
          latestSignalByProject.set(
            signal.project_id,
            signal.signal_title
          );
        }
      });

      const combinedProjects: ProjectWithSignal[] = (
        (projectData as Project[] | null) ?? []
      ).map((project) => ({
        ...project,
        latest_signal:
          latestSignalByProject.get(project.id) ??
          "No signal recorded",
      }));

      setProjects(combinedProjects);
      setLoading(false);
    }

    loadProjects();
  }, [user]);

  const filtered = useMemo(() => {
    return projects.filter(
      (project) =>
        (country === "All Countries" ||
          project.country === country) &&
        (type === "All Project Types" ||
          project.project_type === type)
    );
  }, [projects, country, type]);

  return (
    <RequireAuth>
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                Market Intelligence Platform
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                Opportunities
              </h1>
            </div>

            <Link
              className="text-sm font-semibold text-blue-700 hover:underline"
              href="/"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-6 py-10">
          <h2 className="text-3xl font-bold tracking-tight">
            Early-Stage Project Opportunities
          </h2>

          <p className="mt-3 max-w-3xl text-slate-600">
            Review capital project opportunities and narrow the
            market based on geography and project type. Project
            records are supported by development signals stored in
            the opportunity intelligence database.
          </p>

          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">
            <strong>Prototype dataset:</strong> This database
            contains 40 opportunity records, including public
            reference projects and synthetic demonstration data.
            Public reference projects are included to test the
            intelligence model against real-world project
            lifecycles. This prototype does not provide live market
            intelligence.
          </div>

          {/* Filters */}
          <section
            className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            aria-label="Opportunity filters"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Country
                </span>

                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-600 focus:outline-none"
                  value={country}
                  onChange={(event) =>
                    setCountry(event.target.value)
                  }
                >
                  <option>All Countries</option>
                  <option>Canada</option>
                  <option>USA</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Project Type
                </span>

                <select
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-600 focus:outline-none"
                  value={type}
                  onChange={(event) => setType(event.target.value)}
                >
                  <option>All Project Types</option>
                  <option>Pipeline</option>
                  <option>Facility</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
              <p
                aria-live="polite"
                className="text-sm text-slate-600"
              >
                Showing{" "}
                <strong className="text-slate-900">
                  {filtered.length}
                </strong>{" "}
                {filtered.length === 1
                  ? "opportunity"
                  : "opportunities"}
              </p>

              <button
                type="button"
                onClick={() => {
                  setCountry("All Countries");
                  setType("All Project Types");
                }}
                className="text-sm font-semibold text-blue-700 hover:underline"
              >
                Clear filters
              </button>
            </div>
          </section>

          {/* Loading */}
          {loading && (
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Loading opportunity intelligence...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              <strong>Unable to load opportunities:</strong>{" "}
              {error}
            </div>
          )}

          {/* Results */}
          {!loading && !error && (
            <section
              className="mt-6 space-y-4"
              aria-label="Project results"
            >
              {filtered.map((project) => (
                <Link
                  href={`/opportunities/${project.id}`}
                  key={project.id}
                  className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="grid gap-6 md:grid-cols-[2fr_1fr_1.2fr_1fr_1.5fr] md:items-center">
                    {/* Project */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                          {project.company_name}
                        </p>

                        <span
                          className={
                            project.data_origin ===
                            "Public Reference"
                              ? "rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800"
                              : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                          }
                        >
                          {project.data_origin ===
                          "Public Reference"
                            ? "Public Reference"
                            : "Synthetic Demo"}
                        </span>
                      </div>

                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {project.project_name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {project.region}, {project.country}
                      </p>
                    </div>

                    {/* Type */}
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Type
                      </p>

                      <p className="mt-1 text-sm">
                        {project.project_type}
                      </p>
                    </div>

                    {/* Stage */}
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Lifecycle Stage
                      </p>

                      <p className="mt-1 text-sm">
                        {project.lifecycle_stage}
                      </p>
                    </div>

                    {/* Budget */}
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Budget
                      </p>

                      <p className="mt-1 text-sm">
                        {project.budget_status}
                      </p>
                    </div>

                    {/* Signal */}
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">
                        Latest Signal
                      </p>

                      <p className="mt-1 text-sm">
                        {project.latest_signal}
                      </p>

                      <span className="mt-2 inline-block text-xs font-semibold text-blue-700">
                        View intelligence brief →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}

              {filtered.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
                  No opportunities match those filters. Try
                  another combination.
                </div>
              )}
            </section>
          )}

          <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
            ENTR 3360 · Opportunity Intelligence Prototype ·
            Supabase-backed demonstration dataset
          </footer>
        </div>
      </main>
    </RequireAuth>
  );
}