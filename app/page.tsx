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
    if (!user) {
      return;
    }

    async function loadDashboard() {
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
        .select(
          `
          project_id,
          signal_type,
          signal_title,
          signal_date
        `
        )
        .order("signal_date", { ascending: false });

      if (signalError) {
        setError(signalError.message);
        setLoading(false);
        return;
      }

      const latestSignalByProject = new Map<string, string>();

      (signalData as Signal[] | null)?.forEach((signal) => {
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
      setSignals((signalData as Signal[] | null) ?? []);
      setLoading(false);
    }

    loadDashboard();
  }, [user]);

  const metrics = useMemo(() => {
    const earlyStages = [
      "Discovery",
      "Early Planning",
      "Feasibility",
      "Regulatory & Environmental",
    ];

    const leadershipProjectIds = new Set(
      signals
        .filter((signal) =>
          signal.signal_type
            .toLowerCase()
            .includes("leadership")
        )
        .map((signal) => signal.project_id)
    );

    return [
      {
        label: "Opportunities Tracked",
        value: projects.length,
        description: "Projects stored in the Supabase database",
      },
      {
        label: "Early-Stage Projects",
        value: projects.filter((project) =>
          earlyStages.includes(project.lifecycle_stage)
        ).length,
        description:
          "Projects in discovery, planning, feasibility, or regulatory stages",
      },
      {
        label: "Budget Approved",
        value: projects.filter(
          (project) => project.budget_status === "Approved"
        ).length,
        description:
          "Projects with approved capital status in the dataset",
      },
      {
        label: "Leadership Signals",
        value: leadershipProjectIds.size,
        description:
          "Projects with leadership activity identified",
      },
    ];
  }, [projects, signals]);

  const featuredProjects = useMemo(() => {
    const publicReferences = projects.filter(
      (project) =>
        project.data_origin === "Public Reference"
    );

    if (publicReferences.length >= 3) {
      return publicReferences.slice(0, 3);
    }

    return projects.slice(0, 3);
  }, [projects]);

  return (
    <RequireAuth>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-10">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-5 border-b border-slate-200 pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-700">
                Opportunity Intelligence Platform
              </p>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Business Development Intelligence
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Discover early-stage capital projects, assess
                development signals, and identify opportunities
                worth pursuing before formal procurement begins.
              </p>
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:items-end">
              <AuthControls />
              <Link
  href="/saved"
  className="text-sm font-semibold text-blue-700 hover:underline"
>
  My Saved Opportunities
</Link>

              <Link
                href="/opportunities"
                className="inline-flex items-center justify-center rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Explore Opportunities →
              </Link>
            </div>
          </div>

          {/* Dataset notice */}
          <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">
                Prototype dataset:
              </span>{" "}
              This dashboard is powered by a Supabase database
              containing 40 project opportunities and 120 project
              signals. The dataset combines synthetic demonstration
              records with selected public reference projects to test
              the opportunity intelligence workflow. It does not
              provide live market intelligence.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="mb-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Loading opportunity intelligence...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
              <strong>Unable to load dashboard:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Metrics */}
              <section className="mb-10">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Opportunity Overview
                  </h2>

                  <span className="text-sm text-slate-500">
                    Canada &amp; United States
                  </span>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {metrics.map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <p className="text-sm font-medium text-slate-500">
                        {metric.label}
                      </p>

                      <p className="mt-3 text-4xl font-bold text-slate-900">
                        {metric.value}
                      </p>

                      <p className="mt-3 text-sm text-slate-500">
                        {metric.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Workflow */}
              <section className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold">
                  From Discovery to Decision
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  A structured workflow for identifying,
                  contextualizing, and prioritizing potential business
                  development opportunities.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {[
                    {
                      number: "01",
                      title: "Discover",
                      description:
                        "Identify potential pipeline and facility projects using early public project signals.",
                    },
                    {
                      number: "02",
                      title: "Evaluate",
                      description:
                        "Review lifecycle stage, budget status, regulatory activity, engineering signals, and project leadership.",
                    },
                    {
                      number: "03",
                      title: "Prioritize",
                      description:
                        "Use the Project Intelligence Brief and signal stack to assess whether an opportunity warrants active pursuit.",
                    },
                  ].map((step) => (
                    <div
                      key={step.number}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="text-sm font-bold text-blue-700">
                        {step.number}
                      </p>

                      <h3 className="mt-3 text-lg font-semibold">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Featured Opportunities */}
              <section>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      Featured Opportunities
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Review selected project records and open their
                      intelligence briefs for lifecycle, signal, and
                      leadership context.
                    </p>
                  </div>

                  <Link
                    href="/opportunities"
                    className="text-sm font-semibold text-blue-700 hover:underline"
                  >
                    View all opportunities →
                  </Link>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="divide-y divide-slate-200">
                    {featuredProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/opportunities/${project.id}`}
                        className="block p-5 transition hover:bg-blue-50"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-semibold text-slate-900">
                                {project.project_name}
                              </h3>

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

                            <p className="mt-1 text-sm text-slate-500">
                              {project.company_name} ·{" "}
                              {project.region}, {project.country}
                            </p>

                            <p className="mt-2 text-sm text-blue-700">
                              Latest signal:{" "}
                              {project.latest_signal}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                              {project.project_type}
                            </span>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                              {project.lifecycle_stage}
                            </span>

                            <span className="text-sm font-semibold text-blue-700">
                              View Brief →
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
                ENTR 3360 · Opportunity Intelligence Prototype ·
                Supabase-backed demonstration dataset
              </footer>
            </>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}