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
    if (!user) {
      return;
    }

    const userId = user.id;

    async function loadSaved() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("saved_opportunities")
        .select(
          `
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
        `
        )
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
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Opportunity Intelligence Platform
              </p>

              <h1 className="mt-1 text-2xl font-bold">
                My Saved Opportunities
              </h1>
            </div>

            <Link
              href="/"
              className="text-sm font-semibold text-blue-700 hover:underline"
            >
              ← Dashboard
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="max-w-3xl text-slate-600">
            Saved opportunities are private to your signed-in account
            and persist in Supabase.
          </p>

          {loading && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Loading saved opportunities...
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
              <strong>Unable to load saved opportunities:</strong>{" "}
              {error}
            </div>
          )}

          {!loading && !error && saved.length === 0 && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center">
              <h2 className="text-xl font-bold">
                No saved opportunities yet
              </h2>

              <p className="mt-2 text-slate-600">
                Open an intelligence brief and use the Save
                Opportunity button to add projects here.
              </p>

              <Link
                href="/opportunities"
                className="mt-5 inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Explore Opportunities
              </Link>
            </div>
          )}

          {!loading && !error && saved.length > 0 && (
            <section className="mt-8 space-y-4">
              {saved.map((item) => {
                const project = Array.isArray(item.projects)
                  ? item.projects[0]
                  : item.projects;

                if (!project) return null;

                return (
                  <Link
                    key={item.id}
                    href={`/opportunities/${project.id}`}
                    className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold">
                            {project.project_name}
                          </h2>

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
                          {project.company_name} · {project.region},{" "}
                          {project.country}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
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
                );
              })}
            </section>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}