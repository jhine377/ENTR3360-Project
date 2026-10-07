"use client";

import { useState } from "react";

const opportunities = [
  {
    id: 1,
    name: "Northern Pipeline Expansion",
    company: "Prairie Energy",
    location: "Alberta, Canada",
    country: "Canada",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Approved",
    signal: "Project leadership appointed",
  },
  {
    id: 2,
    name: "Gulf Processing Facility",
    company: "Frontier Resources",
    location: "Texas, USA",
    country: "USA",
    sector: "Oil & Gas",
    type: "Facility",
    stage: "Early Execution",
    budget: "Approved",
    signal: "Engineering team announced",
  },
  {
    id: 3,
    name: "Western Gas Connector",
    company: "Summit Infrastructure",
    location: "British Columbia, Canada",
    country: "Canada",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Unknown",
    signal: "Environmental assessment submitted",
  },
  {
    id: 4,
    name: "Prairie Compression Upgrade",
    company: "Northland Midstream",
    location: "Saskatchewan, Canada",
    country: "Canada",
    sector: "Oil & Gas",
    type: "Facility",
    stage: "Early Execution",
    budget: "Approved",
    signal: "Project manager appointed",
  },
  {
    id: 5,
    name: "Permian Gathering Expansion",
    company: "Mesa Infrastructure",
    location: "New Mexico, USA",
    country: "USA",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Unknown",
    signal: "Regulatory filing submitted",
  },
];

export default function OpportunitiesPage() {
  const [country, setCountry] = useState("All");
  const [type, setType] = useState("All");

  const filteredOpportunities = opportunities.filter((opportunity) => {
    const countryMatches =
      country === "All" || opportunity.country === country;

    const typeMatches =
      type === "All" || opportunity.type === type;

    return countryMatches && typeMatches;
  });

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <a
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900"
            >
              Market Intelligence Platform
            </a>
            <h1 className="text-xl font-semibold">Opportunities</h1>
          </div>

          <a
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            Early-Stage Project Opportunities
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Review potential capital projects and narrow the market based on
            geography and project type.
          </p>
        </section>

        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Country
              </label>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="All">All Countries</option>
                <option value="Canada">Canada</option>
                <option value="USA">USA</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Project Type
              </label>
              <select
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="All">All Project Types</option>
                <option value="Pipeline">Pipeline</option>
                <option value="Facility">Facility</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {filteredOpportunities.length}
              </span>{" "}
              opportunities
            </p>

            <button
              onClick={() => {
                setCountry("All");
                setType("All");
              }}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Clear filters
            </button>
          </div>
        </section>

        <section className="space-y-4">
          {filteredOpportunities.map((opportunity) => (
            <a
              key={opportunity.id}
              href={`/opportunities/${opportunity.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {opportunity.company}
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    {opportunity.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {opportunity.location}
                  </p>
                </div>

                <div className="grid gap-4 text-sm sm:grid-cols-4 lg:min-w-[620px]">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Type
                    </p>
                    <p className="mt-1 font-medium">{opportunity.type}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Stage
                    </p>
                    <p className="mt-1 font-medium">{opportunity.stage}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Budget
                    </p>
                    <p className="mt-1 font-medium">{opportunity.budget}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      Latest Signal
                    </p>
                    <p className="mt-1 font-medium">{opportunity.signal}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </section>

        {filteredOpportunities.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="font-semibold">No matching opportunities</h3>
            <p className="mt-2 text-sm text-slate-500">
              Try changing or clearing the current filters.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}