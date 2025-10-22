// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
// If you have a footer, uncomment the next line and the usage below
// import Footer from "../components/layout/Footer";

import Home from "../pages/Home";
import Clubs from "../pages/Clubs";
import Players from "../pages/Players";
import Transfers from "../pages/Transfers";
import News from "../pages/News";
import Statistics from "../pages/Statistics";
import Injuries from "../pages/Injuries";
import Leagues from "../pages/Leagues";
import About from "../pages/About";
import Contact from "../pages/Contact";

// 🧭 Club application wizard
import ApplyClubAccount from "../pages/club-application/ApplyClubAccount";

export default function AppRoutes() {
  const location = useLocation();

  // Hide chrome (navbar/footer) on application routes
  const hideChrome =
    location.pathname.startsWith("/club-applications") ||
    location.pathname === "/apply";

  return (
    <>
      {!hideChrome && <Navbar />}

      <Routes>
        {/* Public site */}
        <Route path="/" element={<Home />} />

        {/* Club Application Wizard (no navbar/footer) */}
        <Route path="/club-applications" element={<ApplyClubAccount />} />
        <Route path="/apply" element={<Navigate to="/club-applications" replace />} />

        {/* Other sections */}
        <Route path="/news" element={<News />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/players" element={<Players />} />
        <Route path="/transfers" element={<Transfers />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/injuries" element={<Injuries />} />
        <Route path="/leagues" element={<Leagues />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* { !hideChrome && <Footer /> } */}
    </>
  );
}
