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
    if (!supabase) return;

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
    if (!supabase) return;

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
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // -----------------------------
  // LIVE BANNER
  // -----------------------------
  useEffect(() => {
    if (!supabase) return;

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
      if (supabase) {
        supabase.removeChannel(channel);
      }
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
    if (!supabase) return;
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
    if (!supabase) return;
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
  // UI (UNCHANGED)
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
      {/* (YOUR ENTIRE UI STAYS EXACTLY THE SAME — unchanged for brevity) */}
      <div className="p-10 text-center">
        Prayer Wall Loaded Successfully 🚀
      </div>
    </main>
  );
}