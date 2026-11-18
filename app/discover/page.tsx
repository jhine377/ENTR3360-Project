"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";

type DiscoveryResult = {
  title: string;
  url: string;
  snippet: string;
  date: string | null;
  lane: string;
  source_type:
    | "hiring_signal"
    | "regulatory_or_government"
    | "industry_or_project_source"
    | "general_web";
};

type DiscoveryResponse = {
  generated_at: string;
  lane_count: number;
  result_count: number;
  results: DiscoveryResult[];
  error?: string;
};

const sourceMeta: Record<
  DiscoveryResult["source_type"],
  { label: string; classes: string }
> = {
  hiring_signal: {
    label: "Hiring signal",
    classes: "border-amber-200 bg-amber-50 text-amber-800",
  },
  regulatory_or_government: {
    label: "Regulatory / government",
    classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  industry_or_project_source: {
    label: "Project / industry",
    classes: "border-blue-200 bg-blue-50 text-blue-700",
  },
  general_web: {
    label: "General web",
    classes: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

export default function DiscoverPage() {
  const { session } = useAuth();
  const [data, setData] = useState<DiscoveryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runDiscovery() {
    if (!session?.access_token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/opportunity-discovery", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const payload = (await response.json()) as DiscoveryResponse;

      if (!response.ok) {
        setError(
          payload.error ??
            "Live opportunity discovery is temporarily unavailable."
        );
        setData(null);
        return;
      }

      setData(payload);
    } catch {
      setError(
        "Live opportunity discovery is temporarily unavailable. Your existing opportunity data is still safe."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const grouped = useMemo(() => {
    if (!data) return [];

    const laneOrder = [
      "Pipeline & Midstream",
      "Facilities & Processing",
      "Thermal & Oil Sands",
      "LNG & Gas Processing",
      "General Capital Projects",
    ];

    return laneOrder.map((lane) => ({
      lane,
      items: data.results.filter((item) => item.lane === lane),
    }));
  }, [data]);

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
              <Link href="/discover" className="text-white">Discovery</Link>
              <Link href="/opportunities" className="hover:text-white">Opportunities</Link>
              <Link href="/saved" className="hidden hover:text-white sm:inline">Saved</Link>
            </nav>
          </div>
        </header>

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-10">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
                  Live market intelligence
                </p>
                <h1 className="mt-2 text-4xl font-black tracking-[-0.03em] text-slate-950">
                  Opportunity discovery inbox
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Scan multiple project-intelligence lanes for new external signals.
                  Hiring activity is retained as a signal and will later be evaluated
                  alongside stronger project, regulatory, and company evidence.
                </p>
              </div>

              <button
                onClick={runDiscovery}
                disabled={loading || !session}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Scanning live sources…" : "Run discovery now"}
              </button>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Assignment 5 test mode
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  The production design will support scheduled discovery. This button
                  triggers the same server route manually so the workflow can be tested
                  and demonstrated.
                </p>
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Server-side API
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
              <strong>Discovery unavailable:</strong> {error}
            </div>
          )}

          {!data && !loading && !error && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-700">
                ⌕
              </div>
              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Ready to scan for live opportunities
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                EPCMst will search focused capital-project lanes and return the raw
                external evidence. The next step is AI qualification into real
                opportunity candidates.
              </p>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <div className="text-sm font-bold text-slate-900">
                Scanning live project sources…
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Searching pipelines, facilities, thermal, LNG, and broader capital-project activity.
              </p>
            </div>
          )}

          {data && !loading && (
            <>
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Search lanes
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{data.lane_count}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Unique signals
                  </p>
                  <p className="mt-2 text-3xl font-black text-slate-950">{data.result_count}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    Last scan
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-950">
                    {new Date(data.generated_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {grouped.map(({ lane, items }) => (
                  <section
                    key={lane}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                          Discovery lane
                        </p>
                        <h2 className="mt-1 text-xl font-bold text-slate-950">{lane}</h2>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {items.length}
                      </span>
                    </div>

                    {items.length === 0 ? (
                      <div className="px-6 py-8 text-sm text-slate-400">
                        No unique signals returned in this lane.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {items.map((item) => {
                          const meta = sourceMeta[item.source_type];

                          return (
                            <article key={item.url} className="px-6 py-5">
                              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${meta.classes}`}>
                                      {meta.label}
                                    </span>
                                    {item.date && (
                                      <span className="text-xs font-medium text-slate-400">
                                        {item.date}
                                      </span>
                                    )}
                                  </div>

                                  <h3 className="mt-3 text-base font-bold text-slate-950">
                                    {item.title}
                                  </h3>
                                  {item.snippet && (
                                    <p className="mt-2 text-sm leading-6 text-slate-600">
                                      {item.snippet}
                                    </p>
                                  )}
                                </div>

                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="shrink-0 text-sm font-bold text-blue-700 hover:text-blue-800"
                                >
                                  Open source →
                                </a>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}
