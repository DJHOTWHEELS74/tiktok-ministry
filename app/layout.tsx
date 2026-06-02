import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Christian TikTok Ministry",
  description: "Prayer, Worship, Hope, and Salvation in Jesus Christ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-zinc-950 text-white flex flex-col">

        {/* 🌐 NAVBAR */}
        <nav className="w-full sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap gap-4 justify-center text-sm md:text-base">

            <Link href="/" className="text-gray-300 hover:text-blue-300 transition">
              Home
            </Link>

            <Link href="/prayer-wall" className="text-gray-300 hover:text-blue-300 transition">
              Prayer Wall
            </Link>

            <Link href="/music-ministry" className="text-gray-300 hover:text-blue-300 transition">
              Music Ministry
            </Link>

            <Link href="/lost-brokenhearted" className="text-gray-300 hover:text-blue-300 transition">
              Lost & Brokenhearted
            </Link>

            <Link href="/disability-ministry" className="text-gray-300 hover:text-blue-300 transition">
              Disability Ministry
            </Link>

           <Link href="/daily-devotions" className="text-gray-300 hover:text-blue-300 transition">
              Daily Devotions
            </Link>

            <Link href="/salvation" className="text-gray-300 hover:text-blue-300 transition">
              Salvation
            </Link>

            <Link href="/about" className="text-gray-300 hover:text-blue-300 transition">
              About
            </Link>

            <Link href="/contact" className="text-gray-300 hover:text-blue-300 transition">
              Contact
            </Link>

          </div>
        </nav>

        {/* 📄 PAGE CONTENT */}
        <main className="flex-1">
          {children}
        </main>

        {/* 🦶 FOOTER */}
        <footer className="border-t border-white/10 mt-10 py-8 text-center text-xs text-gray-400">
          <p>Christian TikTok Ministry Prayers</p>
          <p className="mt-2">
            Bringing hope, prayer, and salvation through Jesus Christ
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} All Rights Reserved
          </p>
        </footer>

      </body>
    </html>
  );
}