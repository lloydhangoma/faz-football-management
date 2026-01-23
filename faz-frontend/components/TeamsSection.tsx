import React from 'react';
import { ArrowRight } from 'lucide-react';
import TeamCard from './TeamCard';

const TEAMS = [
  {
    id: 1,
    name: 'CHIPOLOPOLO',
    category: 'SENIOR MEN',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Chipolopolo_dtapv7.jpg',
  },
  {
    id: 2,
    name: 'COPPER QUEENS',
    category: 'SENIOR WOMEN',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/copperQueens_izzthq.jpg',
  },
  {
    id: 3,
    name: 'UNDER-17',
    category: 'YOUTH DEVELOPMENT',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/under_17_hnyht0.jpg',
  },
  {
    id: 4,
    name: 'FUTSAL',
    category: 'NATIONAL TEAM',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Futsal_team._wthik0.jpg',
  }
];

const TeamsSection: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header with Fading Orange Line - Same as News/Tickets */}
        <div className="mb-12">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              National Teams
            </h2>
            <button className="flex items-center gap-1 text-[#f97316] font-bold text-sm md:text-base uppercase group transition-colors hover:text-green-800">
              View All Teams <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>
          {/* Custom Fading Divider */}
          <div className="h-[4px] w-full bg-gradient-to-r from-[#f97316] via-[#f97316]/60 to-transparent" />
        </div>

        {/* Teams Horizontal Scroll / Grid */}
        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
          {TEAMS.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsSection;