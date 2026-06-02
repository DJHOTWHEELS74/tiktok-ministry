"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Prayer = {
  id: string;
  message: string;
};

export default function HomePage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  async function loadPreview() {
    const { data } = await supabase
      .from("prayers")
      .select("id, message")
      .order("created_at", { ascending: false })
      .limit(3);

    if (data) {
      setPrayers(data as Prayer[]);
      setLastUpdate(Date.now()); // visual refresh trigger
    }
  }

  useEffect(() => {
    loadPreview();

    // REALTIME SUPABASE UPDATES
    const channel = supabase
      .channel("home-prayer-preview")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prayers" },
        () => {
          loadPreview();
        }
      )
      .subscribe();

    // fallback refresh every 8 seconds
    const interval = setInterval(() => {
      loadPreview();
    }, 8000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 bg-stone-950 text-white">

      {/* TITLE — PUSHED DOWN */}
      <h1 className="text-5xl font-bold mb-6 mt-16 text-center">
        🙏 TikTok Outreach Ministry
      </h1>

      <div className="flex gap-4 mb-10">
        <Link href="/prayer-wall" className="bg-blue-600 px-4 py-2 rounded">
          Prayer Wall
        </Link>

        <Link href="/login" className="bg-green-600 px-4 py-2 rounded">
          Login
        </Link>

        <Link href="/signup" className="bg-gray-700 px-4 py-2 rounded">
          Sign Up
        </Link>
      </div>

      {/* PRAYER FEED */}
      <div className="w-full max-w-xl space-y-3">

        {prayers.length === 0 && (
          <p className="text-gray-400 text-center">
            No prayers yet 🙏
          </p>
        )}

        {prayers.map((p) => (
          <div
            key={p.id}
            className="relative p-4 rounded-xl bg-white/5 border text-white overflow-hidden swirl-border"
          >
            {p.message}
          </div>
        ))}
      </div>

      {/* 🔁 small update indicator (you’ll SEE real-time changes now) */}
      <p className="text-xs text-gray-500 mt-6">
        Live updates active • {new Date(lastUpdate).toLocaleTimeString()}
      </p>

      {/* ✨ SWIRL BORDER ANIMATION */}
      <style jsx>{`
        .swirl-border {
          border: 1px solid rgba(255, 255, 255, 0.15);
          position: relative;
        }

        .swirl-border::before {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 14px;
          padding: 2px;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.1),
            rgba(180, 180, 180, 0.6),
            rgba(255, 255, 255, 0.2),
            rgba(200, 200, 200, 0.4)
          );
          background-size: 300% 300%;
          animation: swirl 4s linear infinite;
          z-index: -1;
        }

        @keyframes swirl {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>

    </main>
  );
}