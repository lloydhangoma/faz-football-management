import { Link, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 border-r border-gray-800">
        <nav>
          <ul className="space-y-4">
            <li><Link to="/dashboard/players" className="hover:text-primary">Players</Link></li>
            <li><Link to="/dashboard/matches" className="hover:text-primary">Matches</Link></li>
            <li><Link to="/dashboard/reports" className="hover:text-primary">Reports</Link></li>
            <li><Link to="/dashboard/transfers" className="hover:text-primary">Transfers</Link></li>
            <li><Link to="/dashboard/settings" className="hover:text-primary">Settings</Link></li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 bg-gray-950 p-8">
        <Outlet />
      </main>
    </div>
  );
}
