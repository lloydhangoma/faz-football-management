import React from 'react';
import { Link } from 'react-router-dom';

const U20Teams: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg"
          alt="U-20 Teams"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                U-20 Teams
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-xl">
                Zambia's Under-20 Teams - Developing the next generation of football talent.
              </p>
              <Link
                to="/teams"
                className="inline-block bg-[#f97316] text-white px-8 py-3 rounded-md font-bold uppercase hover:bg-orange-600 transition"
              >
                ← Back to Teams
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="bg-white py-24 w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div>
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight mb-6">
                Team Overview
              </h2>
              <div className="h-1 w-20 bg-[#f97316] rounded-full mb-8" />
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                The U-20 teams represent Zambia's youth development program, featuring young talented athletes between 16-20 years old. These teams compete in the FIFA U-20 World Cup and the CAF U-20 Africa Cup of Nations.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our youth development program is designed to identify, develop, and nurture the next generation of national team players, ensuring a continuous pipeline of talent for the Chipolololo and Shepolopolo.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg"
                alt="Team Photo"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>

          {/* Upcoming Tournaments Placeholder */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="text-3xl font-black text-gray-900 uppercase mb-8">Upcoming Tournaments</h3>
            <p className="text-gray-600 text-lg">Tournament information coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default U20Teams;
