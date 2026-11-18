import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type DiscoveryResult = {
  source_id: string;
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

type Candidate = {
  project_name: string;
  company_name: string;
  location: string;
  project_type: string;
  likely_stage:
    | "Discovery"
    | "Early Planning"
    | "Feasibility"
    | "Regulatory & Environmental"
    | "FEED / Engineering"
    | "Construction"
    | "Unknown";
  confidence: "Low" | "Medium" | "High";
  project_status:
    | "Active"
    | "Early"
    | "Deferred"
    | "On Hold"
    | "Completed"
    | "Cancelled"
    | "Unknown";
  trigger_type:
    | "Project announcement"
    | "Capital / funding"
    | "Engineering / FEED"
    | "Regulatory"
    | "Hiring"
    | "Expansion / development"
    | "Construction"
    | "Other";
  why_it_matters: string;
  recommended_next_action: string;
  supporting_source_ids: string[];
};

const allowedStages = new Set<Candidate["likely_stage"]>([
  "Discovery",
  "Early Planning",
  "Feasibility",
  "Regulatory & Environmental",
  "FEED / Engineering",
  "Construction",
  "Unknown",
]);

const allowedConfidence = new Set<Candidate["confidence"]>([
  "Low",
  "Medium",
  "High",
]);

const allowedProjectStatus = new Set<Candidate["project_status"]>([
  "Active",
  "Early",
  "Deferred",
  "On Hold",
  "Completed",
  "Cancelled",
  "Unknown",
]);

const allowedTriggers = new Set<Candidate["trigger_type"]>([
  "Project announcement",
  "Capital / funding",
  "Engineering / FEED",
  "Regulatory",
  "Hiring",
  "Expansion / development",
  "Construction",
  "Other",
]);

async function requireUser(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice("Bearer ".length);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase server environment is not configured.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) return null;
  return user;
}

function validateCandidates(
  raw: unknown,
  sourceIds: Set<string>
): Candidate[] {
  if (!raw || typeof raw !== "object") {
    throw new Error("AI response was not an object.");
  }

  const candidates = (raw as { candidates?: unknown }).candidates;

  if (!Array.isArray(candidates)) {
    throw new Error("AI response did not include a candidates array.");
  }

  return candidates.slice(0, 5).map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Candidate ${index + 1} is invalid.`);
    }

    const candidate = item as Partial<Candidate>;
    const sources = Array.isArray(candidate.supporting_source_ids)
      ? candidate.supporting_source_ids.filter(
          (id): id is string => typeof id === "string" && sourceIds.has(id)
        )
      : [];

    if (
      typeof candidate.project_name !== "string" ||
      !candidate.project_name.trim() ||
      typeof candidate.company_name !== "string" ||
      !candidate.company_name.trim() ||
      typeof candidate.location !== "string" ||
      !candidate.location.trim() ||
      typeof candidate.project_type !== "string" ||
      !candidate.project_type.trim() ||
      typeof candidate.why_it_matters !== "string" ||
      !candidate.why_it_matters.trim() ||
      typeof candidate.recommended_next_action !== "string" ||
      !candidate.recommended_next_action.trim() ||
      !candidate.likely_stage ||
      !allowedStages.has(candidate.likely_stage) ||
      !candidate.confidence ||
      !allowedConfidence.has(candidate.confidence) ||
      !candidate.project_status ||
      !allowedProjectStatus.has(candidate.project_status) ||
      !candidate.trigger_type ||
      !allowedTriggers.has(candidate.trigger_type) ||
      sources.length === 0
    ) {
      throw new Error(
        `Candidate ${index + 1} failed server-side validation.`
      );
    }

    return {
      project_name: candidate.project_name.trim(),
      company_name: candidate.company_name.trim(),
      location: candidate.location.trim(),
      project_type: candidate.project_type.trim(),
      likely_stage: candidate.likely_stage,
      confidence: candidate.confidence,
      project_status: candidate.project_status,
      trigger_type: candidate.trigger_type,
      why_it_matters: candidate.why_it_matters.trim(),
      recommended_next_action: candidate.recommended_next_action.trim(),
      supporting_source_ids: sources,
    };
  });
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to run AI opportunity qualification." },
        { status: 401 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not configured on the server.");
    }

    const body = (await request.json()) as { results?: DiscoveryResult[] };
    const results = Array.isArray(body.results)
      ? body.results.slice(0, 20)
      : [];

    if (results.length === 0) {
      return NextResponse.json(
        { error: "No discovery signals were provided for qualification." },
        { status: 400 }
      );
    }

    const sourceIds = new Set(results.map((result) => result.source_id));

    const prompt = `
You are qualifying early-stage oil, gas, pipeline, LNG, facilities, and related capital-project opportunities for an EPCM business-development team.

Your job is NOT to summarize search results. Identify up to 5 distinct, plausible capital-project opportunities that deserve human review.

Important:
- Use only the supplied evidence.
- Do not invent a project, owner, location, budget, stage, or schedule.
- Hiring activity can be a useful early signal, but it is weaker than a direct project announcement, regulatory record, capital disclosure, or engineering award unless corroborated.
- Generic industry commentary is not a project opportunity by itself.
- Prefer opportunities that appear early enough for an EPCM firm to influence or pursue.
- Detect negative or late-stage status signals such as deferred, paused, on hold, cancelled, completed, or already too far into construction.
- A deferred/on-hold/cancelled/completed project must NOT be framed as an active pursuit. The recommended next action should reflect monitoring, reactivation checks, or no action.
- Merge multiple signals when they clearly refer to the same project.
- Every candidate must cite at least one supplied source_id.
- If the evidence does not support a real candidate, omit it.
- Return JSON only.

Allowed likely_stage values:
Discovery
Early Planning
Feasibility
Regulatory & Environmental
FEED / Engineering
Construction
Unknown

Allowed confidence values:
Low
Medium
High

Allowed project_status values:
Active
Early
Deferred
On Hold
Completed
Cancelled
Unknown

Allowed trigger_type values:
Project announcement
Capital / funding
Engineering / FEED
Regulatory
Hiring
Expansion / development
Construction
Other

Return exactly this shape:
{
  "candidates": [
    {
      "project_name": "string",
      "company_name": "string",
      "location": "string",
      "project_type": "string",
      "likely_stage": "allowed value",
      "confidence": "allowed value",
      "project_status": "allowed value",
      "trigger_type": "allowed value",
      "why_it_matters": "1-2 concise sentences for BD",
      "recommended_next_action": "one concrete research or outreach action",
      "supporting_source_ids": ["source_id"]
    }
  ]
}

Discovery evidence:
${JSON.stringify(results, null, 2)}
`.trim();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Luna keeps this focused classification workflow inexpensive.
          model: "gpt-6-luna",
          input: prompt,
          max_output_tokens: 2200,
        }),
        signal: controller.signal,
        cache: "no-store",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `OpenAI request failed with status ${response.status}: ${errorText}`
        );
      }

      const aiResponse = (await response.json()) as {
        output?: Array<{
          type?: string;
          content?: Array<{ type?: string; text?: string }>;
        }>;
      };

      const outputText =
        aiResponse.output
          ?.flatMap((item) => item.content ?? [])
          .find((content) => content.type === "output_text")?.text ?? "";

      if (!outputText) {
        throw new Error("OpenAI returned no qualification text.");
      }

      const cleaned = outputText
        .replace(/^\`\`\`json\s*/i, "")
        .replace(/\`\`\`$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned) as unknown;
      const candidates = validateCandidates(parsed, sourceIds);

      return NextResponse.json({
        qualified_at: new Date().toISOString(),
        candidate_count: candidates.length,
        candidates,
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    console.error("[opportunity-qualification] AI failure", error);

    return NextResponse.json(
      {
        error:
          "AI qualification is temporarily unavailable. You can still review the live discovery signals manually.",
      },
      { status: 503 }
    );
  }
}
