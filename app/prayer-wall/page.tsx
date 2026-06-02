"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Prayer = {
  id: string;
  name: string;
  message: string;
  category: "prayer" | "praise";
  created_at: string;
  amen: number;
  praying: number;
  god_is_good: number;
};

export default function PrayerWallPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [index, setIndex] = useState(0);

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [category] = useState<"prayer" | "praise">("prayer");

  const [reacted, setReacted] = useState<string[]>([]);
  const [livePrayer, setLivePrayer] = useState<string | null>(null);

  const [newPrayerIds, setNewPrayerIds] = useState<string[]>([]);
  const [activity, setActivity] = useState<string[]>([]);

  // -----------------------------
  // STORAGE
  // -----------------------------
  useEffect(() => {
    const saved = localStorage.getItem("reacted_prayers");
    if (saved) setReacted(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("reacted_prayers", JSON.stringify(reacted));
  }, [reacted]);

  useEffect(() => {
    const saved = localStorage.getItem("activity_feed");
    if (saved) setActivity(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("activity_feed", JSON.stringify(activity));
  }, [activity]);

  function pushActivity(msg: string) {
    setActivity((prev) => [msg, ...prev].slice(0, 25));
  }

  // -----------------------------
  // FETCH PRAYERS
  // -----------------------------
  async function fetchPrayers() {
    const { data } = await supabase
      .from("prayers")
      .select("*")
      .order("created_at", { ascending: false });

    if (!data) return;

    setPrayers(data as Prayer[]);

    const now = Date.now();

    const fresh = data
      .filter((p) => now - new Date(p.created_at).getTime() < 120000)
      .map((p) => p.id);

    setNewPrayerIds(fresh);
  }

  useEffect(() => {
    fetchPrayers();

    const channel = supabase
      .channel("prayers-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "prayers" },
        () => fetchPrayers()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -----------------------------
  // LIVE BANNER
  // -----------------------------
  useEffect(() => {
    const channel = supabase
      .channel("prayer-activity")
      .on("broadcast", { event: "praying" }, (payload) => {
        const sender = payload.payload?.name || "Someone";

        setLivePrayer(`${sender} is praying for a request 🙏`);
        pushActivity(`${sender} is praying for a request 🙏`);

        setTimeout(() => setLivePrayer(null), 4000);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // -----------------------------
  // ROTATION
  // -----------------------------
  useEffect(() => {
    if (prayers.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [prayers]);

  // -----------------------------
  // SUBMIT
  // -----------------------------
  async function submitPrayer() {
    if (!message) return;

    await supabase.from("prayers").insert({
      name: name || "Anonymous",
      message,
      category,
      amen: 0,
      praying: 0,
      god_is_good: 0,
    });

    pushActivity(`✍️ ${name || "Anonymous"} submitted a new prayer`);

    setMessage("");
    setName("");
  }

  // -----------------------------
  // REACTIONS
  // -----------------------------
  async function react(
    id: string,
    field: "amen" | "praying" | "god_is_good"
  ) {
    if (reacted.includes(id)) return;

    const prayer = prayers.find((p) => p.id === id);
    if (!prayer) return;

    const updated = (prayer as any)[field] + 1;

    await supabase
      .from("prayers")
      .update({ [field]: updated })
      .eq("id", id);

    setPrayers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: updated } : p
      )
    );

    setReacted((prev) => [...prev, id]);

    const sender =
      name ||
      ["John", "Sarah", "Mike", "Anna"][Math.floor(Math.random() * 4)];

    if (field === "amen") pushActivity(`${sender} sent an Amen ❤️`);
    if (field === "god_is_good") pushActivity(`${sender} praised God 🔥`);

    if (field === "praying") {
      pushActivity(`${sender} prayed for a request 🙏`);

      await supabase.channel("prayer-activity").send({
        type: "broadcast",
        event: "praying",
        payload: { name: sender },
      });
    }
  }

  // -----------------------------
  // SPLIT NEW / OLD
  // -----------------------------
  const newPrayers = prayers.filter((p) =>
    newPrayerIds.includes(p.id)
  );

  const oldPrayers = prayers.filter(
    (p) => !newPrayerIds.includes(p.id)
  );

  const window = oldPrayers.slice(
    index % Math.max(1, oldPrayers.length),
    index % Math.max(1, oldPrayers.length) + 20
  );

  function getBorder(isNew: boolean) {
    return isNew
      ? "border-yellow-400 animate-pulse shadow-[0_0_20px_rgba(255,215,0,0.6)]"
      : "border-zinc-700";
  }

  return (
    <main className="min-h-screen bg-stone-950 text-white">

      {/* ================= GLASS NAVBAR ================= */}
      <div className="sticky top-0 z-50 w-full">

        <div className="relative w-full border-b border-white/10 overflow-hidden">

          {/* marble base */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-950" />

          {/* animated gloss */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "linear-gradient(120deg, rgba(255,255,255,0.10), rgba(0,0,0,0.35), rgba(180,180,180,0.12), rgba(0,0,0,0.25))",
              backgroundSize: "300% 300%",
              animation: "marbleFlow 8s ease-in-out infinite",
            }}
          />

          {/* glass blur */}
          <div className="absolute inset-0 bg-white/5 backdrop-blur-xl" />

          {/* nav content */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">

            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">
                Prayer Wall
              </h1>
              <p className="text-xs text-gray-300">
                Live Prayer System
              </p>
            </div>

            <Link
              href="/"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm transition"
            >
              🏠 Home
            </Link>

          </div>
        </div>
      </div>

      {/* LIVE BANNER */}
      {livePrayer && (
        <div className="fixed top-0 w-full bg-emerald-500 text-black text-center py-3 z-50">
          {livePrayer}
        </div>
      )}

      {/* CONTENT (adjusted padding so navbar doesn’t overlap) */}
      <div className="flex flex-col items-center px-6 pt-24 pb-24">

        {/* INPUT */}
        <div className="w-full max-w-xl bg-zinc-900 p-4 rounded-xl mb-10">

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full mb-2 p-2 bg-black rounded"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your prayer..."
            className="w-full p-2 bg-black rounded h-24"
          />

          <button
            onClick={submitPrayer}
            className="mt-3 w-full bg-blue-600 py-2 rounded"
          >
            Submit Prayer
          </button>
        </div>

        {/* NEW PRAYERS */}
        <div className="w-full max-w-6xl mb-6">
          <h2 className="text-yellow-300 font-bold mb-3">
            🆕 New Prayers
          </h2>

          <div className="grid grid-cols-5 gap-3">
            {newPrayers.map((p) => (
              <div
                key={p.id}
                className={`p-3 bg-black rounded-xl border ${getBorder(true)}`}
              >
                <p className="text-xs text-gray-400">{p.name}</p>
                <p className="text-sm mb-2">{p.message}</p>

                <div className="flex gap-3 text-xs">
                  <button onClick={() => react(p.id, "amen")}>❤️ {p.amen}</button>
                  <button onClick={() => react(p.id, "praying")}>🙏 {p.praying}</button>
                  <button onClick={() => react(p.id, "god_is_good")}>🔥 {p.god_is_good}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* OLD PRAYERS */}
        <div className="grid grid-cols-5 gap-3 w-full max-w-6xl">
          {window.map((p) => (
            <div
              key={p.id}
              className={`p-3 bg-zinc-900 rounded-xl border ${getBorder(false)}`}
            >
              <p className="text-xs text-gray-400">{p.name}</p>
              <p className="text-sm">{p.message}</p>

              <div className="flex gap-3 text-xs mt-2">
                <button onClick={() => react(p.id, "amen")}>❤️ {p.amen}</button>
                <button onClick={() => react(p.id, "praying")}>🙏 {p.praying}</button>
                <button onClick={() => react(p.id, "god_is_good")}>🔥 {p.god_is_good}</button>
              </div>
            </div>
          ))}
        </div>

        {/* ACTIVITY FEED */}
        <div className="w-full max-w-xl mt-10 bg-zinc-900 p-4 rounded-xl">
          <h2 className="font-bold mb-3">🔥 Activity Feed</h2>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activity.length === 0 ? (
              <p className="text-gray-500 text-sm">No activity yet...</p>
            ) : (
              activity.map((a, i) => (
                <div key={i} className="text-sm text-gray-300">
                  {a}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes marbleFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

    </main>
  );
}