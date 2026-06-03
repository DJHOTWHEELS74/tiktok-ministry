"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    // SAFE GUARD (runtime protection)
    if (!supabase) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }

    // TYPE FIX: tell TS this is safe AFTER guard
    const client = supabase;

    const { error } = await client.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Account created! Check your email.");
    setEmail("");
    setPassword("");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-950 text-white px-6">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl border border-zinc-700">

        <h1 className="text-2xl font-bold mb-4 text-center">
          Sign Up
        </h1>

        <form onSubmit={handleSignup} className="space-y-3">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-black border border-zinc-700"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-black border border-zinc-700"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 py-2 rounded hover:bg-green-500"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

        </form>

        {error && (
          <p className="text-red-400 mt-3 text-sm text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-400 mt-3 text-sm text-center">
            {success}
          </p>
        )}

      </div>
    </main>
  );
}