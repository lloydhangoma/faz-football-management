// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Clubs from "../pages/Clubs";
import Home from "../pages/Home";
import Players from "../pages/Players";
import Transfers from "../pages/Transfers";
import News from "../pages/News";
import Statistics from "../pages/Statistics";
import Injuries from "../pages/Injuries";
import Leagues from "../pages/Leagues";
import About from "../pages/About";
import Contact from "../pages/Contact";

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/players" element={<Players />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/news" element={<News />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/injuries" element={<Injuries />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
}
