import React from 'react';

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
    tag: 'World Cup Qualifier',
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
    tag: 'Limited',
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
    tag: 'Super League',
  },
];

const TicketsSection: React.FC = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-extrabold text-faz-dark mb-6">Tickets</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleTickets.map((t) => (
            <div key={t.id} className="rounded-lg border border-gray-100 shadow-sm overflow-hidden bg-white">
              <div className="p-6">
                <div className="flex items-center justify-between text-center">
                  <div className="flex-1">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-faz-dark">{t.homeAbbr}</div>
                    <p className="mt-3 text-sm font-semibold text-gray-700">{t.home}</p>
                  </div>
                  <div className="mx-4 text-gray-400 font-bold">vs</div>
                  <div className="flex-1">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-2xl font-bold text-faz-dark">{t.awayAbbr}</div>
                    <p className="mt-3 text-sm font-semibold text-gray-700">{t.away}</p>
                  </div>
                </div>

                <div className="mt-6 text-gray-500 text-sm space-y-2">
                  <div>📅 {t.date} &nbsp; ⏰ {t.time}</div>
                  <div>📍 {t.venue}</div>
                </div>
              </div>

              <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between bg-gray-50">
                <div>
                  <div className="text-xs text-gray-500">From</div>
                  <div className="text-xl font-bold text-faz-green">{t.price}</div>
                </div>
                <button className="bg-faz-green text-white px-6 py-3 rounded-md font-semibold shadow hover:opacity-95">View &amp; Select Seats</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TicketsSection;
