import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import TeamCard from './TeamCard';

const TEAMS = [
  {
    id: 1,
    name: 'Chipolololo',
    category: 'Men\'s National Team',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Chipolopolo_dtapv7.jpg',
    link: '/teams/national-men'
  },
  {
    id: 2,
    name: 'Shepolopolo',
    category: 'Women\'s National Team',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/copperQueens_izzthq.jpg',
    link: '/teams/national-women'
  },
  {
    id: 3,
    name: 'U-20 Teams',
    category: 'Youth Development',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/under_17_hnyht0.jpg',
    link: '/teams/u20'
  },
  {
    id: 4,
    name: 'U-17 Teams',
    category: 'Youth Development',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Futsal_team._wthik0.jpg',
    link: '/teams/u17'
  }
];

const TeamsSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 w-full">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
        
        {/* Section Header */}
        <div className="mb-16">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
              National Teams
            </h2>
            <Link 
              to="/teams"
              className="flex items-center gap-2 text-[#f97316] font-bold text-sm md:text-base uppercase group transition-colors hover:text-orange-400"
            >
              View All Teams <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
          {/* Orange Divider */}
          <div className="h-1 w-20 bg-[#f97316] rounded-full" />
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAMS.map((team) => (
            <Link key={team.id} to={team.link} className="no-underline">
              <TeamCard team={team} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsSection;