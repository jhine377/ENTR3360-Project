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

  const initial = user.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center gap-3 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-4 md:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
          {initial}
        </div>
        <div className="leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Signed in
          </p>
          <p className="max-w-44 truncate text-xs font-medium text-slate-100">
            {user.email}
          </p>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:border-white/25 hover:bg-white/10 hover:text-white"
      >
        Sign out
      </button>
    </div>
  );
}