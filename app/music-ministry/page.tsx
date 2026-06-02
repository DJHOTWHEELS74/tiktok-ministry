"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Verse = {
  id: number;
  text: string;
  topic: string;
  hearts: number;
};

export default function MusicMinistryPage() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [userLiked, setUserLiked] = useState<number[]>([]);

  const verses: Verse[] = [
    { id: 1, topic: "Pride", text: "Proverbs 16:18 — Pride goes before destruction, a haughty spirit before a fall.", hearts: 0 },
    { id: 2, topic: "Lust", text: "Matthew 5:28 — Anyone who looks at someone lustfully has already committed sin in the heart.", hearts: 0 },
    { id: 3, topic: "Anger", text: "Ephesians 4:26 — Do not let the sun go down while you are still angry.", hearts: 0 },
    { id: 4, topic: "Gossip", text: "Proverbs 16:28 — A gossip separates close friends.", hearts: 0 },
    { id: 5, topic: "Anxiety", text: "Philippians 4:6 — Do not be anxious about anything, but pray about everything.", hearts: 0 },
    { id: 6, topic: "Envy", text: "James 3:16 — Where there is envy, there is disorder and every evil practice.", hearts: 0 },
    { id: 7, topic: "Laziness", text: "Proverbs 13:4 — The diligent are richly supplied, but the lazy go hungry.", hearts: 0 },
    { id: 8, topic: "Greed", text: "Luke 12:15 — Life does not consist in the abundance of possessions.", hearts: 0 },
    { id: 9, topic: "Dishonesty", text: "Proverbs 12:22 — The Lord detests lying lips but delights in honesty.", hearts: 0 },
    { id: 10, topic: "Forgiveness", text: "Ephesians 4:32 — Forgive others just as Christ forgave you.", hearts: 0 },
  ];

  const [verseData, setVerseData] = useState(verses);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % verseData.length);
        setFade(true);
      }, 400);
    }, 60000);

    return () => clearInterval(interval);
  }, [verseData.length]);

  function loveVerse(id: number) {
    if (userLiked.includes(id)) return;

    setUserLiked([...userLiked, id]);

    setVerseData((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, hearts: v.hearts + 1 } : v
      )
    );
  }

  const currentVerse = verseData[index];

  return (
    <main className="min-h-screen bg-stone-950 text-white px-6 py-20 relative">

      {/* NAV */}
      <div className="absolute top-6 left-6 flex gap-6 text-sm text-gray-300">
        <Link href="/">Home</Link>
      </div>

      {/* TITLE */}
      <h1 className="text-4xl font-bold text-center mb-12">
        Music Ministry
      </h1>

      {/* MAIN GRID */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

        <a
          href="https://www.youtube.com/watch?v=B6fA35Ved-Y&list=PLVLoECFI0xUVEv88vMcVWksiuD9qbaoDs"
          target="_blank"
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-red-500 transition"
        >
          <p className="text-lg font-semibold mb-2">🎵 Worship Playlist</p>
          <p className="text-sm text-gray-400">Open YouTube worship playlist</p>
        </a>

        <a
          href="https://www.youtube.com/watch?v=b0JEJjloUas&list=RDKnMqQgzpLAM&index=3"
          target="_blank"
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-red-500 transition"
        >
          <p className="text-lg font-semibold mb-2">🎵 Worship Playlist</p>
          <p className="text-sm text-gray-400">Open YouTube worship video</p>
        </a>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 md:col-span-2">
          <p className="text-xl font-bold mb-2">📺 TikTok Live Ministry</p>
          <p className="text-gray-400 mb-4">
            Live worship and prayer sessions coming soon.
          </p>

          <div className="bg-black border border-zinc-700 rounded-xl p-6 text-center">
            <p className="text-gray-500">🎥 TikTok Live Placeholder</p>
          </div>
        </div>

      </div>

      {/* SCRIPTURE STREAM */}
      <div className="mt-20 max-w-3xl mx-auto">

        <h2 className="text-center text-xl font-bold mb-4 text-gray-300">
          📖 Scripture Stream
        </h2>

        <div
          className={`p-6 rounded-xl border border-zinc-800 bg-zinc-900 text-center transition-all duration-500 ${
            fade ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >

          <p className="text-sm text-gray-400 mb-2">
            Topic: {currentVerse.topic}
          </p>

          <p className="text-lg leading-relaxed mb-5">
            {currentVerse.text}
          </p>

          <button
            onClick={() => loveVerse(currentVerse.id)}
            className={`px-4 py-2 rounded-full border transition ${
              userLiked.includes(currentVerse.id)
                ? "bg-red-600 border-red-500"
                : "hover:bg-red-500"
            }`}
          >
            ❤️ Love This Verse ({currentVerse.hearts})
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Rotates every 60 seconds • Future: popular verses appear more often
          </p>

        </div>
      </div>

      {/* FOOTER (MATCHES HEADER STYLE NOW) */}
      <footer className="mt-20 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-6 text-center text-gray-300">
          <p className="text-sm font-semibold">
            Music Ministry • Worship Through Scripture • Glory to God
          </p>

          <p className="text-xs text-gray-400 mt-2">
            “Let everything that has breath praise the Lord.” — Psalm 150:6
          </p>
        </div>
      </footer>

    </main>
  );
}