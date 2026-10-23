"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, loading, signUp, signIn, signOut } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSignUp() {
    setSubmitting(true);
    setMessage(null);

    const { error } = await signUp(email, password);

    if (error) {
      setMessage(error);
    } else {
      setMessage("Account created successfully.");
    }

    setSubmitting(false);
  }

  async function handleSignIn() {
    setSubmitting(true);
    setMessage(null);

    const { error } = await signIn(email, password);

    if (error) {
      setMessage(error);
    } else {
      setMessage("Signed in successfully.");
    }

    setSubmitting(false);
  }

  async function handleSignOut() {
    setSubmitting(true);
    setMessage(null);

    const { error } = await signOut();

    if (error) {
      setMessage(error);
    } else {
      setMessage("Signed out successfully.");
    }

    setSubmitting(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-md">
          <p className="text-slate-600">Checking session...</p>
        </div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
            EPCMst Opportunity Intelligence
          </p>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            You’re signed in
          </h1>

          <p className="mt-4 text-slate-600">
            Signed in as:
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {user.email}
          </p>

          <button
            onClick={handleSignOut}
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
          >
            {submitting ? "Signing out..." : "Sign Out"}
          </button>

          {message && (
            <p className="mt-4 text-sm text-slate-600">
              {message}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
          EPCMst Opportunity Intelligence
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Sign In
        </h1>

        <p className="mt-2 text-slate-600">
          Sign in to access personalized opportunity tools.
        </p>

        <div className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
              placeholder="Enter your password"
            />
          </div>

          <button
            onClick={handleSignIn}
            disabled={submitting}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {submitting ? "Please wait..." : "Sign In"}
          </button>

          <button
            onClick={handleSignUp}
            disabled={submitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-50"
          >
            Create Account
          </button>

          {message && (
            <p className="text-sm text-slate-600">
              {message}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
