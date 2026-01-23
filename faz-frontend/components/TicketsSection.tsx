import React from 'react';
import { ArrowRight, Calendar, Clock, MapPin } from 'lucide-react';

const sampleTickets = [
  {
    id: 1,
    homeAbbr: 'ZAM',
    awayAbbr: 'MAL',
    home: 'Zambia',
    away: 'Malawi',
    date: 'Sat, 25 Jan 2025',
    time: '15:00',
    venue: 'National Heroes Stadium, Lusaka',
    price: 'ZMW 80.00',
  },
  {
    id: 2,
    homeAbbr: 'ZES',
    awayAbbr: 'ZAN',
    home: 'ZESCO United',
    away: 'Zanaco',
    date: 'Sun, 26 Jan 2025',
    time: '15:00',
    venue: 'Levy Mwanawasa Stadium, Ndola',
    price: 'ZMW 60.00',
  },
  {
    id: 3,
    homeAbbr: 'NKA',
    awayAbbr: 'POW',
    home: 'Nkana FC',
    away: 'Power Dynamos',
    date: 'Wed, 29 Jan 2025',
    time: '18:00',
    venue: 'Nkana Stadium, Kitwe',
    price: 'ZMW 55.00',
  },
];

const TicketsSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header with Fading Orange Line */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              Tickets
            </h2>
            <button className="flex items-center gap-1 text-[#f97316] font-bold text-sm md:text-base uppercase group transition-colors hover:text-green-700">
              Buy Tickets <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
          {/* Custom Fading Divider */}
          <div className="h-[4px] w-full bg-gradient-to-r from-[#f97316] via-[#f97316]/60 to-transparent" />
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleTickets.map((t) => (
            <div key={t.id} className="group rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
              <div className="p-8">
                {/* Team Logos/Abbr Section */}
                <div className="flex items-center justify-between mb-8">
                  <div className="text-center flex-1">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-black text-slate-800 shadow-inner group-hover:bg-white transition-colors">
                      {t.homeAbbr}
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-600 uppercase tracking-wide">{t.home}</p>
                  </div>
                  
                  <div className="px-4 text-xs font-black text-gray-300 uppercase italic">vs</div>
                  
                  <div className="text-center flex-1">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-black text-slate-800 shadow-inner group-hover:bg-white transition-colors">
                      {t.awayAbbr}
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-600 uppercase tracking-wide">{t.away}</p>
                  </div>
                </div>

                {/* Match Details */}
                <div className="space-y-3 text-slate-500">
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <Calendar className="w-4 h-4 text-[#f97316]" />
                    <span>{t.date}</span>
                    <span className="text-gray-300">|</span>
                    <Clock className="w-4 h-4 text-[#f97316]" />
                    <span>{t.time}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm font-medium leading-tight">
                    <MapPin className="w-4 h-4 text-[#f97316] mt-0.5" />
                    <span>{t.venue}</span>
                  </div>
                </div>
              </div>

              {/* Footer / Pricing */}
              <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest mb-0.5">Starting From</p>
                  <p className="text-2xl font-black text-slate-900">{t.price}</p>
                </div>
                <button className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#f97316] transition-all shadow-md active:scale-95">
                  Select Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TicketsSection;