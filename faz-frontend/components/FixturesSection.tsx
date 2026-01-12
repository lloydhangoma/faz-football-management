
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Match } from '../types';

const MOCK_DATA: Match[] = [
  // UPCOMING
  {
    id: 'u1',
    homeTeam: 'Zambia',
    homeLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Football_Association_of_Zambia_logo.png/150px-Football_Association_of_Zambia_logo.png',
    awayTeam: 'South Africa',
    awayLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/150px-Flag_of_South_Africa.svg.png',
    date: 'THURSDAY, 11 JUNE 2026',
    time: '22:00',
    competition: 'World Cup Qualifier',
    venue: 'National Heroes Stadium, Lusaka',
    category: 'MEN',
    status: 'UPCOMING'
  },
  {
    id: 'u2',
    homeTeam: 'Copper Queens',
    homeLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Football_Association_of_Zambia_logo.png/150px-Football_Association_of_Zambia_logo.png',
    awayTeam: 'Nigeria',
    awayLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Nigeria.svg/150px-Flag_of_Nigeria.svg.png',
    date: 'FRIDAY, 12 JUNE 2026',
    time: '15:00',
    competition: 'Olympic Qualifier',
    venue: 'Levy Mwanawasa Stadium, Ndola',
    category: 'WOMEN',
    status: 'UPCOMING'
  },
  // RESULTS
  {
    id: 'r1',
    homeTeam: 'Zambia',
    homeLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Football_Association_of_Zambia_logo.png/150px-Football_Association_of_Zambia_logo.png',
    awayTeam: 'Cameroon',
    awayLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Flag_of_Cameroon.svg/150px-Flag_of_Cameroon.svg.png',
    date: 'SUNDAY, 04 JANUARY 2026',
    time: 'FT',
    score: '1 - 2',
    competition: 'AFCON',
    venue: 'Stade El Barid',
    category: 'MEN',
    status: 'RESULT'
  },
  {
    id: 'r2',
    homeTeam: 'Zimbabwe',
    homeLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Flag_of_Zimbabwe.svg/150px-Flag_of_Zimbabwe.svg.png',
    awayTeam: 'Zambia',
    awayLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Football_Association_of_Zambia_logo.png/150px-Football_Association_of_Zambia_logo.png',
    date: 'MONDAY, 29 DECEMBER 2025',
    time: 'FT',
    score: '2 - 3',
    competition: 'COSAFA',
    venue: 'Stade de Marrakech',
    category: 'MEN',
    status: 'RESULT'
  },
  {
    id: 'r3',
    homeTeam: 'Egypt',
    homeLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/150px-Flag_of_Egypt.svg.png',
    awayTeam: 'Zambia',
    awayLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Football_Association_of_Zambia_logo.png/150px-Football_Association_of_Zambia_logo.png',
    date: 'FRIDAY, 26 DECEMBER 2025',
    time: 'FT',
    score: '1 - 0',
    competition: 'Friendly',
    venue: "Stade D'Agadir",
    category: 'MEN',
    status: 'RESULT'
  }
];

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  return (
    <div className="flex-shrink-0 w-[300px] md:w-[350px] bg-white rounded-md overflow-hidden flex flex-col shadow-lg">
      <div className="p-4 border-b border-gray-100 flex items-start gap-3">
        <div className="w-8 h-8 shrink-0 bg-slate-100 rounded flex items-center justify-center">
           <img 
             src="https://upload.wikimedia.org/wikipedia/en/thumb/0/06/Football_Association_of_Zambia_logo.png/50px-Football_Association_of_Zambia_logo.png" 
             className="w-5 h-5 grayscale opacity-50" 
             alt="FAZ"
           />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            {match.date}
          </span>
          <span className="text-[11px] font-bold text-slate-800 uppercase line-clamp-1">
            {match.venue}
          </span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center gap-2 w-[40%]">
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-100 p-2 flex items-center justify-center shadow-inner">
               <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-contain" />
             </div>
          </div>
          <div className="flex flex-col items-center justify-center w-[20%]">
            {match.status === 'RESULT' ? (
              <div className="flex flex-col items-center">
                <span className="bg-gray-50 px-2 py-1 text-faz-orange font-black text-lg md:text-xl rounded border border-gray-100">
                  {match.score}
                </span>
                <span className="text-[9px] font-black text-gray-400 mt-1 uppercase">FT</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="bg-gray-50 px-2 py-1 text-faz-orange font-black text-lg md:text-xl rounded border border-gray-100">
                  {match.time}
                </span>
                <span className="text-[9px] font-black text-gray-400 mt-1 uppercase">CAT</span>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2 w-[40%]">
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-gray-100 p-2 flex items-center justify-center shadow-inner">
               <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-contain" />
             </div>
          </div>
        </div>
        <div className="flex justify-between items-start text-center mb-2">
           <span className="w-[40%] text-[12px] font-black text-slate-800 uppercase tracking-tighter leading-tight">
             {match.homeTeam}
           </span>
           <div className="w-[20%]" />
           <span className="w-[40%] text-[12px] font-black text-slate-800 uppercase tracking-tighter leading-tight">
             {match.awayTeam}
           </span>
        </div>
      </div>
      <button className="w-full bg-faz-orange hover:brightness-110 transition-all text-slate-900 py-3 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-1 group">
        Match Centre <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
      </button>
    </div>
  );
};

const CarouselSection: React.FC<{ 
  title: string, 
  matches: Match[], 
  onScroll: (dir: 'L' | 'R') => void, 
  scrollRef: React.RefObject<HTMLDivElement> 
}> = ({ title, matches, onScroll, scrollRef }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const filters = ['ALL', 'MEN', 'WOMEN', 'UNDER 20', 'UNDER 17'];

  const filteredMatches = matches.filter(m => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'MEN') return m.category === 'MEN';
    if (activeFilter === 'WOMEN') return m.category === 'WOMEN';
    if (activeFilter === 'UNDER 20') return m.category === 'U20';
    if (activeFilter === 'UNDER 17') return m.category === 'U17';
    return true;
  });

  return (
    <div className="mb-20 last:mb-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <button className="flex items-center gap-2 text-white group mb-4">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter transition group-hover:text-faz-orange">
              {title}
            </h2>
            <ChevronRight className="w-6 h-6 text-faz-orange" />
          </button>
          <div className="flex flex-wrap items-center gap-4 text-[11px] font-black tracking-widest uppercase">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`pb-1 border-b-2 transition-all ${
                  activeFilter === f 
                    ? 'border-faz-orange text-faz-orange' 
                    : 'border-transparent text-white/60 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onScroll('L')}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onScroll('R')}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {filteredMatches.length > 0 ? (
          filteredMatches.map(m => <MatchCard key={m.id} match={m} />)
        ) : (
          <div className="w-full py-12 text-center text-white/30 font-bold uppercase tracking-widest italic">
            No matches found for this category
          </div>
        )}
      </div>
    </div>
  );
};

const FixturesSection: React.FC = () => {
  const upcomingRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const upcomingMatches = MOCK_DATA.filter(m => m.status === 'UPCOMING');
  const resultMatches = MOCK_DATA.filter(m => m.status === 'RESULT');

  const handleScroll = (ref: React.RefObject<HTMLDivElement>, direction: 'L' | 'R') => {
    if (ref.current) {
      const scrollAmount = 380;
      ref.current.scrollBy({
        left: direction === 'L' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-[#002816] py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 relative z-10">
        <CarouselSection 
          title="Upcoming Matches" 
          matches={upcomingMatches} 
          scrollRef={upcomingRef}
          onScroll={(dir) => handleScroll(upcomingRef, dir)}
        />
        <CarouselSection 
          title="Latest Results" 
          matches={resultMatches} 
          scrollRef={resultsRef}
          onScroll={(dir) => handleScroll(resultsRef, dir)}
        />
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default FixturesSection;
