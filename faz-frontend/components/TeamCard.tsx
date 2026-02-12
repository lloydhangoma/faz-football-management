import React from 'react';

interface Team {
  id: number;
  name: string;
  category: string;
  image: string;
}

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div className="w-full cursor-pointer">
      <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-lg bg-slate-900">
        {/* Image */}
        <img
          src={team.image}
          alt={team.name}
          className="w-full h-full object-cover opacity-80"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Content Pinned to Bottom */}
        <div className="absolute bottom-0 left-0 w-full p-6">
          <p className="text-[#f97316] font-bold text-xs uppercase tracking-[0.2em] mb-2 drop-shadow-md">
            {team.category}
          </p>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-lg">
            {team.name}
          </h3>
          
          {/* Static colored bar */}
          <div className="h-1 w-full bg-[#f97316] mt-4 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default TeamCard;