// 📁 src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Clubs from "./pages/Clubs";
import ClubApplications from "./pages/ClubApplications";
import Transfers from "./pages/Transfers";
import Bans from "./pages/Bans";
import SimplePage from "./pages/SimplePage";
import NotFound from "./pages/NotFound";

import UserManagement from "./components/pages/UserManagement";
import AuditLogs from "./components/pages/AuditLogs";
import SystemSettings from "./components/pages/SystemSettings";
import SeasonsWindows from "./components/pages/SeasonsWindows";
import ComplianceMonitor from "./components/pages/ComplianceMonitor";

import { Shield, Calendar, BarChart3, Archive, UserCheck, Database, Settings } from "lucide-react";

// 🔐 Admin auth + login (from src/pages/admin)
import RequireAdminAuth from "@/pages/admin/RequireAdminAuth";
import AdminLogin from "@/pages/admin/AdminLogin";

const queryClient = new QueryClient();

const App = (): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public: Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* Backward-compat: old URL → new login */}
          <Route path="/pandora-secure-admin" element={<Navigate to="/admin/login" replace />} />

          {/* Protected: everything under Layout */}
          <Route
            path="/"
            element={
              <RequireAdminAuth>
                <Layout />
              </RequireAdminAuth>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="club-applications" element={<ClubApplications />} />
            <Route path="transfers" element={<Transfers />} />
            <Route path="bans" element={<Bans />} />

            <Route
              path="compliance"
              element={
                <ComplianceMonitor
                  title="Compliance Monitor"
                  description="Monitor compliance requirements and regulatory adherence across all clubs and players"
                  icon={Shield}
                />
              }
            />
            <Route
              path="seasons"
              element={
                <SeasonsWindows
                  title="Seasons & Windows"
                  description="Manage football seasons, transfer windows, and registration periods"
                  icon={Calendar}
                />
              }
            />
            <Route
              path="reports"
              element={
                <SimplePage
                  title="Reports & Analytics"
                  description="Generate detailed reports and analytics on player transfers, club performance, and league statistics"
                  icon={BarChart3}
                />
              }
            />
            <Route
              path="audit"
              element={
                <AuditLogs
                  title="Audit Log"
                  description="View detailed audit trails of all system activities and administrative actions"
                  icon={Archive}
                />
              }
            />
            <Route
              path="users"
              element={
                <UserManagement
                  title="User Management"
                  description="Manage system users, roles, and permissions for football administration staff"
                  icon={UserCheck}
                />
              }
            />
            <Route
              path="import"
              element={
                <SimplePage
                  title="Data Importer"
                  description="Import bulk data for players, clubs, and match records from external sources"
                  icon={Database}
                />
              }
            />
            <Route
              path="settings"
              element={
                <SystemSettings
                  title="System Settings"
                  description="Configure system-wide settings, preferences, and administrative parameters"
                  icon={Settings}
                />
              }
            />
          </Route>

          {/* Fallback (can be public) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
