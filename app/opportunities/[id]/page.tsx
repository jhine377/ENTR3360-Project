import Link from "next/link";
import { notFound } from "next/navigation";

type SignalStatus = "Confirmed" | "Unknown";
type Person = { name: string; role: string; note: string };
type Project = {
  id: string;
  name: string;
  company: string;
  location: string;
  type: "Pipeline" | "Facility";
  stage: "Planning" | "Early Execution";
  budget: "Approved" | "Unknown";
  signal: string;
  description: string;
  whyItMatters: string;
  evidence: string;
  leadership: Person[];
  signals: { name: string; status: SignalStatus; detail: string }[];
};

const projects: Record<string, Project> = {
  "1": {
    id: "1", name: "Northern Pipeline Expansion", company: "Prairie Energy", location: "Alberta, Canada", type: "Pipeline", stage: "Planning", budget: "Approved", signal: "Project leadership appointed",
    description: "Illustrative pipeline expansion being evaluated in Alberta. The brief brings together early-stage project context and the people associated with it.",
    whyItMatters: "Planning-stage timing, an approved illustrative budget, and a named project lead make this the type of opportunity a business development team might investigate before procurement begins.",
    evidence: "Illustrative company announcement and planning summary (fictional demo sources).",
    leadership: [{ name: "Sarah Mitchell", role: "Project Director", note: "Example project decision-maker" }, { name: "Daniel Brooks", role: "Engineering Manager", note: "Example technical stakeholder" }],
    signals: [{ name: "Budget approval", status: "Confirmed", detail: "Sample project budget marked approved" }, { name: "Leadership appointment", status: "Confirmed", detail: "Illustrative project leadership appointed" }, { name: "Environmental filing", status: "Unknown", detail: "No filing included in the sample" }, { name: "Hiring activity", status: "Unknown", detail: "No hiring signal included in the sample" }]
  },
  "2": {
    id: "2", name: "Gulf Processing Facility", company: "Frontier Resources", location: "Texas, USA", type: "Facility", stage: "Early Execution", budget: "Approved", signal: "Engineering team announced",
    description: "Illustrative new processing facility in Texas, with an engineering team signal and an early execution-stage designation.",
    whyItMatters: "An engineering team announcement can help business development teams identify who is involved and assess whether there is still an opportunity to support project delivery.",
    evidence: "Illustrative engineering-team announcement (fictional demo source).",
    leadership: [{ name: "Emily Chen", role: "Project Manager", note: "Example project contact" }, { name: "Michael Torres", role: "Engineering Lead", note: "Example engineering contact" }],
    signals: [{ name: "Budget approval", status: "Confirmed", detail: "Sample project budget marked approved" }, { name: "Leadership appointment", status: "Confirmed", detail: "Illustrative engineering team announced" }, { name: "Environmental filing", status: "Unknown", detail: "No filing included in the sample" }, { name: "Hiring activity", status: "Unknown", detail: "No hiring signal included in the sample" }]
  },
  "3": {
    id: "3", name: "Western Gas Connector", company: "Summit Infrastructure", location: "British Columbia, Canada", type: "Pipeline", stage: "Planning", budget: "Unknown", signal: "Environmental assessment submitted",
    description: "Illustrative gas connector project in British Columbia. An environmental assessment is the primary early-stage signal in this scenario.",
    whyItMatters: "An environmental assessment may reveal projects before a formal procurement notice. Budget status remains unknown and should be validated before prioritizing outreach.",
    evidence: "Illustrative environmental assessment filing (fictional demo source).",
    leadership: [{ name: "Rachel Singh", role: "Regulatory Affairs Lead", note: "Example regulatory stakeholder" }, { name: "David Foster", role: "Development Manager", note: "Example development stakeholder" }],
    signals: [{ name: "Budget approval", status: "Unknown", detail: "Not established in sample data" }, { name: "Leadership appointment", status: "Unknown", detail: "No confirmed appointment in the sample" }, { name: "Environmental filing", status: "Confirmed", detail: "Illustrative assessment submitted" }, { name: "Hiring activity", status: "Unknown", detail: "No hiring signal included in the sample" }]
  },
  "4": {
    id: "4", name: "Prairie Compression Upgrade", company: "Northland Midstream", location: "Saskatchewan, Canada", type: "Facility", stage: "Early Execution", budget: "Approved", signal: "Project manager appointed",
    description: "Illustrative compression-facility upgrade. The sample shows both budget confirmation and a project manager appointment.",
    whyItMatters: "A named project manager gives business development teams a starting point for understanding stakeholders, although scope and procurement timing still require validation.",
    evidence: "Illustrative appointment announcement and budget status (fictional demo sources).",
    leadership: [{ name: "Alex Morgan", role: "Project Manager", note: "Example project contact" }],
    signals: [{ name: "Budget approval", status: "Confirmed", detail: "Sample project budget marked approved" }, { name: "Leadership appointment", status: "Confirmed", detail: "Illustrative manager appointed" }, { name: "Environmental filing", status: "Unknown", detail: "No filing included in the sample" }, { name: "Hiring activity", status: "Unknown", detail: "No hiring signal included in the sample" }]
  },
  "5": {
    id: "5", name: "Permian Gathering Expansion", company: "Mesa Infrastructure", location: "New Mexico, USA", type: "Pipeline", stage: "Planning", budget: "Unknown", signal: "Regulatory filing submitted",
    description: "Illustrative gathering infrastructure expansion in New Mexico. A regulatory filing is the main early signal available in this sample.",
    whyItMatters: "Regulatory filings can surface potential projects early, but this opportunity requires further research into budget, leadership and project scope before outreach.",
    evidence: "Illustrative regulatory filing (fictional demo source).",
    leadership: [],
    signals: [{ name: "Budget approval", status: "Unknown", detail: "Not established in sample data" }, { name: "Leadership appointment", status: "Unknown", detail: "No leadership details in the sample" }, { name: "Environmental filing", status: "Confirmed", detail: "Illustrative regulatory filing submitted" }, { name: "Hiring activity", status: "Unknown", detail: "No hiring signal included in the sample" }]
  },
};

const stages = ["Concept", "Planning", "Early Execution", "Procurement"] as const;

export default async function OpportunityBrief({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects[id];
  if (!project) notFound();

  const currentStage = stages.indexOf(project.stage);
  const confirmed = project.signals.filter((signal) => signal.status === "Confirmed").length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Opportunity Intelligence Platform</p>
            <p className="mt-1 text-lg font-bold">Project Intelligence Brief</p>
          </div>
          <Link href="/opportunities" className="text-sm font-semibold text-blue-700 hover:underline">← All opportunities</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-7 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-900"><strong>Fictional demonstration data.</strong> Project names, companies, people and signals shown here are illustrative, not verified intelligence.</div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wider text-blue-700">{project.company}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{project.name}</h1>
          <p className="mt-3 text-slate-600">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {[project.location, project.type, project.stage, `Budget: ${project.budget}`].map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">{tag}</span>)}
          </div>
        </div>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xl font-bold">Project Development Timeline</h2><span className="text-sm text-slate-500">Current stage: {project.stage}</span></div>
          <p className="mt-2 text-sm text-slate-600">Illustrative lifecycle positioning to help assess project timing.</p>
          <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
            {stages.map((stage, index) => {
              const active = index === currentStage;
              const previous = index < currentStage;
              return <div key={stage} className={`rounded-lg border p-4 ${active ? "border-blue-700 bg-blue-50" : previous ? "border-blue-200 bg-slate-50" : "border-slate-200 bg-white"}`}>
                <div className={`mb-3 h-2 rounded-full ${active ? "bg-blue-700" : previous ? "bg-blue-300" : "bg-slate-200"}`} />
                <p className={`text-sm font-semibold ${active ? "text-blue-800" : "text-slate-700"}`}>{stage}</p>
                <p className="mt-1 text-xs text-slate-500">{active ? "Current sample stage" : previous ? "Prior stage" : "Future stage"}</p>
              </div>;
            })}
          </div>
        </section>

        <div className="mt-7 grid gap-7 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-bold">Opportunity Signal Stack</h2><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">{confirmed} of {project.signals.length} signals confirmed</span></div>
            <p className="mt-2 text-sm text-slate-600">Signals are starting points for qualification. “Unknown” does not mean a signal is absent.</p>
            <div className="mt-5 divide-y divide-slate-100">
              {project.signals.map((signal) => <div className="flex flex-wrap items-start justify-between gap-3 py-4" key={signal.name}>
                <div className="min-w-0 flex-1"><h3 className="font-semibold">{signal.name}</h3><p className="mt-1 text-sm text-slate-500">{signal.detail}</p></div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${signal.status === "Confirmed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{signal.status}</span>
              </div>)}
            </div>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold">Why This Opportunity May Matter</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{project.whyItMatters}</p>
            <h3 className="mt-7 text-sm font-bold uppercase tracking-wide text-slate-500">Latest illustrated signal</h3>
            <p className="mt-2 font-medium text-blue-700">{project.signal}</p>
          </section>
        </div>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold">Project Leadership & Stakeholders</h2>
          <p className="mt-2 text-sm text-slate-600">Example personnel associated with the opportunity, where included in the demonstration dataset.</p>
          {project.leadership.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{project.leadership.map((person) => <div key={person.name} className="rounded-xl border border-slate-200 bg-slate-50 p-5"><h3 className="font-semibold">{person.name}</h3><p className="mt-1 text-sm font-medium text-blue-700">{person.role}</p><p className="mt-2 text-sm text-slate-500">{person.note}</p></div>)}</div> : <p className="mt-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">No leadership profiles are included for this example. Identifying project personnel would be a next research step.</p>}
        </section>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-xl font-bold">Evidence & Next Steps</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700"><strong>Illustrative source:</strong> {project.evidence}</p>
          <p className="mt-2 text-sm leading-7 text-slate-700"><strong>Before outreach:</strong> Validate the actual project, funding, contacts and source materials. This prototype is a workflow demonstration, not a live research service.</p>
        </section>

        <div className="mt-8 flex flex-wrap gap-4"><Link href="/opportunities" className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800">← Back to opportunities</Link><Link href="/" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Dashboard</Link></div>
        <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">ENTR 3360 · MVP Prototype · Fictional demonstration data</footer>
      </div>
    </main>
  );
}
