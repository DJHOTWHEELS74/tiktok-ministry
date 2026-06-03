"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    setError("");

    if (!supabase) {
      setError("Supabase is not configured");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/prayer-wall");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-6 bg-zinc-900 rounded-xl">

        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          className="w-full p-2 mb-3 bg-black rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-3 bg-black rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2">{error}</p>
        )}

        <button
          onClick={login}
          className="w-full bg-green-600 py-2 rounded"
        >
          Login
        </button>
      </div>
    </main>
  );
}