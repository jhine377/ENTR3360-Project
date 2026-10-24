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

      if (!error && data) {
        setSaved(true);
      } else {
        setSaved(false);
      }

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
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-500"
      >
        Checking saved status...
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
          ? "rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-200 disabled:opacity-50"
          : "rounded-lg border border-blue-700 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
      }
    >
      {submitting
        ? "Saving..."
        : saved
        ? "✓ Saved Opportunity"
        : "Save Opportunity"}
    </button>
  );
}