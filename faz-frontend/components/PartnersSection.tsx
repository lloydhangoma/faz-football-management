
import React from 'react';

const PARTNERS = [
  { name: 'MTN', logo: 'https://via.placeholder.com/150x80?text=MTN+Logo' },
  { name: 'KPR', logo: 'https://via.placeholder.com/150x80?text=KPR+Logo' },
  { name: 'G-Sports', logo: 'https://via.placeholder.com/150x80?text=G-Sports' },
  { name: 'Zambian Breweries', logo: 'https://via.placeholder.com/150x80?text=ZB+Logo' },
  { name: 'Standard Chartered', logo: 'https://via.placeholder.com/150x80?text=StanChart' }
];

const PartnersSection: React.FC = () => {
  return (
    <section className="bg-faz-green py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Our Official Partners & Sponsors</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
          {PARTNERS.map((partner) => (
            <div key={partner.name} className="h-12 w-32 flex items-center justify-center filter invert brightness-0">
               <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
