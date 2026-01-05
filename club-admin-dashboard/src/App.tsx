import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";

import ClubLogin from "@/pages/admin/Club-Login";
import ClubRegister from "@/pages/admin/Club-Register";
import RequireClubAdminAuth from "@/pages/admin/RequireClub-Admin-Auth";

import Index from "@/pages/Index";
import Players from "@/pages/Players";
import Transfers from "@/pages/Transfers";
import Matches from "@/pages/Matches";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

// Initialize the query client for React Query
const queryClient = new QueryClient();

// Main application component containing all routes
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
        {/* ToastProvider and all UI providers go here, inside the router context */}
        <Toaster />
        <Sonner />
        <Routes>
          {/* Root path -> Club Login */}
          <Route path="/" element={<ClubLogin />} />

          {/* Registration */}
          <Route path="/register" element={<ClubRegister />} />

          {/* Dashboard (protected by Club Admin auth) */}
          <Route
            path="/dashboard"
            element={
              <RequireClubAdminAuth>
                <Layout />
              </RequireClubAdminAuth>
            }
          >
            <Route index element={<Index />} />
            <Route path="players" element={<Players />} />
            <Route path="players/:playerId" element={<Players />} />
            <Route path="transfers" element={<Transfers />} />
            <Route path="matches" element={<Matches />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
