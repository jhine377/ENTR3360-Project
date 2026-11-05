"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signUp, signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp() {
    setSubmitting(true);
    setMessage(null);
    const { error } = await signUp(email, password);
    if (error) setMessage(error);
    else router.push("/");
    setSubmitting(false);
  }

  async function handleSignIn() {
    setSubmitting(true);
    setMessage(null);
    const { error } = await signIn(email, password);
    if (error) setMessage(error);
    else router.push("/");
    setSubmitting(false);
  }

  async function handleSignOut() {
    setSubmitting(true);
    setMessage(null);
    const { error } = await signOut();
    setMessage(error ?? "Signed out successfully.");
    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <p className="text-sm text-slate-400">Checking session…</p>
      </main>
    );
  }

  if (user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white p-8 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-black text-white">E</div>
            <div>
              <p className="font-bold text-slate-950">EPCMst Intelligence</p>
              <p className="text-xs text-slate-400">Opportunity platform</p>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Active session</p>
            <h1 className="mt-2 text-2xl font-black text-slate-950">You’re signed in</h1>
            <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          </div>

          <Link href="/" className="mt-6 flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Open dashboard
          </Link>

          <button onClick={handleSignOut} disabled={submitting} className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            {submitting ? "Signing out…" : "Sign out"}
          </button>

          {message && <p className="mt-4 text-sm text-slate-500">{message}</p>}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12">
      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="hidden text-white lg:block">
          <div className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-base font-black">E</div>
            <div>
              <p className="text-lg font-bold">EPCMst Intelligence</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Opportunity platform</p>
            </div>
          </div>

          <h1 className="mt-10 max-w-xl text-5xl font-black leading-[1.05] tracking-[-0.04em]">
            Find project momentum before procurement starts.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
            A business development workspace for early-stage capital project discovery, signal review, and pursuit prioritization.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {["Discover", "Evaluate", "Prioritize"].map((item, index) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-black text-blue-300">0{index + 1}</p>
                <p className="mt-2 text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white p-7 shadow-2xl sm:p-9">
          <div className="lg:hidden">
            <p className="text-sm font-black text-blue-700">EPCMst Intelligence</p>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Secure access</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Sign in to your workspace</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Access saved opportunities and the project intelligence database.</p>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="you@example.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                placeholder="Enter your password"
              />
            </label>

            <button onClick={handleSignIn} disabled={submitting} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50">
              {submitting ? "Please wait…" : "Sign in"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">New user</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <button onClick={handleSignUp} disabled={submitting} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50">
              Create account
            </button>

            {message && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{message}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
