import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
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
          {/* Add other routes as needed */}
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;