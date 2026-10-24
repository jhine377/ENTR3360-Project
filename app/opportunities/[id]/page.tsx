"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext";
import SaveOpportunityButton from "@/components/SaveOpportunityButton";

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

type Signal = {
  id: string;
  signal_type: string;
  signal_title: string;
  signal_description: string | null;
  signal_date: string;
  source_type: string;
  source_url: string | null;
};

type Contact = {
  id: string;
  contact_name: string;
  role_title: string;
  organization: string;
  involvement_status: string | null;
  data_origin: string;
};

const lifecycleStages = [
  "Discovery",
  "Early Planning",
  "Feasibility",
  "Regulatory & Environmental",
  "Budget / Sanction",
  "FEED / Engineering",
  "Procurement / RFP",
  "Execution",
];

export default function OpportunityBrief() {
  const params = useParams();
  const id = params.id as string;

  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !id) {
      return;
    }

    async function loadOpportunity() {
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } =
        await supabase
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
          .eq("id", id)
          .single();

      if (projectError) {
        setError(projectError.message);
        setLoading(false);
        return;
      }

      const { data: signalData, error: signalError } =
        await supabase
          .from("project_signals")
          .select(
            `
            id,
            signal_type,
            signal_title,
            signal_description,
            signal_date,
            source_type,
            source_url
          `
          )
          .eq("project_id", id)
          .order("signal_date", { ascending: false });

      if (signalError) {
        setError(signalError.message);
        setLoading(false);
        return;
      }

      const { data: contactData, error: contactError } =
        await supabase
          .from("project_contacts")
          .select(
            `
            id,
            contact_name,
            role_title,
            organization,
            involvement_status,
            data_origin
          `
          )
          .eq("project_id", id)
          .order("contact_name", { ascending: true });

      if (contactError) {
        setError(contactError.message);
        setLoading(false);
        return;
      }

      setProject(projectData as Project);
      setSignals((signalData as Signal[]) ?? []);
      setContacts((contactData as Contact[]) ?? []);
      setLoading(false);
    }

    loadOpportunity();
  }, [id, user]);

  const currentStageIndex = useMemo(() => {
    if (!project) return -1;
    return lifecycleStages.indexOf(project.lifecycle_stage);
  }, [project]);

  const readiness = useMemo(() => {
    if (!project) {
      return {
        score: 0,
        label: "Monitor",
      };
    }

    let score = 0;

    const signalTypes = signals.map((signal) =>
      signal.signal_type.toLowerCase()
    );

    if (
      [
        "Discovery",
        "Early Planning",
        "Feasibility",
        "Regulatory & Environmental",
        "Budget / Sanction",
        "FEED / Engineering",
      ].includes(project.lifecycle_stage)
    ) {
      score += 1;
    }

    if (project.budget_status === "Approved") {
      score += 1;
    }

    if (contacts.length > 0) {
      score += 1;
    }

    if (
      signalTypes.some(
        (type) =>
          type.includes("regulatory") ||
          type.includes("environmental")
      )
    ) {
      score += 1;
    }

    if (
      signalTypes.some(
        (type) =>
          type.includes("engineering") ||
          type.includes("procurement") ||
          type.includes("commercial")
      )
    ) {
      score += 1;
    }

    if (score >= 4) {
      return {
        score,
        label: "Priority",
      };
    }

    if (score >= 2) {
      return {
        score,
        label: "Emerging",
      };
    }

    return {
      score,
      label: "Monitor",
    };
  }, [project, signals, contacts]);

  function formatDate(date: string) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-CA",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  }

  return (
    <RequireAuth>
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
                Opportunity Intelligence Platform
              </p>

              <p className="mt-1 text-lg font-bold">
                Project Intelligence Brief
              </p>
            </div>

            <Link
              href="/opportunities"
              className="text-sm font-semibold text-blue-700 hover:underline"
            >
              ← All opportunities
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-10">
          {loading && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              Loading project intelligence...
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
              <strong>Unable to load project:</strong> {error}
            </div>
          )}

          {!loading && !error && !project && (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <h1 className="text-2xl font-bold">
                Opportunity not found
              </h1>

              <Link
                href="/opportunities"
                className="mt-4 inline-block font-semibold text-blue-700 hover:underline"
              >
                Return to opportunities
              </Link>
            </div>
          )}

          {!loading && !error && project && (
            <>
              {/* Dataset notice */}
              <div
                className={`mb-7 rounded-xl border px-5 py-4 text-sm ${
                  project.data_origin === "Public Reference"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-blue-200 bg-blue-50 text-blue-900"
                }`}
              >
                <strong>
                  {project.data_origin === "Public Reference"
                    ? "Public reference project:"
                    : "Synthetic demonstration project:"}
                </strong>{" "}
                {project.data_origin === "Public Reference"
                  ? "This record is included to test the intelligence model against a real-world capital project. The platform is still a prototype and does not provide live market intelligence."
                  : "This record was created for demonstration and testing. Names, project details, and associated synthetic personnel should not be treated as live market intelligence."}
              </div>

              {/* Project summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                        {project.company_name}
                      </p>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          project.data_origin === "Public Reference"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {project.data_origin === "Public Reference"
                          ? "Public Reference"
                          : "Synthetic Demo"}
                      </span>
                    </div>

                    <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                      {project.project_name}
                    </h1>
                  </div>

                  <SaveOpportunityButton projectId={project.id} />
                </div>

                <p className="mt-3 max-w-4xl leading-7 text-slate-600">
                  {project.description ??
                    "No project description is currently available."}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 text-sm">
                  {[
                    `${project.region}, ${project.country}`,
                    project.project_type,
                    project.lifecycle_stage,
                    `Budget: ${project.budget_status}`,
                  ].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lifecycle */}
              <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">
                      Project Lifecycle & Pursuit Window
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      Positions the opportunity within a standard
                      capital-project lifecycle to help identify the
                      window before formal procurement.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                    Current: {project.lifecycle_stage}
                  </span>
                </div>

                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {lifecycleStages.map((stage, index) => {
                    const active = index === currentStageIndex;
                    const previous =
                      currentStageIndex >= 0 &&
                      index < currentStageIndex;

                    return (
                      <div
                        key={stage}
                        className={`rounded-xl border p-4 ${
                          active
                            ? "border-blue-700 bg-blue-50"
                            : previous
                            ? "border-blue-200 bg-slate-50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div
                          className={`mb-3 h-2 rounded-full ${
                            active
                              ? "bg-blue-700"
                              : previous
                              ? "bg-blue-300"
                              : "bg-slate-200"
                          }`}
                        />

                        <p
                          className={`text-sm font-semibold ${
                            active
                              ? "text-blue-800"
                              : "text-slate-700"
                          }`}
                        >
                          {stage}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {active
                            ? "Current project position"
                            : previous
                            ? "Prior lifecycle stage"
                            : "Future lifecycle stage"}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    Pursuit Context
                  </p>

                  <p className="mt-2 text-sm leading-6 text-blue-900">
                    Early public signals can create a business
                    development window before a formal RFP is
                    issued. The purpose of this view is to help
                    teams recognize when a project may be moving
                    from monitoring toward active pursuit.
                  </p>
                </div>
              </section>

              {/* Readiness + signals */}
              <div className="mt-7 grid gap-7 lg:grid-cols-[1.7fr_0.8fr]">
                <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold">
                        Opportunity Signal Stack
                      </h2>

                      <p className="mt-2 text-sm text-slate-600">
                        Signals collected for this project from the
                        project intelligence database.
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                      {signals.length}{" "}
                      {signals.length === 1
                        ? "signal"
                        : "signals"}
                    </span>
                  </div>

                  {signals.length > 0 ? (
                    <div className="mt-5 divide-y divide-slate-100">
                      {signals.map((signal) => (
                        <div
                          key={signal.id}
                          className="py-5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-800">
                                  {signal.signal_type}
                                </span>

                                <span className="text-xs text-slate-400">
                                  {formatDate(signal.signal_date)}
                                </span>
                              </div>

                              <h3 className="mt-3 font-semibold text-slate-900">
                                {signal.signal_title}
                              </h3>

                              {signal.signal_description && (
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                  {signal.signal_description}
                                </p>
                              )}

                              <p className="mt-2 text-xs text-slate-500">
                                Source type: {signal.source_type}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                      No project signals are currently stored for
                      this opportunity.
                    </p>
                  )}
                </section>

                {/* Readiness */}
                <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Opportunity Readiness
                  </p>

                  <h2 className="mt-3 text-3xl font-bold text-slate-900">
                    {readiness.label}
                  </h2>

                  <p className="mt-2 text-sm text-slate-600">
                    {readiness.score} of 5 prototype qualification
                    indicators detected.
                  </p>

                  <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-blue-700"
                      style={{
                        width: `${(readiness.score / 5) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-slate-600">
                    <p>
                      This is a transparent prototype prioritization
                      rule, not an AI-generated score.
                    </p>

                    <p>
                      It considers lifecycle timing, budget status,
                      identified leadership, regulatory/environmental
                      activity, and engineering/commercial signals.
                    </p>
                  </div>
                </section>
              </div>

              {/* Leadership */}
              <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">
                      Project Leadership & Stakeholders
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      Professional project roles associated with the
                      opportunity.
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                    {contacts.length}{" "}
                    {contacts.length === 1
                      ? "contact"
                      : "contacts"}
                  </span>
                </div>

                {contacts.length > 0 ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">
                              {contact.contact_name}
                            </h3>

                            <p className="mt-1 text-sm font-medium text-blue-700">
                              {contact.role_title}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {contact.organization}
                            </p>
                          </div>

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              contact.data_origin ===
                              "Public Reference"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {contact.data_origin ===
                            "Public Reference"
                              ? "Public"
                              : "Synthetic"}
                          </span>
                        </div>

                        {contact.involvement_status && (
                          <p className="mt-3 text-sm text-slate-500">
                            {contact.involvement_status}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 rounded-lg bg-amber-50 p-4 text-sm text-amber-900">
                    No leadership records are currently stored for
                    this opportunity. Identifying project personnel
                    would be a next research step.
                  </p>
                )}
              </section>

              {/* Next Steps */}
              <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h2 className="text-xl font-bold">
                  Intelligence Interpretation & Next Steps
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-700">
                  The signal stack should be treated as a starting
                  point for qualification rather than a final pursuit
                  decision. Before outreach, the team should validate
                  current scope, funding, project leadership, timing,
                  and source information.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-700">
                  Future iterations could automate signal collection
                  from public search results, regulatory filings,
                  environmental assessments, company announcements,
                  and professional-network sources. Those integrations
                  are not implemented in this version.
                </p>
              </section>

              {/* Navigation */}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/opportunities"
                  className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  ← Back to opportunities
                </Link>

                <Link
                  href="/"
                  className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Dashboard
                </Link>
              </div>

              <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
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