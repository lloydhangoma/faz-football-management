// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX, FiFacebook, FiTwitter, FiPhone } from "react-icons/fi";

type Item = { label: string; to: string };

const NAV_ITEMS: Item[] = [
  { label: "Home", to: "/" },
  { label: "Clubs", to: "/clubs" },
  { label: "Players", to: "/players" },
  { label: "Transfers", to: "/transfers" },
  { label: "News", to: "/news" },
  { label: "Statistics", to: "/statistics" },
  { label: "Injuries", to: "/injuries" },
  { label: "Leagues", to: "/leagues" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const CLUB_LOGO =
    "https://res.cloudinary.com/digaq48bp/image/upload/v1758265423/football-association-of-zambia-logo_oe9kyd.png";
  const SPONSOR_LOGO =
    "https://res.cloudinary.com/digaq48bp/image/upload/v1758266474/Zambia-Flag-Transparent-PNG_pjzyxr.png";

  const SOCIAL = {
    facebook: "https://facebook.com/yourpage",
    twitter: "https://twitter.com/yourhandle",
  };

  const CTA = { label: "CONTACT", to: "/contact", Icon: FiPhone };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      {/* ───────── Top strip (logo NOT here) ───────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex items-center gap-4">
          <div className="flex-1 flex items-center gap-4">
            {/* ⬅️ SWAP ORDER: orange bar first (left) */}
            <div className="flex-1 h-6 rounded-full bg-orange-500/90" />
            {/* ➡️ SWAP ORDER: green socials bar second (right) */}
            <div className="relative flex-1 h-6 rounded-full bg-green-600 shadow-inner">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="h-10 w-10 grid place-items-center rounded-full bg-white text-slate-700 text-lg md:text-xl shadow ring-1 ring-black/5 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                  <FiFacebook />
                </a>
                <a
                  href={SOCIAL.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  title="Twitter"
                  className="h-10 w-10 grid place-items-center rounded-full bg-white text-slate-700 text-lg md:text-xl shadow ring-1 ring-black/5 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                >
                  <FiTwitter />
                </a>
              </div>
            </div>
          </div>
          <div className="hidden md:block w-[88px]" />
        </div>
      </div>

      {/* ─────── Main row: Crest | Menu | Orange CONTACT ─────── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex items-center gap-3">
          {/* Crest (bigger on mobile, no round background) */}
          <Link
            to="/"
            title="Home"
            className="
              shrink-0 grid place-items-center
              h-24 w-24
              md:h-24 md:w-24
              lg:h-28 lg:w-28
              md:-translate-x-10 lg:-translate-x-14 xl:-translate-x-20
            "
          >
            <img src={CLUB_LOGO} alt="Club Logo" className="h-full w-full object-contain" />
          </Link>

          {/* Center: green rounded menu */}
          <div className="relative flex-1">
            <div className="h-16 md:h-20 rounded-full bg-green-700 text-white shadow-lg ring-1 ring-black/5 overflow-hidden">
              <div className="flex items-center h-full">
                {/* Sponsor chip (left) fills pill height */}
                <div className="hidden md:flex items-center gap-3 bg-white text-slate-800 rounded-l-full h-full pl-5 pr-6">
                  <img
                    src={SPONSOR_LOGO}
                    alt="Official Sponsor"
                    className="h-10 md:h-12 w-auto max-h-full object-contain"
                    loading="eager"
                  />
                  <div className="leading-tight text-sm">
                    <div className="font-semibold"></div>
                    <div></div>
                  </div>
                </div>

                {/* Desktop nav links — active underline orange */}
                <ul className="hidden md:flex flex-1 items-center justify-center gap-8 h-full px-6">
                  {NAV_ITEMS.map((it) => (
                    <li key={it.to} className="h-full grid place-items-center">
                      <NavLink
                        to={it.to}
                        className={({ isActive }) =>
                          [
                            "text-[11px] tracking-[0.25em] uppercase transition",
                            "hover:text-white/90",
                            isActive
                              ? "text-white after:block after:mx-auto after:mt-1 after:h-0.5 after:w-6 after:rounded-full after:bg-orange-500"
                              : "text-slate-200/90",
                          ].join(" ")
                        }
                      >
                        {it.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>

                {/* Mobile toggle on the pill */}
                <button
                  className="md:hidden ml-auto mr-3 my-2 h-10 w-10 grid place-items-center rounded-full bg-white text-slate-800"
                  onClick={() => setOpen((v) => !v)}
                  aria-label="Toggle menu"
                >
                  {open ? <FiX /> : <FiMenu />}
                </button>
              </div>
            </div>

            {/* MOBILE DRAWER: green, with green active/hover */}
            {open && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 md:hidden">
                <div className="rounded-2xl bg-green-700 text-white shadow-2xl ring-1 ring-black/20 overflow-hidden">
                  <ul className="flex flex-col divide-y divide-white/10">
                    {NAV_ITEMS.map((it) => (
                      <li key={it.to}>
                        <NavLink
                          to={it.to}
                          onClick={() => setOpen(false)}
                          className={({ isActive }) =>
                            [
                              "block px-5 py-3 text-sm uppercase tracking-wider",
                              isActive ? "bg-green-600/60" : "hover:bg-green-600/30",
                            ].join(" ")
                          }
                        >
                          {it.label}
                        </NavLink>
                      </li>
                    ))}
                    {/* Contact inside the drawer on mobile — ORANGE */}
                    <li className="p-3">
                      <Link
                        to={CTA.to}
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-orange-400 transition"
                      >
                        <FiPhone className="h-4 w-4" />
                        <span>{CTA.label}</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right: CONTACT circle — ORANGE on desktop */}
          <Link
            to={CTA.to}
            className="hidden md:grid shrink-0 h-16 w-16 place-items-center rounded-full bg-orange-500 text-slate-900 font-extrabold tracking-wider shadow-lg ring-1 ring-black/10 hover:bg-orange-400 transition md:translate-x-8 lg:translate-x-12 xl:translate-x-16"
            title={CTA.label}
          >
            <span className="text-[10px] leading-none">{CTA.label}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
