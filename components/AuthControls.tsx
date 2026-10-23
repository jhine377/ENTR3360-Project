"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthControls() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  async function handleSignOut() {
    const { error } = await signOut();

    if (!error) {
      router.push("/login");
    }
  }

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-xs text-slate-500">Signed in as</p>
        <p className="text-sm font-medium text-slate-900">
          {user.email}
        </p>
      </div>

      <button
        onClick={handleSignOut}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        Sign Out
      </button>
    </div>
  );
}