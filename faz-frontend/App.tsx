import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About/About';
import News from './pages/News';
import Legends from './pages/Legends';
import Fixtures from './pages/Fixtures';
import Introduction from './pages/About/Introduction';
import President from './pages/About/President';
import Mission from './pages/About/Mission';
import Secretariat from './pages/About/Secretariat';
import Teams from './pages/Teams/Teams';
import NationalTeamMen from './pages/Teams/NationalTeamMen';
import NationalTeamWomen from './pages/Teams/NationalTeamWomen';
import U20Teams from './pages/Teams/U20Teams';
import U17Teams from './pages/Teams/U17Teams';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    /* overflow-x-hidden is crucial here to prevent horizontal scroll bars 
       when images stretch to the edges */
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      
      {/* UPDATED: Removed max-width to allow "Full-Width" sections like SAFA.net.
          Individual sections inside Home.tsx will now handle their own centering. */}
      <main className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/intro" element={<Introduction />} />
          <Route path="/about/president" element={<President />} />
          <Route path="/about/mission" element={<Mission />} />
          <Route path="/about/secretariat" element={<Secretariat />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/national-men" element={<NationalTeamMen />} />
          <Route path="/teams/national-women" element={<NationalTeamWomen />} />
          <Route path="/teams/u20" element={<U20Teams />} />
          <Route path="/teams/u17" element={<U17Teams />} />
          <Route path="/legends" element={<Legends />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/fixtures/:section" element={<Fixtures />} />
          <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} />
          {/* Add other routes as needed */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
