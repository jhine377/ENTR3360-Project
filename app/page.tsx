const opportunities = [
  {
    name: "Northern Pipeline Expansion",
    company: "Prairie Energy",
    location: "Alberta, Canada",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Approved",
    signal: "Project leadership appointed",
  },
  {
    name: "Gulf Processing Facility",
    company: "Frontier Resources",
    location: "Texas, USA",
    sector: "Oil & Gas",
    type: "Facility",
    stage: "Early Execution",
    budget: "Approved",
    signal: "Engineering team announced",
  },
  {
    name: "Western Gas Connector",
    company: "Summit Infrastructure",
    location: "British Columbia, Canada",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Unknown",
    signal: "Environmental assessment submitted",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Market Intelligence Platform
            </p>
            <h1 className="text-xl font-semibold">
              Early-Stage Opportunity Intelligence
            </h1>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium">Business Development</p>
            <p className="text-xs text-slate-500">
              Initial view: Canada & USA · Oil & Gas
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Market Overview</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Identify early-stage capital project opportunities, evaluate
            qualification signals, and review the leadership teams associated
            with promising projects before formal procurement begins.
          </p>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Active Opportunities</p>
            <p className="mt-2 text-3xl font-semibold">18</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Early-Stage Projects</p>
            <p className="mt-2 text-3xl font-semibold">11</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Budget Confirmed</p>
            <p className="mt-2 text-3xl font-semibold">7</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Leadership Signals</p>
            <p className="mt-2 text-3xl font-semibold">6</p>
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Market Filters</h2>
            <p className="text-sm text-slate-500">
              The initial configuration reflects EPCMst&apos;s current focus,
              but the platform is designed to support broader sectors, regions,
              and project types.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Region
              </label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                <option>Canada & USA</option>
                <option>Canada</option>
                <option>USA</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sector
              </label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                <option>Oil & Gas</option>
                <option>Energy</option>
                <option>Infrastructure</option>
                <option>Industrial</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Project Type
              </label>
              <select className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                <option>Pipeline & Facility</option>
                <option>Pipeline</option>
                <option>Facility</option>
                <option>Other Capital Project</option>
              </select>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-lg font-semibold">Priority Opportunities</h2>
              <p className="text-sm text-slate-500">
                Projects showing signals that may justify further investigation.
              </p>
            </div>

            <a
              href="/opportunities"
              className="text-sm font-semibold text-slate-900 hover:underline"
            >
              View all opportunities →
            </a>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Project</th>
                    <th className="px-5 py-3">Location</th>
                    <th className="px-5 py-3">Sector</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Stage</th>
                    <th className="px-5 py-3">Budget</th>
                    <th className="px-5 py-3">Latest Signal</th>
                  </tr>
                </thead>

                <tbody>
                  {opportunities.map((opportunity) => (
                    <tr
                      key={opportunity.name}
                      className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium">{opportunity.name}</p>
                        <p className="text-xs text-slate-500">
                          {opportunity.company}
                        </p>
                      </td>
                      <td className="px-5 py-4">{opportunity.location}</td>
                      <td className="px-5 py-4">{opportunity.sector}</td>
                      <td className="px-5 py-4">{opportunity.type}</td>
                      <td className="px-5 py-4">{opportunity.stage}</td>
                      <td className="px-5 py-4">{opportunity.budget}</td>
                      <td className="px-5 py-4">{opportunity.signal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}