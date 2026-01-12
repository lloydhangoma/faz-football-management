import React from 'react';
import { Team } from '../types';

interface TeamCardProps {
  team: Team;
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div className="flex-shrink-0 w-72 h-[420px] rounded-2xl overflow-hidden shadow-md bg-red-600 border border-white/10">
      <img
        src={team.image}
        alt={team.name}
        className="w-full h-72 object-cover"
      />

      <div className="p-4 text-center text-white">
        <p className="text-xs uppercase text-white/80 mb-1">{team.category}</p>
        <h3 className="text-2xl font-bold">{team.name}</h3>
      </div>
    </div>
  );
};

export default TeamCard;
