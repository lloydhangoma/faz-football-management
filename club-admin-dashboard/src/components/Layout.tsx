import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile header with menu button */}
      <div className="md:hidden w-full bg-gray-900 text-white p-3 flex items-center justify-between fixed top-0 left-0 z-40">
        <div className="font-bold">Dashboard</div>
        <button onClick={() => setIsOpen((s) => !s)} aria-label="Toggle menu">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar: pass controlled state for mobile drawer behavior */}
      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Mobile overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col pt-16 md:pt-0">
        <Outlet />
      </div>
    </div>
  );
}