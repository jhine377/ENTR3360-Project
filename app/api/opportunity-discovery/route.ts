import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

type SerperResult = {
  title?: string;
  link?: string;
  snippet?: string;
  date?: string;
  position?: number;
};

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

const discoveryLanes = [
  {
    name: "Pipeline & Midstream",
    query:
      'Canada pipeline expansion project engineering construction -facebook -instagram',
  },
  {
    name: "Facilities & Processing",
    query:
      'Canada oil gas facility expansion project engineering capital -facebook -instagram',
  },
  {
    name: "Thermal & Oil Sands",
    query:
      'Alberta oil sands SAGD expansion project engineering capital -facebook -instagram',
  },
  {
    name: "LNG & Gas Processing",
    query:
      'Canada LNG gas processing project FEED engineering development -facebook -instagram',
  },
  {
    name: "General Capital Projects",
    query:
      'Canada oil gas ("project" OR "expansion" OR "development") ("FEED" OR "engineering" OR "construction" OR "capital") -facebook -instagram',
  },
];

function classifySource(result: SerperResult): DiscoveryResult["source_type"] {
  const url = (result.link ?? "").toLowerCase();
  const title = (result.title ?? "").toLowerCase();
  const snippet = (result.snippet ?? "").toLowerCase();

  const hiringWords = [
    "job",
    "jobs",
    "career",
    "careers",
    "hiring",
    "project engineer",
    "project manager",
    "construction manager",
    "project controls",
  ];

  if (
    url.includes("linkedin.com/jobs") ||
    url.includes("indeed.") ||
    url.includes("/careers") ||
    url.includes("/jobs") ||
    hiringWords.some((word) => title.includes(word) || snippet.includes(word))
  ) {
    return "hiring_signal";
  }

  if (
    url.includes(".gc.ca") ||
    url.includes("canada.ca") ||
    url.includes("alberta.ca") ||
    url.includes("aer.ca") ||
    url.includes("cer-rec.gc.ca")
  ) {
    return "regulatory_or_government";
  }

  if (
    url.includes("capp.ca") ||
    title.includes("project") ||
    title.includes("expansion") ||
    title.includes("development") ||
    title.includes("capital")
  ) {
    return "industry_or_project_source";
  }

  return "general_web";
}

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

  if (error || !user) {
    return null;
  }

  return user;
}

async function searchSerper(query: string) {
  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    throw new Error("SERPER_API_KEY is not configured on the server.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        gl: "ca",
        hl: "en",
        tbs: "qdr:y",
        num: 10,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Serper request failed with status ${response.status}: ${body}`
      );
    }

    return (await response.json()) as { organic?: SerperResult[] };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser(request);

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to run live opportunity discovery." },
        { status: 401 }
      );
    }

    if (
      process.env.VERCEL_ENV !== "production" &&
      request.headers.get("x-assignment-failure") === "serper"
    ) {
      throw new Error("Simulated Serper failure for Assignment 5 evidence.");
    }

    const laneResponses = await Promise.all(
      discoveryLanes.map(async (lane) => {
        const data = await searchSerper(lane.query);

        return (data.organic ?? [])
          .filter((result) => result.title && result.link)
          .slice(0, 8)
          .map(
            (result) => ({
              source_id: "",
              title: result.title ?? "Untitled result",
              url: result.link ?? "",
              snippet: result.snippet ?? "",
              date: result.date ?? null,
              lane: lane.name,
              source_type: classifySource(result),
            })
          );
      })
    );

    const deduplicated = new Map<string, DiscoveryResult>();

    laneResponses.flat().forEach((result) => {
      if (!deduplicated.has(result.url)) {
        deduplicated.set(result.url, result);
      }
    });

    const results = Array.from(deduplicated.values())
      .slice(0, 30)
      .map((result, index) => ({
        ...result,
        source_id: `source_${index + 1}`,
      }));

    return NextResponse.json({
      generated_at: new Date().toISOString(),
      lane_count: discoveryLanes.length,
      result_count: results.length,
      results,
    });
  } catch (error) {
    console.error("[opportunity-discovery] External API failure", error);

    return NextResponse.json(
      {
        error:
          "Live opportunity discovery is temporarily unavailable. Existing EPCMst opportunity data is still available.",
      },
      { status: 503 }
    );
  }
}
