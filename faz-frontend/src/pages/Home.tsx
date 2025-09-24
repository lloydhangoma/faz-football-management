// 📁 src/pages/home.tsx
import { Link } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  ArrowRight,
  Users,
  Shield,
  Trophy,
} from "lucide-react";

// Public site hero background
const HERO_BG_URL =
  "https://res.cloudinary.com/digaq48bp/image/upload/v1758636806/faz_background_ekdwhd.jpg";

const NEWS = [
  "Club registration deadline extended to October 15, 2024",
  "New player development program launched in all provinces",
  "FAZ Cup 2024 fixtures released Check your club’s schedule",
];

export default function Home(): ReactElement {
  return (
    <>
      {/* 🔥 HERO */}
      <section className="relative min-h-[90vh] w-full overflow-hidden">
        {/* BG image */}
        <div
          className="absolute inset-0 -z-10 bg-center bg-cover"
          style={{ backgroundImage: `url(${HERO_BG_URL})` }}
          aria-hidden="true"
        />
        {/* Overlay for readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-900/70 via-emerald-900/55 to-black/75" />

        {/* Top ribbon */}
        <div className="absolute inset-x-0 top-0 z-20 bg-emerald-700/95 text-emerald-50">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-xs sm:text-sm">
            <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 font-semibold">
              OPEN
            </span>
            <span className="opacity-90">Transfer Window</span>
            <span className="opacity-60">•</span>
            <span className="opacity-90">Registration closes: October 15, 2024</span>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl md:text-6xl">
              Shaping the
              <br />
              Future of{" "}
              <span className="bg-orange-600 bg-clip-text text-transparent">
                Zambian
              </span>
              <br />
              <span className="bg-orange-600 bg-clip-text text-transparent">
                Football
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-base text-emerald-50/90 sm:text-lg">
              One platform for clubs, players, and fans from grassroots to glory.
              Join the digital transformation of Zambian football.
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                to="/club-applications"
                className="inline-flex h-11 w-full sm:w-auto items-center justify-center rounded-md bg-orange-600 px-4 text-sm font-medium text-white transition hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              >
                <Plus className="mr-2 h-5 w-5" />
                Apply for Club Account
              </Link>

              <div className="relative w-full sm:w-[340px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-100/70" />
                <input
                  type="text"
                  placeholder="Browse Clubs"
                  className="h-11 w-full rounded-md border border-emerald-400/30 bg-emerald-900/40 pl-10 pr-20 text-emerald-50 placeholder:text-emerald-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                />
                <Link
                  to="/clubs"
                  className="absolute right-1.5 top-1.5 inline-flex h-8 items-center rounded-md bg-emerald-600 px-2 text-xs font-medium text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                  aria-label="Go to Clubs"
                >
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Tiny stats row */}
            <div className="mt-6 grid grid-cols-1 gap-3 text-emerald-50/90 sm:grid-cols-3">
              <Stat icon={<Users className="h-4 w-4" />} label="Registered Clubs" value="250+" />
              <Stat icon={<Shield className="h-4 w-4" />} label="Licensed Officials" value="900+" />
              <Stat icon={<Trophy className="h-4 w-4" />} label="Competitions" value="30+" />
            </div>
          </div>

          {/* Chevron */}
          <div className="mt-12 flex justify-center">
            <ChevronDown className="h-6 w-6 text-emerald-100/80 animate-bounce" />
          </div>
        </div>

        {/* 🔻 News Ticker */}
        <NewsTicker items={NEWS} />
      </section>
    </>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}): ReactElement {
  return (
    <div className="flex items-center gap-3 rounded-md bg-black/25 px-3 py-2 ring-1 ring-white/10 backdrop-blur-sm">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-700/60">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-white">{value}</div>
        <div className="text-xs text-emerald-100/80">{label}</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   News Ticker — smooth, infinite, pauses on hover,
   respects prefers-reduced-motion, ARIA labeled
   ────────────────────────────────────────────────────────── */
function NewsTicker({ items }: { items: string[] }): ReactElement {
  const row = [...items, ...items]; // duplicate for seamless loop

  return (
    <>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track { animation: tickerScroll 35s linear infinite; }
        .ticker-paused:hover .ticker-track { animation-play-state: paused; }

        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none !important; transform: translateX(0) !important; }
        }
      `}</style>

      <div
        className="absolute inset-x-0 bottom-0 z-20 bg-red-700/95 text-white"
        role="region"
        aria-label="Latest news"
      >
        <div className="relative mx-auto max-w-6xl w-full overflow-hidden">
          {/* edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-red-700/95 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-red-700/95 to-transparent" />

          <div className="ticker-paused" aria-live="off">
            <div className="flex whitespace-nowrap ticker-track">
              <div className="flex items-center gap-6 px-4 py-2 text-xs sm:text-sm">
                <strong className="mr-1">Latest:</strong>
                {row.map((text, i) => (
                  <span key={`${text}-${i}`} className="opacity-95">
                    {text}
                    <span className="mx-4 opacity-70">•</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
