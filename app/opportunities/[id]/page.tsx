import Link from "next/link";

const opportunities = [
  {
    id: "1",
    name: "Northern Pipeline Expansion",
    company: "Prairie Energy",
    location: "Alberta, Canada",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Approved",
    signal: "Project leadership appointed",
    summary:
      "A proposed pipeline expansion intended to increase transportation capacity between existing production and processing infrastructure in Alberta.",
    leadership: [
      {
        name: "Sarah Mitchell",
        role: "Project Director",
        status: "Recently appointed",
      },
      {
        name: "Daniel Brooks",
        role: "VP, Major Projects",
        status: "Current leadership",
      },
      {
        name: "Emily Chen",
        role: "Engineering Manager",
        status: "Current leadership",
      },
    ],
    signals: [
      { label: "Budget confirmed", status: "Confirmed" },
      { label: "Leadership appointed", status: "Confirmed" },
      { label: "Environmental assessment", status: "Unknown" },
      { label: "Hiring activity", status: "Unknown" },
    ],
  },
  {
    id: "2",
    name: "Gulf Processing Facility",
    company: "Frontier Resources",
    location: "Texas, USA",
    sector: "Oil & Gas",
    type: "Facility",
    stage: "Early Execution",
    budget: "Approved",
    signal: "Engineering team announced",
    summary:
      "A proposed gas-processing facility intended to support increased production volumes and regional infrastructure requirements.",
    leadership: [
      {
        name: "Michael Torres",
        role: "Project Executive",
        status: "Current leadership",
      },
      {
        name: "Rachel Singh",
        role: "Engineering Director",
        status: "Recently appointed",
      },
    ],
    signals: [
      { label: "Budget confirmed", status: "Confirmed" },
      { label: "Leadership appointed", status: "Confirmed" },
      { label: "Environmental assessment", status: "Unknown" },
      { label: "Hiring activity", status: "Confirmed" },
    ],
  },
  {
    id: "3",
    name: "Western Gas Connector",
    company: "Summit Infrastructure",
    location: "British Columbia, Canada",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Unknown",
    signal: "Environmental assessment submitted",
    summary:
      "An early-stage natural gas pipeline project connecting regional production areas with downstream infrastructure.",
    leadership: [
      {
        name: "David Foster",
        role: "Director, Project Development",
        status: "Current leadership",
      },
    ],
    signals: [
      { label: "Budget confirmed", status: "Unknown" },
      { label: "Leadership appointed", status: "Unknown" },
      { label: "Environmental assessment", status: "Confirmed" },
      { label: "Hiring activity", status: "Unknown" },
    ],
  },
  {
    id: "4",
    name: "Prairie Compression Upgrade",
    company: "Northland Midstream",
    location: "Saskatchewan, Canada",
    sector: "Oil & Gas",
    type: "Facility",
    stage: "Early Execution",
    budget: "Approved",
    signal: "Project manager appointed",
    summary:
      "A proposed compression-facility upgrade intended to improve natural gas handling capacity and support regional operations.",
    leadership: [
      {
        name: "Alex Morgan",
        role: "Project Manager",
        status: "Recently appointed",
      },
    ],
    signals: [
      { label: "Budget confirmed", status: "Confirmed" },
      { label: "Leadership appointed", status: "Confirmed" },
      { label: "Environmental assessment", status: "Unknown" },
      { label: "Hiring activity", status: "Unknown" },
    ],
  },
  {
    id: "5",
    name: "Permian Gathering Expansion",
    company: "Mesa Infrastructure",
    location: "New Mexico, USA",
    sector: "Oil & Gas",
    type: "Pipeline",
    stage: "Planning",
    budget: "Unknown",
    signal: "Regulatory filing submitted",
    summary:
      "An early-stage gathering pipeline expansion intended to connect additional production infrastructure to an existing regional network.",
    leadership: [],
    signals: [
      { label: "Budget confirmed", status: "Unknown" },
      { label: "Leadership appointed", status: "Unknown" },
      { label: "Regulatory filing", status: "Confirmed" },
      { label: "Hiring activity", status: "Unknown" },
    ],
  },
];

const stages = ["Concept", "Planning", "Early Execution", "Procurement"];

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function OpportunityDetailPage({ params }: PageProps) {
  const { id } = await params;
  const opportunity = opportunities.find((item) => item.id === id);

  if (!opportunity) {
    return (
      <main className="min-h-screen bg-slate-100 p-10 text-slate-900">
        <h1 className="text-2xl font-semibold">Opportunity not found</h1>
        <Link href="/opportunities" className="mt-4 inline-block underline">
          Back to Opportunities
        </Link>
      </main>
    );
  }

  const currentStageIndex = stages.indexOf(opportunity.stage);
  const confirmedSignals = opportunity.signals.filter(
    (signal) => signal.status === "Confirmed"
  ).length;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Opportunity Intelligence
            </p>
            <h1 className="text-xl font-semibold">Project Intelligence Brief</h1>
          </div>

          <Link
            href="/opportunities"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            ← Back to Opportunities
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Prototype Notice */}
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
          <strong>Demonstration data:</strong> Project names, organizations,
          leadership profiles, and qualification signals are fictional examples.
          They are not verified market intelligence.
        </div>

        {/* Project Heading */}
        <section className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            {opportunity.company}
          </p>

          <h2 className="mt-2 text-3xl font-bold">{opportunity.name}</h2>

          <p className="mt-2 text-slate-500">
            {opportunity.location} · {opportunity.type}
          </p>
        </section>

        {/* Summary Cards */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Project Stage", value: opportunity.stage },
            { label: "Budget Status", value: opportunity.budget },
            { label: "Project Type", value: opportunity.type },
            {
              label: "Confirmed Signals",
              value: `${confirmedSignals} of ${opportunity.signals.length}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.label}
              </p>
              <p className="mt-3 text-xl font-semibold">{item.value}</p>
            </div>
          ))}
        </section>

        {/* Project Development Timeline */}
        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-semibold">
              Project Development Timeline
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Illustrative project lifecycle showing the current development
              stage. Actual project sequences may vary.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {stages.map((stage, index) => {
              const isCurrent = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;

              return (
                <div key={stage} className="text-center">
                  <div
                    className={`mb-3 h-3 rounded-full ${
                      isCurrent
                        ? "bg-blue-600"
                        : isCompleted
                        ? "bg-emerald-500"
                        : "bg-slate-200"
                    }`}
                  />

                  <p
                    className={`text-xs font-semibold sm:text-sm ${
                      isCurrent ? "text-blue-700" : "text-slate-500"
                    }`}
                  >
                    {stage}
                  </p>

                  {isCurrent && (
                    <p className="mt-2 text-xs font-medium text-blue-600">
                      Current Stage
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
            <strong>Development Insight:</strong> The project is currently
            classified as {opportunity.stage.toLowerCase()}. The appropriate
            engagement window depends on project scope, procurement strategy,
            and other available evidence.
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-2">
            {/* Overview */}
            <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold">Project Overview</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {opportunity.summary}
              </p>
            </section>

            {/* Signal Stack */}
            <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-semibold">
                  Opportunity Signal Stack
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Observable project-development indicators used to support
                  early-stage opportunity research.
                </p>
              </div>

              <div className="space-y-3">
                {opportunity.signals.map((signal) => (
                  <div
                    key={signal.label}
                    className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          signal.status === "Confirmed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {signal.status === "Confirmed" ? "✓" : "?"}
                      </div>

                      <p className="font-medium">{signal.label}</p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        signal.status === "Confirmed"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {signal.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-lg bg-slate-50 p-5">
                <p className="text-sm font-semibold">
                  {confirmedSignals} of {opportunity.signals.length} sample
                  signals marked as confirmed
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  This is a summary of the demonstration dataset, not a
                  predictive opportunity score. Unknown means evidence has not
                  been provided, not that an activity has not occurred.
                </p>
              </div>
            </section>

            {/* Leadership */}
            <section className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm">
              <h3 className="text-xl font-semibold">
                Project Leadership Intelligence
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Leadership information associated with project development.
              </p>

              <div className="mt-6 space-y-4">
                {opportunity.leadership.length > 0 ? (
                  opportunity.leadership.map((person) => (
                    <div
                      key={person.name}
                      className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 p-5 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-semibold">{person.name}</p>
                        <p className="text-sm text-slate-500">{person.role}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {opportunity.company}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {person.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                    No leadership profiles are available in this sample record.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Latest Qualification Signal
              </h3>

              <p className="mt-3 text-lg font-semibold">
                {opportunity.signal}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Review this development alongside other project evidence to
                determine whether further investigation is warranted.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Why This Opportunity May Matter
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {opportunity.stage === "Planning"
                  ? "The project remains in the planning stage, which may provide an opportunity to investigate potential engineering requirements before formal procurement."
                  : "The project has progressed into early execution. Reviewing its current engineering scope and leadership may help determine whether opportunities for involvement remain."}
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                Illustrative interpretation only. This is not an automated
                pursuit recommendation.
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Evidence & Verification
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Source links have not yet been connected to the demonstration
                dataset.
              </p>

              <p className="mt-3 text-xs leading-5 text-slate-400">
                A future version will link qualification signals and leadership
                information to verifiable public records.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}