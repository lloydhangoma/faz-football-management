import React from 'react';
import { Link } from 'react-router-dom';
import TeamCard from '../../components/TeamCard';

interface Team {
  id: number;
  name: string;
  category: string;
  image: string;
  link: string;
}

const Teams: React.FC = () => {
  const teams: Team[] = [
    {
      id: 1,
      name: 'Chipolololo',
      category: 'Men\'s National Team',
      image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg',
      link: '/teams/national-men'
    },
    {
      id: 2,
      name: 'Shepolopolo',
      category: 'Women\'s National Team',
      image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg',
      link: '/teams/national-women'
    },
    {
      id: 3,
      name: 'U-20 Teams',
      category: 'Youth Development',
      image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg',
      link: '/teams/u20'
    },
    {
      id: 4,
      name: 'U-17 Teams',
      category: 'Youth Development',
      image: 'https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg',
      link: '/teams/u17'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg"
          alt="FAZ Teams"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                Zambian National <br />Teams
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-xl">
                Meet the teams that represent Zambia on the continental and global stage. From the Chipolololo to the Shepolopolo, discover the pride of Zambian football.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid Section */}
      <section className="bg-white py-24 w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mb-4">
              Our Teams
            </h2>
            <div className="h-1 w-20 bg-[#f97316] rounded-full" />
          </div>

          {/* National Teams Section */}
          <div className="mb-24">
            <h3 className="text-2xl font-bold text-gray-900 uppercase mb-8 tracking-wide">
              National Teams
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {teams.slice(0, 2).map((team) => (
                <Link key={team.id} to={team.link} className="no-underline">
                  <TeamCard team={team} />
                </Link>
              ))}
            </div>
          </div>

          {/* Youth Development Section */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 uppercase mb-8 tracking-wide">
              Youth Development
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {teams.slice(2).map((team) => (
                <Link key={team.id} to={team.link} className="no-underline">
                  <TeamCard team={team} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#003366] to-[#f97316] py-24 w-full">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase mb-6 tracking-tight">
            Support Our Teams
          </h2>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Follow the Chipolopolo and Shepolopolo for the latest updates, match schedules, and exclusive content.
          </p>
          <button className="bg-white text-[#003366] px-12 py-4 rounded-md font-bold uppercase hover:bg-gray-100 transition shadow-lg transform active:scale-95">
            Subscribe for Updates
          </button>
        </div>
      </section>
    </div>
  );
};

export default Teams;
