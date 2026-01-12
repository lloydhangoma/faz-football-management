import React from 'react';
import HeroSlider from '../components/HeroSlider';
import FixturesSection from '../components/FixturesSection';
import NewsSection from '../components/NewsSection';
import PartnersSection from '../components/PartnersSection';
import TicketsSection from '../components/TicketsSection';
import TeamsSection from '../components/TeamsSection';

const Home: React.FC = () => {
  return (
    /* Fix: Using 'w-full' and 'max-w-full' combined with 'overflow-x-clip' 
       prevents any child component from pushing the width of the page.
    */
    <main className="relative w-full max-w-full overflow-x-clip bg-white">
      
      {/* 🚀 Hero Section with Trending News Slider */}
      <div className="w-full overflow-hidden">
        <HeroSlider />
      </div>

      {/* 🏟️ Match Centre - Clean transition from hero */}
      <FixturesSection />

      {/* 🎟️ Tickets Section */}
      <TicketsSection />

      {/* 👥 Teams showcase */}
      <TeamsSection />

      {/* 📰 Additional News Headlines */}
      <NewsSection />

      {/* 🤝 Partners & Sponsors */}
      <PartnersSection />

      {/* ✉️ Newsletter */}
      <section className="bg-gray-100 py-24 w-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-condensed font-extrabold text-faz-green uppercase mb-6">Never Miss a Goal</h2>
          <p className="text-gray-600 mb-10 text-lg font-medium">Get the latest Chipolopolo news, tickets and exclusive offers delivered to your inbox.</p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto w-full">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-grow px-6 py-4 rounded-md border-2 border-gray-200 focus:border-faz-green outline-none font-medium transition shadow-sm w-full"
            />
            <button className="bg-faz-green text-white px-10 py-4 rounded-md font-bold uppercase hover:bg-faz-orange transition shadow-lg transform active:scale-95 whitespace-nowrap">
              Subscribe Now
            </button>
          </form>
          
          <p className="text-[10px] text-gray-400 mt-6 uppercase tracking-widest font-bold">
            By subscribing, you agree to our privacy policy and terms of service
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;