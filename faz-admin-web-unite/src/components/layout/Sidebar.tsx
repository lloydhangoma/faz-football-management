// 📁 src/components/layout/Sidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileCheck,
  BarChart3,
  Settings,
  UserCheck,
  ArrowRightLeft,
  Shield,
  Calendar,
  Archive,
  Database,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

// Cloudinary FAZ logo (replace anytime)
const LOGO_URL =
  "https://res.cloudinary.com/digaq48bp/image/upload/v1758265423/football-association-of-zambia-logo_oe9kyd.png";

const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    id: "club-management",
    label: "CLUB MANAGEMENT",
    items: [
      { label: "Club Directory", icon: Building2, path: "/clubs" },
      { label: "Club Applications", icon: FileCheck, path: "/club-applications", badge: "5" },
    ],
  },
  {
    id: "player-management",
    label: "PLAYER MANAGEMENT",
    items: [
      { label: "Transfers", icon: ArrowRightLeft, path: "/transfers", badge: "12" },
      { label: "Bans & Sanctions", icon: Shield, path: "/bans", badge: "8" },
    ],
  },
  {
    id: "compliance",
    label: "COMPLIANCE",
    items: [
      { label: "Compliance Monitor", icon: Shield, path: "/compliance" },
      { label: "Seasons & Windows", icon: Calendar, path: "/seasons" },
    ],
  },
  {
    id: "analytics",
    label: "ANALYTICS",
    items: [
      { label: "Reports & Analytics", icon: BarChart3, path: "/reports" },
      { label: "Audit Log", icon: Archive, path: "/audit" },
    ],
  },
  {
    id: "system",
    label: "SYSTEM",
    items: [
      { label: "User Management", icon: UserCheck, path: "/users" },
      { label: "Data Importer", icon: Database, path: "/import" },
      { label: "System Settings", icon: Settings, path: "/settings" },
    ],
  },
];

export default function Sidebar(): JSX.Element {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "club-management",
    "player-management",
    "compliance",
    "analytics",
    "system",
  ]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
 <div className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Header with FAZ logo + title */}
      <div className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={LOGO_URL}
            alt="Football Association of Zambia"
            className="h-14 md:h-16 w-auto object-contain"
            loading="eager"
          />
          <span className="text-sidebar-foreground text-sm font-semibold leading-tight">
            Football Association of Zambia
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          if (item.path) {
            // Single menu item
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          }

          // Section with sub-items
          const isExpanded = expandedSections.includes(item.id);
          return (
            <div key={item.id}>
              <button
                onClick={() => toggleSection(item.id)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider hover:text-sidebar-foreground transition-colors"
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "w-3 h-3 transition-transform",
                    isExpanded ? "rotate-180" : ""
                  )}
                />
              </button>
              {isExpanded && (
                <div className="ml-2 space-y-1">
                  {item.items?.map((subItem) => {
                    const isActive = location.pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors relative",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <subItem.icon className="w-4 h-4" />
                        {subItem.label}
                        {subItem.badge && (
                          <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-1.5 py-0.5 rounded-full">
                            {subItem.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
