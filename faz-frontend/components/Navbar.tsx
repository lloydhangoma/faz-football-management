
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown,
  Phone,
  ShoppingBag,
  User,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from "lucide-react";

// --- Types ---
type SubItem = { label: string; to: string };
type SubCategory = { title: string; items: SubItem[] };

type Item = { 
    label: string; 
    to: string; 
    dropdown?: SubCategory[];
    isExternal?: boolean;
};

// --- Data Configuration ---
const ABOUT_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "About FAZ",
        items: [
            { label: "Introduction", to: "/about/intro" },
            { label: "President's Corner", to: "/about/president" },
            { label: "Mission Statement", to: "/about/mission" },
            { label: "Secretariat", to: "/about/secretariat" },
        ]
    }
];

const TEAMS_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "National Teams",
        items: [
            { label: "Chipolopolo (Men)", to: "/teams/men" },
            { label: "Shepolopolo (Women)", to: "/teams/women" },
            { label: "U20 Teams", to: "/teams/u20" },
        ]
    }
];

const FIXTURES_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "Matches",
        items: [
            { label: "Senior Team", to: "/fixtures/senior" },
            { label: "Youth Team", to: "/fixtures/youth" },
            { label: "League Fixtures", to: "/fixtures/league" },
        ]
    }
];

const COMPETITIONS_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "Leagues",
        items: [
            { label: "MTN Super League", to: "/competitions/mtn-super-league" },
            { label: "National Div One", to: "/competitions/national-division-one" },
        ]
    }
];

const NEWS_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "Latest News",
        items: [
            { label: "General News", to: "/news/general" },
            { label: "Press Releases", to: "/news/press" },
            { label: "Media Gallery", to: "/news/gallery" },
        ]
    }
];

const NAV_ITEMS: Item[] = [
    { label: "HOME", to: "/" },
    { label: "ABOUT", to: "/about", dropdown: ABOUT_DROPDOWN_DATA },
    { label: "TEAMS", to: "/teams", dropdown: TEAMS_DROPDOWN_DATA },
    { label: "FIXTURES", to: "/fixtures", dropdown: FIXTURES_DROPDOWN_DATA },
    { label: "COMPETITIONS", to: "/competitions", dropdown: COMPETITIONS_DROPDOWN_DATA },
    { label: "NEWS", to: "/news", dropdown: NEWS_DROPDOWN_DATA },
    { label: "LEGENDS", to: "/legends" },
    { label: "CONTACT", to: "/contact" },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const location = useLocation();

    // Specific Brand Green from the screenshot
    const BRAND_GREEN = "#005A2B";
    // Using a more reliable thumbnail URL to avoid hotlinking blocks
    const CLUB_LOGO = "https://res.cloudinary.com/digaq48bp/image/upload/v1758265423/football-association-of-zambia-logo_oe9kyd.png";

    return (
        <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
            {/* ───────── HEADER WRAPPER ───────── */}
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-stretch min-h-[80px]">
                
                {/* 1. BRAND LOGO BLOCK WITH SLANT (Like Indian Football Federation) */}
                <div 
                    className="hidden md:flex md:w-auto shrink-0 items-center text-white relative -mr-12"
                    style={{ backgroundColor: BRAND_GREEN, skewX: '-20deg', paddingRight: '60px' }}
                >
                    <Link to="/" className="flex items-center gap-5 group" style={{ skewX: '20deg' }}>
                        {/* Square Frame for the crest */}
                        <div className="border-[1.5px] border-white/80 p-1 bg-transparent shrink-0">
                            <img 
                                src={CLUB_LOGO} 
                                alt="FAZ" 
                                className="h-10 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform" 
                                onError={(e) => {
                                  // Fallback if image fails to load
                                  e.currentTarget.src = 'https://via.placeholder.com/100?text=FAZ';
                                }}
                            />
                        </div>
                        {/* Stacked Text Layout */}
                        <div className="flex flex-col leading-[0.85] font-condensed">
                            <span className="text-[20px] md:text-[28px] font-black uppercase tracking-tight text-white">FOOTBALL</span>
                            <span className="text-[20px] md:text-[28px] font-black uppercase tracking-tight text-white">ASSOCIATION</span>
                            <span className="text-[14px] md:text-[18px] font-bold uppercase tracking-[0.05em] text-white/60 mt-1">OF ZAMBIA</span>
                        </div>
                    </Link>
                </div>

                {/* Mobile Logo */}
                <div className="md:hidden w-full flex items-center px-6 py-4 text-white" style={{ backgroundColor: BRAND_GREEN }}>
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="border-[1.5px] border-white/80 p-1 bg-transparent shrink-0">
                            <img 
                                src={CLUB_LOGO} 
                                alt="FAZ" 
                                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform" 
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/100?text=FAZ';
                                }}
                            />
                        </div>
                        <div className="flex flex-col leading-[0.8]">
                            <span className="text-[16px] font-black uppercase tracking-tight">FOOTBALL</span>
                            <span className="text-[12px] font-bold uppercase tracking-[0.05em] text-white/60">OF ZAMBIA</span>
                        </div>
                    </Link>
                </div>

                {/* 2. WHITE CONTENT AREA */}
                <div className="flex-1 bg-white flex flex-col relative">
                    
                    {/* Top Utility Layer */}
                    <div className="hidden lg:flex h-10 border-b border-gray-100 items-center justify-end px-12 gap-6 text-[11px] font-bold text-slate-500 tracking-wider">
                        <div className="flex items-center gap-4 border-r border-gray-200 pr-6 h-full">
                            <Facebook className="w-3.5 h-3.5 cursor-pointer hover:text-faz-green transition" />
                            <Twitter className="w-3.5 h-3.5 cursor-pointer hover:text-faz-green transition" />
                            <Instagram className="w-3.5 h-3.5 cursor-pointer hover:text-faz-green transition" />
                            <Youtube className="w-3.5 h-3.5 cursor-pointer hover:text-faz-green transition" />
                        </div>
                        <Link to="/shop" className="flex items-center gap-1.5 hover:text-faz-green transition">
                            <ShoppingBag className="w-3.5 h-3.5" /> SHOP
                        </Link>
                        <span className="opacity-30">|</span>
                        <Link to="/login" className="flex items-center gap-1.5 hover:text-faz-green transition">
                            <User className="w-3.5 h-3.5" /> LOGIN
                        </Link>
                    </div>

                    {/* Navigation Bar Area */}
                    <div className="flex-1 flex items-stretch px-4 lg:px-8">
                        <nav className="hidden lg:flex items-stretch flex-1">
                            <ul className="flex items-stretch">
                                {NAV_ITEMS.map((item, index) => {
                                    const isOpen = activeDropdown === item.label;
                                    const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

                                    return (
                                        <li 
                                            key={item.label}
                                            className="relative flex items-stretch"
                                            onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            {index > 0 && (
                                                <div className="w-[1px] h-full bg-gray-100 -skew-x-[20deg] mx-1" />
                                            )}

                                            <NavLink 
                                                to={item.to}
                                                className={`px-4 xl:px-6 flex items-center gap-1 text-[13px] font-extrabold tracking-[0.1em] transition-all relative
                                                    ${isActive ? 'text-faz-green' : 'text-slate-800 hover:text-faz-green'}
                                                `}
                                            >
                                                {item.label}
                                                {item.dropdown && <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />}
                                                {isActive && (
                                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-faz-orange" />
                                                )}
                                            </NavLink>

                                            {item.dropdown && isOpen && (
                                                <div className="absolute top-full left-0 w-max min-w-[240px] bg-white border border-gray-100 shadow-xl animate-in fade-in duration-150 z-[100]">
                                                    <div className="p-4 space-y-4">
                                                        {item.dropdown.map(cat => (
                                                            <div key={cat.title}>
                                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-4">{cat.title}</h4>
                                                                <ul className="space-y-1">
                                                                    {cat.items.map(sub => (
                                                                        <li key={sub.to}>
                                                                            <Link 
                                                                                to={sub.to} 
                                                                                className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-gray-50 hover:text-faz-green transition"
                                                                                onClick={() => setActiveDropdown(null)}
                                                                            >
                                                                                {sub.label}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        <div className="flex items-center gap-4 lg:gap-6 ml-auto">
                            <button className="text-slate-800 hover:text-faz-green transition p-2">
                                <Search className="w-6 h-6" />
                            </button>
                            <Link 
                                to="/contact" 
                                className="hidden md:flex items-center gap-2 bg-faz-orange text-white px-6 py-3 font-black text-xs uppercase tracking-widest hover:brightness-110 transition shadow-sm rounded-sm"
                            >
                                <Phone className="w-3.5 h-3.5" /> CONTACT
                            </Link>
                            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-slate-800">
                                {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE NAV DRAWER */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 top-[80px] bg-white z-[100] border-t border-gray-100 overflow-y-auto animate-in slide-in-from-right duration-300">
                    <div className="flex flex-col p-6 space-y-4 pb-20">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label} className="border-b border-gray-50 pb-4">
                                <NavLink 
                                    to={item.to} 
                                    onClick={() => !item.dropdown && setMobileOpen(false)}
                                    className={({ isActive }) => `text-xl font-black uppercase tracking-tight block py-2 ${isActive ? 'text-faz-green' : 'text-slate-800'}`}
                                >
                                    {item.label}
                                </NavLink>
                                {item.dropdown && (
                                    <div className="mt-4 pl-4 grid grid-cols-1 gap-4">
                                        {item.dropdown.map(cat => (
                                            <div key={cat.title}>
                                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">{cat.title}</p>
                                                <ul className="space-y-3">
                                                    {cat.items.map(sub => (
                                                        <li key={sub.to}>
                                                            <Link to={sub.to} onClick={() => setMobileOpen(false)} className="text-sm font-bold text-slate-500">{sub.label}</Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
