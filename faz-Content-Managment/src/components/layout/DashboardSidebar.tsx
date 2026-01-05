import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Users,
  Calendar,
  Trophy,
  Info,
  Star,
  ShoppingBag,
  Phone,
  Settings,
  LogOut,
} from "lucide-react";
import fazLogo from "@/assets/faz-logo.png";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "About FAZ", icon: Info, path: "/about" },
  { label: "Teams", icon: Users, path: "/teams" },
  { label: "Fixtures", icon: Calendar, path: "/fixtures" },
  { label: "Competitions", icon: Trophy, path: "/competitions" },
  { label: "News", icon: Newspaper, path: "/news" },
  { label: "Legends Corner", icon: Star, path: "/legends" },
  { label: "MyFAZShop", icon: ShoppingBag, path: "/shop" },
  { label: "Contact", icon: Phone, path: "/contact" },
];

const DashboardSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-20 items-center gap-3 border-b border-sidebar-border px-6">
          <img src={fazLogo} alt="FAZ Logo" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="font-display text-lg font-bold text-sidebar-foreground">FAZ Frontend</h1>
            <p className="text-xs text-sidebar-foreground/60">Content Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Link to="/settings" className="sidebar-link">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
          <Link to="/auth" className="sidebar-link w-full text-left hover:bg-destructive/20 hover:text-destructive">
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
