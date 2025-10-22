import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Menu Button and Header */}
      <div className="md:hidden p-4 bg-gray-900 text-white flex justify-between items-center">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-64 bg-gray-900 text-white p-6 border-r border-gray-800 md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/dashboard/players" className="hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                Players
              </Link>
            </li>
            <li>
              <Link to="/dashboard/matches" className="hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                Matches
              </Link>
            </li>
            <li>
              <Link to="/dashboard/reports" className="hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                Reports
              </Link>
            </li>
            <li>
              <Link to="/dashboard/transfers" className="hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                Transfers
              </Link>
            </li>
            <li>
              <Link to="/dashboard/settings" className="hover:text-primary" onClick={() => setIsSidebarOpen(false)}>
                Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* New: Overlay for Mobile */}
      {/* This semi-transparent div appears only when the sidebar is open on small screens */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 bg-gray-950 p-8 pt-20 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
}