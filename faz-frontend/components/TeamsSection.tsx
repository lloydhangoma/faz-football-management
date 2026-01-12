import React from 'react';
import TeamCard from './TeamCard';
import { Team } from '../types';

const teams: Team[] = [
  {
    id: 1,
    name: 'Chipolopolo',
    category: 'Senior Men',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Chipolopolo_dtapv7.jpg',
  },
  {
    id: 2,
    name: 'Under 17',
    category: 'U17',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/under_17_hnyht0.jpg',
  },
  {
    id: 3,
    name: 'Copper Queens',
    category: 'Women',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149064/copperQueens_izzthq.jpg',
  },
  {
    id: 4,
    name: 'Futsal',
    category: 'Futsal Team',
    image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1768149065/Futsal_team._wthik0.jpg',
  },
];

const TeamsSection: React.FC = () => {
  return (
    <section className="py-12 bg-transparent overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-extrabold text-white">Teams</h2>
        </div>

        <div className="flex items-start gap-6 overflow-x-auto overflow-y-hidden pb-4">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamsSection;
