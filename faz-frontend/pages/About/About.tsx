import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      description: 'Learn about the Football Association of Zambia and our role in developing football.',
      link: '/about/intro'
    },
    {
      id: 'president',
      title: "President's Corner",
      description: 'Read the latest message from the FAZ President.',
      link: '/about/president'
    },
    {
      id: 'mission',
      title: 'Mission Statement',
      description: 'Discover our mission, vision, and strategic objectives.',
      link: '/about/mission'
    },
    {
      id: 'secretariat',
      title: 'Secretariat',
      description: 'Meet the FAZ leadership and executive team.',
      link: '/about/secretariat'
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <img 
          src="https://res.cloudinary.com/djuz1gf78/image/upload/v1769085842/fazPhoto1_g4eo3r.jpg"
          alt="FAZ Heritage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex items-center">
          <div className="max-w-[1440px] mx-auto px-4 md:px-12 w-full">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-condensed font-black text-white uppercase tracking-tighter leading-none mb-6">
                Building Football <br />Excellence in Zambia
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-8 leading-relaxed max-w-xl">
                The Football Association of Zambia is committed to developing world-class football through strategic vision, technical excellence, and sustainable governance. Discover our mission to elevate Zambian football on the continental and global stage.
              </p>
              <Link
                to="/about/mission"
                className="inline-block px-8 py-4 bg-faz-orange hover:bg-faz-orange/90 text-white font-black uppercase tracking-widest text-sm transition-all transform hover:scale-105 shadow-lg"
              >
                View Our Mission
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.link}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border-t-4 border-green-600"
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition mb-2">
                  {section.title}
                </h3>
                <p className="text-gray-600">
                  {section.description}
                </p>
                <div className="mt-4 text-green-600 font-semibold group-hover:translate-x-2 transition">
                  Learn More →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
