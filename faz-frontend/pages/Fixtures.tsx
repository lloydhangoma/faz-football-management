import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type DashboardView = "matches" | "results" | "standings";
type TeamCategory = "All" | "Men" | "Women" | "U15" | "U17" | "U20" | "U23";

interface MatchCardData {
  id: string;
  tournament: string;
  year: string;
  category: Exclude<TeamCategory, "All">;
  day: string;
  date: string;
  venue: string;
  location: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  time?: string;
  homeScore?: number;
  awayScore?: number;
}

interface StandingRow {
  position: number;
  team: string;
  flag: string;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goalDiff: number;
  bonus: number;
  points: number;
}

interface StandingsGroup {
  id: string;
  tournament: string;
  year: string;
  category: Exclude<TeamCategory, "All">;
  group: string;
  rows: StandingRow[];
}

const parseDateValue = (value: string): number => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const categories: TeamCategory[] = ["All", "Men", "Women", "U15", "U17", "U20", "U23"];

const upcomingFixtures: MatchCardData[] = [
  {
    id: "fx-1",
    tournament: "FIFA World Cup Qualifiers",
    year: "2026",
    category: "Men",
    day: "Thursday",
    date: "11 June 2026",
    venue: "Levy Mwanawasa Stadium",
    location: "Ndola, Zambia",
    homeTeam: "Zambia",
    awayTeam: "Morocco",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/320px-Flag_of_Morocco.svg.png",
    time: "18:00",
  },
  {
    id: "fx-2",
    tournament: "WAFCON Qualifiers",
    year: "2026",
    category: "Women",
    day: "Sunday",
    date: "14 June 2026",
    venue: "National Heroes Stadium",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia",
    awayTeam: "Ghana",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/320px-Flag_of_Ghana.svg.png",
    time: "15:00",
  },
  {
    id: "fx-3",
    tournament: "COSAFA U20 Championship",
    year: "2026",
    category: "U20",
    day: "Tuesday",
    date: "16 June 2026",
    venue: "Woodlands Stadium",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia U20",
    awayTeam: "South Africa U20",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/320px-Flag_of_South_Africa.svg.png",
    time: "14:00",
  },
  {
    id: "fx-4",
    tournament: "COSAFA U17 Championship",
    year: "2026",
    category: "U17",
    day: "Friday",
    date: "19 June 2026",
    venue: "Nkoloma Stadium",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia U17",
    awayTeam: "Angola U17",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Flag_of_Angola.svg/320px-Flag_of_Angola.svg.png",
    time: "13:00",
  },
  {
    id: "fx-5",
    tournament: "Olympic Qualifiers",
    year: "2026",
    category: "U23",
    day: "Monday",
    date: "22 June 2026",
    venue: "Sunset Stadium",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia U23",
    awayTeam: "Tunisia U23",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/320px-Flag_of_Tunisia.svg.png",
    time: "17:00",
  },
  {
    id: "fx-6",
    tournament: "CAF Schools Championship",
    year: "2026",
    category: "U15",
    day: "Wednesday",
    date: "24 June 2026",
    venue: "OYDC Arena",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia U15",
    awayTeam: "Namibia U15",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/320px-Flag_of_Namibia.svg.png",
    time: "10:30",
  },
  {
    id: "fx-7",
    tournament: "FIFA World Cup Qualifiers",
    year: "2025",
    category: "Men",
    day: "Saturday",
    date: "16 November 2025",
    venue: "National Heroes Stadium",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia",
    awayTeam: "Tanzania",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/320px-Flag_of_Tanzania.svg.png",
    time: "20:00",
  },
  {
    id: "fx-8",
    tournament: "WAFCON Qualifiers",
    year: "2025",
    category: "Women",
    day: "Sunday",
    date: "17 November 2025",
    venue: "Levy Mwanawasa Stadium",
    location: "Ndola, Zambia",
    homeTeam: "Zambia",
    awayTeam: "Botswana",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_Botswana.svg/320px-Flag_of_Botswana.svg.png",
    time: "16:00",
  },
];

const matchResults: MatchCardData[] = [
  {
    id: "rs-1",
    tournament: "FIFA World Cup Qualifiers",
    year: "2026",
    category: "Men",
    day: "Sunday",
    date: "07 June 2026",
    venue: "Stade de Marrakech",
    location: "Marrakech, Morocco",
    homeTeam: "Morocco",
    awayTeam: "Zambia",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/320px-Flag_of_Morocco.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    homeScore: 1,
    awayScore: 1,
  },
  {
    id: "rs-2",
    tournament: "WAFCON Qualifiers",
    year: "2026",
    category: "Women",
    day: "Saturday",
    date: "30 May 2026",
    venue: "Cape Coast Stadium",
    location: "Cape Coast, Ghana",
    homeTeam: "Ghana",
    awayTeam: "Zambia",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/320px-Flag_of_Ghana.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    homeScore: 0,
    awayScore: 2,
  },
  {
    id: "rs-3",
    tournament: "COSAFA U20 Championship",
    year: "2026",
    category: "U20",
    day: "Monday",
    date: "25 May 2026",
    venue: "Dobsonville Stadium",
    location: "Johannesburg, South Africa",
    homeTeam: "Zambia U20",
    awayTeam: "Zimbabwe U20",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/320px-Flag_of_Zimbabwe.svg.png",
    homeScore: 3,
    awayScore: 1,
  },
  {
    id: "rs-4",
    tournament: "COSAFA U17 Championship",
    year: "2026",
    category: "U17",
    day: "Saturday",
    date: "23 May 2026",
    venue: "Moses Mabhida Outer Field",
    location: "Durban, South Africa",
    homeTeam: "Zambia U17",
    awayTeam: "Malawi U17",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Flag_of_Malawi.svg/320px-Flag_of_Malawi.svg.png",
    homeScore: 2,
    awayScore: 2,
  },
  {
    id: "rs-5",
    tournament: "Olympic Qualifiers",
    year: "2025",
    category: "U23",
    day: "Friday",
    date: "15 November 2025",
    venue: "Stade Olympique",
    location: "Rades, Tunisia",
    homeTeam: "Tunisia U23",
    awayTeam: "Zambia U23",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/320px-Flag_of_Tunisia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    homeScore: 1,
    awayScore: 0,
  },
  {
    id: "rs-6",
    tournament: "CAF Schools Championship",
    year: "2025",
    category: "U15",
    day: "Tuesday",
    date: "12 November 2025",
    venue: "National Sports Complex",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia U15",
    awayTeam: "Mozambique U15",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Flag_of_Mozambique.svg/320px-Flag_of_Mozambique.svg.png",
    homeScore: 2,
    awayScore: 0,
  },
  {
    id: "rs-7",
    tournament: "FIFA World Cup Qualifiers",
    year: "2025",
    category: "Men",
    day: "Thursday",
    date: "07 November 2025",
    venue: "Levy Mwanawasa Stadium",
    location: "Ndola, Zambia",
    homeTeam: "Zambia",
    awayTeam: "Congo",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_the_Republic_of_the_Congo.svg/320px-Flag_of_the_Republic_of_the_Congo.svg.png",
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: "rs-8",
    tournament: "WAFCON Qualifiers",
    year: "2025",
    category: "Women",
    day: "Monday",
    date: "04 November 2025",
    venue: "National Heroes Stadium",
    location: "Lusaka, Zambia",
    homeTeam: "Zambia",
    awayTeam: "Senegal",
    homeFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png",
    awayFlag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/320px-Flag_of_Senegal.svg.png",
    homeScore: 1,
    awayScore: 1,
  },
];

const standingsData: StandingsGroup[] = [
  {
    id: "st-1",
    tournament: "FIFA World Cup Qualifiers",
    year: "2026",
    category: "Men",
    group: "Group E",
    rows: [
      { position: 1, team: "Morocco", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Flag_of_Morocco.svg/320px-Flag_of_Morocco.svg.png", played: 4, won: 3, draw: 1, lost: 0, goalDiff: 6, bonus: 0, points: 10 },
      { position: 2, team: "Zambia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png", played: 4, won: 2, draw: 1, lost: 1, goalDiff: 2, bonus: 0, points: 7 },
      { position: 3, team: "Congo", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Flag_of_the_Republic_of_the_Congo.svg/320px-Flag_of_the_Republic_of_the_Congo.svg.png", played: 4, won: 1, draw: 1, lost: 2, goalDiff: -2, bonus: 0, points: 4 },
      { position: 4, team: "Tanzania", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Tanzania.svg/320px-Flag_of_Tanzania.svg.png", played: 4, won: 1, draw: 1, lost: 2, goalDiff: -3, bonus: 0, points: 4 },
      { position: 5, team: "Niger", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Flag_of_Niger.svg/320px-Flag_of_Niger.svg.png", played: 4, won: 0, draw: 2, lost: 2, goalDiff: -3, bonus: 0, points: 2 },
    ],
  },
  {
    id: "st-2",
    tournament: "WAFCON Qualifiers",
    year: "2026",
    category: "Women",
    group: "Southern Zone",
    rows: [
      { position: 1, team: "Zambia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png", played: 5, won: 4, draw: 1, lost: 0, goalDiff: 9, bonus: 0, points: 13 },
      { position: 2, team: "Ghana", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Flag_of_Ghana.svg/320px-Flag_of_Ghana.svg.png", played: 5, won: 3, draw: 1, lost: 1, goalDiff: 5, bonus: 0, points: 10 },
      { position: 3, team: "Senegal", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Flag_of_Senegal.svg/320px-Flag_of_Senegal.svg.png", played: 5, won: 1, draw: 2, lost: 2, goalDiff: -1, bonus: 0, points: 5 },
      { position: 4, team: "Botswana", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Flag_of_Botswana.svg/320px-Flag_of_Botswana.svg.png", played: 5, won: 1, draw: 1, lost: 3, goalDiff: -6, bonus: 0, points: 4 },
      { position: 5, team: "Namibia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Flag_of_Namibia.svg/320px-Flag_of_Namibia.svg.png", played: 5, won: 0, draw: 1, lost: 4, goalDiff: -7, bonus: 0, points: 1 },
    ],
  },
  {
    id: "st-3",
    tournament: "COSAFA U20 Championship",
    year: "2026",
    category: "U20",
    group: "Group A",
    rows: [
      { position: 1, team: "Zambia U20", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png", played: 3, won: 2, draw: 1, lost: 0, goalDiff: 4, bonus: 0, points: 7 },
      { position: 2, team: "South Africa U20", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/320px-Flag_of_South_Africa.svg.png", played: 3, won: 2, draw: 0, lost: 1, goalDiff: 2, bonus: 0, points: 6 },
      { position: 3, team: "Zimbabwe U20", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/320px-Flag_of_Zimbabwe.svg.png", played: 3, won: 1, draw: 0, lost: 2, goalDiff: -2, bonus: 0, points: 3 },
      { position: 4, team: "Malawi U20", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Flag_of_Malawi.svg/320px-Flag_of_Malawi.svg.png", played: 3, won: 0, draw: 1, lost: 2, goalDiff: -4, bonus: 0, points: 1 },
    ],
  },
  {
    id: "st-4",
    tournament: "Olympic Qualifiers",
    year: "2025",
    category: "U23",
    group: "Group C",
    rows: [
      { position: 1, team: "Tunisia U23", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Tunisia.svg/320px-Flag_of_Tunisia.svg.png", played: 4, won: 3, draw: 1, lost: 0, goalDiff: 5, bonus: 0, points: 10 },
      { position: 2, team: "Zambia U23", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Flag_of_Zambia.svg/320px-Flag_of_Zambia.svg.png", played: 4, won: 2, draw: 1, lost: 1, goalDiff: 2, bonus: 0, points: 7 },
      { position: 3, team: "Algeria U23", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Flag_of_Algeria.svg/320px-Flag_of_Algeria.svg.png", played: 4, won: 1, draw: 1, lost: 2, goalDiff: -2, bonus: 0, points: 4 },
      { position: 4, team: "Benin U23", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Flag_of_Benin.svg/320px-Flag_of_Benin.svg.png", played: 4, won: 0, draw: 1, lost: 3, goalDiff: -5, bonus: 0, points: 1 },
    ],
  },
];

const tabButtonClass = (active: boolean): string =>
  `rounded-md px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-[0.16em] transition-colors ${
    active
      ? "bg-faz-green text-white"
      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
  }`;

const filterButtonClass = (active: boolean): string =>
  `rounded-full px-4 py-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.16em] transition-colors ${
    active
      ? "bg-faz-orange text-white"
      : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
  }`;

const MatchCard: React.FC<{ match: MatchCardData; mode: "matches" | "results" }> = ({
  match,
  mode,
}) => {
  return (
    <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-3 md:gap-6 md:p-6">
        <div className="space-y-1.5 border-b border-gray-100 pb-4 md:border-b-0 md:pb-0 md:pr-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-faz-orange">
            {match.day}
          </p>
          <p className="text-lg font-black tracking-tight text-gray-900">{match.date}</p>
          <p className="text-sm font-semibold text-gray-800">{match.venue}</p>
          <p className="text-sm text-gray-500">{match.location}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 text-center border-b border-gray-100 pb-4 md:border-b-0 md:pb-0">
          <p className="text-lg font-black uppercase tracking-tight text-gray-900">
            <span className="text-faz-orange">*</span> {match.homeTeam}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">vs</p>
          <p className="text-lg font-black uppercase tracking-tight text-gray-900">{match.awayTeam}</p>
        </div>

        <div className="flex items-center justify-start md:justify-end">
          {mode === "matches" ? (
            <div className="flex w-full max-w-[340px] flex-col gap-3 sm:flex-row">
              <div className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
                <div className="flex items-center justify-between gap-2">
                  <img src={match.homeFlag} alt={`${match.homeTeam} flag`} className="h-6 w-9 rounded object-cover shadow-sm" />
                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Kick-Off
                    </p>
                    <p className="text-xl font-black text-faz-green">{match.time}</p>
                  </div>
                  <img src={match.awayFlag} alt={`${match.awayTeam} flag`} className="h-6 w-9 rounded object-cover shadow-sm" />
                </div>
              </div>
              <div className="flex flex-row gap-4 sm:flex-col sm:justify-center sm:gap-2">
                <a href="#" className="text-[11px] font-bold uppercase tracking-[0.16em] text-faz-green hover:text-faz-orange">
                  Buy Tickets
                </a>
                <a href="#" className="text-[11px] font-bold uppercase tracking-[0.16em] text-faz-green hover:text-faz-orange">
                  Watch Live
                </a>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[340px] rounded-xl border border-gray-200 bg-gray-50 px-3 py-3">
              <div className="flex items-center justify-between gap-3">
                <img src={match.homeFlag} alt={`${match.homeTeam} flag`} className="h-7 w-10 rounded object-cover shadow-sm" />
                <div className="text-center">
                  <p className="text-2xl font-black text-gray-900">
                    {match.homeScore} - {match.awayScore}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">FT</p>
                </div>
                <img src={match.awayFlag} alt={`${match.awayTeam} flag`} className="h-7 w-10 rounded object-cover shadow-sm" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">
        <a href="#" className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-faz-green hover:text-faz-orange">
          Match Centre <span aria-hidden="true">-&gt;</span>
        </a>
      </div>
    </article>
  );
};

const StandingsTable: React.FC<{ group: StandingsGroup }> = ({ group }) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-green-900/20 bg-gradient-to-r from-faz-green to-[#0a7f47] px-5 py-4 text-white">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-green-100">
          {group.tournament} | {group.year}
        </p>
        <h3 className="mt-1 text-lg font-black uppercase tracking-tight">{group.group}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Team</th>
              <th className="px-4 py-3 text-center">P</th>
              <th className="px-4 py-3 text-center">W</th>
              <th className="px-4 py-3 text-center">D</th>
              <th className="px-4 py-3 text-center">L</th>
              <th className="px-4 py-3 text-center">PD</th>
              <th className="px-4 py-3 text-center">B</th>
              <th className="px-4 py-3 text-center">Pts</th>
            </tr>
          </thead>
          <tbody>
            {group.rows.map((row) => (
              <tr key={`${group.id}-${row.position}`} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3 text-sm font-semibold text-gray-600">{row.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={row.flag} alt={`${row.team} flag`} className="h-5 w-7 rounded object-cover shadow-sm" />
                    <span className="text-sm font-semibold text-gray-800">{row.team}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{row.played}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{row.won}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{row.draw}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{row.lost}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{row.goalDiff}</td>
                <td className="px-4 py-3 text-center text-sm text-gray-700">{row.bonus}</td>
                <td className="px-4 py-3 text-center text-base font-black text-faz-green">{row.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const Fixtures: React.FC = () => {
  const [activeView, setActiveView] = useState<DashboardView>("matches");
  const [activeCategory, setActiveCategory] = useState<TeamCategory>("All");
  const [activeTournament, setActiveTournament] = useState<string>("All Tournaments");
  const [activeYear, setActiveYear] = useState<string>("All Years");
  const [visibleFixtureCount, setVisibleFixtureCount] = useState(4);
  const [visibleResultCount, setVisibleResultCount] = useState(4);

  const tournamentOptions = useMemo(() => {
    const values = new Set<string>();
    [...upcomingFixtures, ...matchResults].forEach((item) => values.add(item.tournament));
    standingsData.forEach((item) => values.add(item.tournament));
    return ["All Tournaments", ...Array.from(values)];
  }, []);

  const yearOptions = useMemo(() => {
    const values = new Set<string>();
    [...upcomingFixtures, ...matchResults].forEach((item) => values.add(item.year));
    standingsData.forEach((item) => values.add(item.year));
    return ["All Years", ...Array.from(values).sort((a, b) => Number(b) - Number(a))];
  }, []);

  const filteredFixtures = useMemo(() => {
    const selected = upcomingFixtures.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const tournamentMatch =
        activeTournament === "All Tournaments" || item.tournament === activeTournament;
      const yearMatch = activeYear === "All Years" || item.year === activeYear;
      return categoryMatch && tournamentMatch && yearMatch;
    });

    return [...selected].sort((a, b) => parseDateValue(a.date) - parseDateValue(b.date));
  }, [activeCategory, activeTournament, activeYear]);

  const filteredResults = useMemo(() => {
    const selected = matchResults.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const tournamentMatch =
        activeTournament === "All Tournaments" || item.tournament === activeTournament;
      const yearMatch = activeYear === "All Years" || item.year === activeYear;
      return categoryMatch && tournamentMatch && yearMatch;
    });

    return [...selected].sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));
  }, [activeCategory, activeTournament, activeYear]);

  const filteredStandings = useMemo(() => {
    return standingsData.filter((item) => {
      const categoryMatch = activeCategory === "All" || item.category === activeCategory;
      const tournamentMatch =
        activeTournament === "All Tournaments" || item.tournament === activeTournament;
      const yearMatch = activeYear === "All Years" || item.year === activeYear;
      return categoryMatch && tournamentMatch && yearMatch;
    });
  }, [activeCategory, activeTournament, activeYear]);

  const nextMatch = filteredFixtures[0];

  useEffect(() => {
    setVisibleFixtureCount(4);
    setVisibleResultCount(4);
  }, [activeCategory, activeTournament, activeYear, activeView]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 text-gray-900">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg"
          alt="FAZ Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-condensed font-black text-white uppercase tracking-tighter leading-none mb-6">
                Fixtures, Results <br />and Standings
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-xl">
                Track every Zambia national team match from kick-off schedules to final scores and current group standings in one unified match centre.
              </p>
              <Link
                to="/fixtures#fixtures-dashboard"
                className="inline-block px-8 py-4 bg-faz-orange hover:bg-faz-orange/90 text-white font-black uppercase tracking-widest text-sm transition-all transform hover:scale-105 shadow-lg"
              >
                Explore Match Centre
              </Link>
              {nextMatch && (
                <div className="mt-6 inline-flex flex-col rounded-lg border border-white/30 bg-black/30 px-4 py-3 text-white backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">Next Match</p>
                  <p className="text-sm font-bold">{nextMatch.homeTeam} vs {nextMatch.awayTeam}</p>
                  <p className="text-xs text-white/85">{nextMatch.date} | {nextMatch.time} | {nextMatch.venue}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section id="fixtures-dashboard" className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
            <button type="button" className={tabButtonClass(activeView === "matches")} onClick={() => setActiveView("matches")}>
              Matches
            </button>
            <button type="button" className={tabButtonClass(activeView === "results")} onClick={() => setActiveView("results")}>
              Results
            </button>
            <button type="button" className={tabButtonClass(activeView === "standings")} onClick={() => setActiveView("standings")}>
              Standings
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={filterButtonClass(activeCategory === category)}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Tournament
                <select
                  value={activeTournament}
                  onChange={(event) => setActiveTournament(event.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-700 outline-none transition-colors focus:border-faz-green"
                >
                  {tournamentOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                Year
                <select
                  value={activeYear}
                  onChange={(event) => setActiveYear(event.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-700 outline-none transition-colors focus:border-faz-green"
                >
                  {yearOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {activeView === "matches" && (
            <>
              {filteredFixtures.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm font-semibold text-gray-500">
                  No upcoming fixtures match the selected filters.
                </div>
              )}

              {filteredFixtures.slice(0, visibleFixtureCount).map((match) => (
                <MatchCard key={match.id} match={match} mode="matches" />
              ))}

              {visibleFixtureCount < filteredFixtures.length && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleFixtureCount((value) => value + 4)}
                    className="rounded-full border border-faz-green px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-faz-green transition-colors hover:bg-faz-green hover:text-white"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}

          {activeView === "results" && (
            <>
              {filteredResults.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm font-semibold text-gray-500">
                  No match results found for the selected filters.
                </div>
              )}

              {filteredResults.slice(0, visibleResultCount).map((match) => (
                <MatchCard key={match.id} match={match} mode="results" />
              ))}

              {visibleResultCount < filteredResults.length && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleResultCount((value) => value + 4)}
                    className="rounded-full border border-faz-green px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-faz-green transition-colors hover:bg-faz-green hover:text-white"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}

          {activeView === "standings" && (
            <>
              {filteredStandings.length === 0 && (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm font-semibold text-gray-500">
                  No standings tables available for the selected filters.
                </div>
              )}
              {filteredStandings.map((group) => (
                <StandingsTable key={group.id} group={group} />
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Fixtures;
