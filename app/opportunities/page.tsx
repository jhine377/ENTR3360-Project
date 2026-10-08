"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Project = {
  id: number;
  name: string;
  company: string;
  location: string;
  country: "Canada" | "USA";
  type: "Pipeline" | "Facility";
  stage: "Planning" | "Early Execution";
  budget: "Approved" | "Unknown";
  signal: string;
};

const projects: Project[] = [
  { id: 1, name: "Northern Pipeline Expansion", company: "Prairie Energy", location: "Alberta, Canada", country: "Canada", type: "Pipeline", stage: "Planning", budget: "Approved", signal: "Project leadership appointed" },
  { id: 2, name: "Gulf Processing Facility", company: "Frontier Resources", location: "Texas, USA", country: "USA", type: "Facility", stage: "Early Execution", budget: "Approved", signal: "Engineering team announced" },
  { id: 3, name: "Western Gas Connector", company: "Summit Infrastructure", location: "British Columbia, Canada", country: "Canada", type: "Pipeline", stage: "Planning", budget: "Unknown", signal: "Environmental assessment submitted" },
  { id: 4, name: "Prairie Compression Upgrade", company: "Northland Midstream", location: "Saskatchewan, Canada", country: "Canada", type: "Facility", stage: "Early Execution", budget: "Approved", signal: "Project manager appointed" },
  { id: 5, name: "Permian Gathering Expansion", company: "Mesa Infrastructure", location: "New Mexico, USA", country: "USA", type: "Pipeline", stage: "Planning", budget: "Unknown", signal: "Regulatory filing submitted" },
];

export default function OpportunitiesPage() {
  const [country, setCountry] = useState("All Countries");
  const [type, setType] = useState("All Project Types");

  const filtered = useMemo(
    () => projects.filter((project) =>
      (country === "All Countries" || project.country === country) &&
      (type === "All Project Types" || project.type === type)),
    [country, type]
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Market Intelligence Platform</p>
            <h1 className="mt-1 text-2xl font-bold">Opportunities</h1>
          </div>
          <Link className="text-sm font-semibold text-blue-700 hover:underline" href="/">← Dashboard</Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold tracking-tight">Early-Stage Project Opportunities</h2>
        <p className="mt-3 text-slate-600">Review potential capital projects and narrow the market based on geography and project type.</p>

        <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900">
          <strong>Prototype demonstration:</strong> All five opportunities below are fictional examples, not verified live projects.
        </div>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Opportunity filters">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Country</span>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-600 focus:outline-none" value={country} onChange={(event) => setCountry(event.target.value)}>
                <option>All Countries</option>
                <option>Canada</option>
                <option>USA</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Project Type</span>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-blue-600 focus:outline-none" value={type} onChange={(event) => setType(event.target.value)}>
                <option>All Project Types</option>
                <option>Pipeline</option>
                <option>Facility</option>
              </select>
            </label>
          </div>
          <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-5">
            <p aria-live="polite" className="text-sm text-slate-600">Showing <strong className="text-slate-900">{filtered.length}</strong> {filtered.length === 1 ? "opportunity" : "opportunities"}</p>
            <button type="button" onClick={() => { setCountry("All Countries"); setType("All Project Types"); }} className="text-sm font-semibold text-blue-700 hover:underline">Clear filters</button>
          </div>
        </section>

        <section className="mt-6 space-y-4" aria-label="Project results">
          {filtered.map((project) => (
            <Link href={`/opportunities/${project.id}`} key={project.id} className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:bg-blue-50">
              <div className="grid gap-6 md:grid-cols-[2fr_1fr_1fr_1fr_1.4fr] md:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{project.company}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{project.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{project.location}</p>
                </div>
                <div><p className="text-xs font-semibold uppercase text-slate-400">Type</p><p className="mt-1 text-sm">{project.type}</p></div>
                <div><p className="text-xs font-semibold uppercase text-slate-400">Stage</p><p className="mt-1 text-sm">{project.stage}</p></div>
                <div><p className="text-xs font-semibold uppercase text-slate-400">Budget</p><p className="mt-1 text-sm">{project.budget}</p></div>
                <div><p className="text-xs font-semibold uppercase text-slate-400">Latest Signal</p><p className="mt-1 text-sm">{project.signal}</p><span className="mt-2 inline-block text-xs font-semibold text-blue-700">View intelligence brief →</span></div>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">No sample opportunities match those filters. Try another combination.</div>}
        </section>
        <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">ENTR 3360 · MVP Prototype · Fictional demonstration data</footer>
      </div>
    </main>
  );
}
