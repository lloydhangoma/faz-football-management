import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom"; // ← no BrowserRouter here

import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthPage from "@/pages/AuthPage";
import Index from "@/pages/Index";
import Players from "@/pages/Players";
import Transfers from "@/pages/Transfers";
import Matches from "@/pages/Matches";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* Router is provided in src/main.tsx with basename="/club" */}
      <Routes>
        {/* with basename '/club', this renders at /club/ */}
        <Route path="/" element={<AuthPage />} />

        {/* use relative paths under the dashboard tree */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
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

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
