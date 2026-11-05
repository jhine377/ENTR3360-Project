"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

type Props = {
  projectId: string;
};

export default function SaveOpportunityButton({ projectId }: Props) {
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.id;

    async function checkSaved() {
      const { data, error } = await supabase
        .from("saved_opportunities")
        .select("id")
        .eq("project_id", projectId)
        .eq("user_id", userId)
        .maybeSingle();

      setSaved(!error && Boolean(data));
      setLoading(false);
    }

    checkSaved();
  }, [projectId, user]);

  async function handleSave() {
    if (!user) return;

    const userId = user.id;
    setSubmitting(true);

    if (saved) {
      const { error } = await supabase
        .from("saved_opportunities")
        .delete()
        .eq("project_id", projectId)
        .eq("user_id", userId);

      if (!error) {
        setSaved(false);
      }
    } else {
      const { error } = await supabase
        .from("saved_opportunities")
        .insert({
          project_id: projectId,
          user_id: userId,
        });

      if (!error) {
        setSaved(true);
      }
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <button
        disabled
        className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-400"
      >
        Checking…
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={submitting}
      className={
        saved
          ? "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100 disabled:opacity-50"
          : "rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50"
      }
    >
      {submitting ? "Updating…" : saved ? "✓ Saved" : "＋ Save opportunity"}
    </button>
  );
}