import Link from "next/link";
import AuthControls from "@/components/AuthControls";
import RequireAuth from "@/components/RequireAuth";

const projects = [
  {
    id: 1,
    name: "Northern Pipeline Expansion",
    company: "Prairie Energy",
    location: "Alberta, Canada",
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
    type: "Pipeline",
    stage: "Planning",
    budget: "Unknown",
    signal: "Regulatory filing submitted",
  },
];

const metrics = [
  {
    label: "Opportunities Tracked",
    value: projects.length,
    description: "Projects in the demonstration dataset",
  },
  {
    label: "Planning Stage",
    value: projects.filter((p) => p.stage === "Planning").length,
    description: "Projects at an early development stage",
  },
  {
    label: "Budget Approved",
    value: projects.filter((p) => p.budget === "Approved").length,
    description: "Projects with an approved budget",
  },
  {
    label: "Leadership Signals",
    value: projects.filter((p) =>
      ["appointed", "announced"].some((word) =>
        p.signal.toLowerCase().includes(word)
      )
    ).length,
    description: "Projects with leadership activity",
  },
];

export default function Home() {
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
              Discover early-stage capital projects, assess development
              signals, and identify opportunities worth pursuing.
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <AuthControls />

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
            <span className="font-semibold">Prototype demonstration:</span>{" "}
            This dashboard uses five fictional project examples to demonstrate
            the opportunity discovery and qualification workflow. It does not
            display live market intelligence.
          </p>
        </div>

        {/* Metrics */}
        <section className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Opportunity Overview</h2>

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
          <h2 className="text-xl font-bold">From Discovery to Decision</h2>

          <p className="mt-2 text-sm text-slate-600">
            A structured workflow for identifying and qualifying potential
            business development opportunities.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Discover",
                description:
                  "Explore potential pipeline and facility projects in relevant markets.",
              },
              {
                number: "02",
                title: "Evaluate",
                description:
                  "Review project stage, budget status, filings, and leadership signals.",
              },
              {
                number: "03",
                title: "Prioritize",
                description:
                  "Open an intelligence brief to assess whether an opportunity warrants further investigation.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
              >
                <p className="text-sm font-bold text-blue-700">
                  {step.number}
                </p>

                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">Featured Opportunities</h2>

              <p className="mt-1 text-sm text-slate-500">
                Select a project to review its development signals and
                leadership information.
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
              {projects.slice(0, 3).map((project) => (
                <Link
                  key={project.id}
                  href={`/opportunities/${project.id}`}
                  className="block p-5 transition hover:bg-blue-50"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {project.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {project.company} · {project.location}
                      </p>

                      <p className="mt-2 text-sm text-blue-700">
                        Signal: {project.signal}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                        {project.type}
                      </span>

                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                        {project.stage}
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
          ENTR 3360 · MVP Prototype · Fictional demonstration data
        </footer>
          </div>
    </main>
    </RequireAuth>
  );
}