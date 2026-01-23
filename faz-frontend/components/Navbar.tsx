import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { 
  Menu, 
  X as CloseIcon, 
  ChevronDown,
  // User, // Removed User import as it is no longer used
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Search,
  ShoppingCart
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
    { label: "NEWS", to: "/news", dropdown: NEWS_DROPDOWN_DATA },
    { label: "LEGENDS", to: "/legends" },
    { label: "CONTACT", to: "/contact" },
    { label: "MYFAZSHOP", to: "https://faz-market.online/", isExternal: true },
];

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const location = useLocation();

    const BRAND_GREEN = "#005A2B";
    const CLUB_LOGO = "https://res.cloudinary.com/digaq48bp/image/upload/v1758265423/football-association-of-zambia-logo_oe9kyd.png";

    // Modern "X" logo implementation
    const XIcon = () => (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
    );

    return (
        <header className="w-full sticky top-0 z-50 bg-white shadow-sm overflow-visible">
            {/* FIX: Changed 'max-w-[1440px] mx-auto' to 'w-full'.
               This removes the centering constraint so the logo hits the left edge.
            */}
            <div className="w-full flex flex-col md:flex-row items-stretch min-h-[80px]">
                
                {/* 1. BRAND LOGO BLOCK */}
                <div 
                    className="hidden md:flex md:w-auto shrink-0 items-center text-white pr-8 relative z-20"
                    style={{ backgroundColor: BRAND_GREEN }}
                >
                    {/* --- THE RIGHT SLANT WING --- */}
                    <div 
                        className="absolute top-0 bottom-0 right-[-15px] w-[30px] z-[-1]"
                        style={{ backgroundColor: BRAND_GREEN, transform: 'skewX(-20deg)' }}
                    />
                    
                    {/* Content */}
                    {/* Added pl-6 here so the text doesn't touch the screen edge, but the green background does */}
                    <Link to="/" className="flex items-center gap-5 group relative z-10 pl-6">
                        <div className="border-[1.5px] border-white/80 p-1 bg-transparent shrink-0">
                            <img 
                                src={CLUB_LOGO} 
                                alt="FAZ" 
                                className="h-10 md:h-14 w-auto object-contain" 
                            />
                        </div>
                        <div className="flex flex-col leading-[0.85] font-condensed">
                            <span className="text-[20px] md:text-[28px] font-black uppercase tracking-tight">FOOTBALL</span>
                            <span className="text-[20px] md:text-[28px] font-black uppercase tracking-tight">ASSOCIATION</span>
                            <span className="text-[14px] md:text-[18px] font-bold uppercase tracking-[0.05em] text-white/60 mt-1">OF ZAMBIA</span>
                        </div>
                    </Link>
                </div>

                {/* Mobile Logo */}
                <div className="md:hidden w-full flex items-center px-6 py-4 text-white" style={{ backgroundColor: BRAND_GREEN }}>
                    <Link to="/" className="flex items-center gap-3">
                        <img src={CLUB_LOGO} alt="FAZ" className="h-8 w-auto" />
                        <div className="flex flex-col leading-[0.8]">
                            <span className="text-[16px] font-black uppercase">FOOTBALL</span>
                            <span className="text-[12px] font-bold text-white/60">OF ZAMBIA</span>
                        </div>
                    </Link>
                </div>

                {/* 2. CONTENT AREA */}
                <div className="flex-1 bg-white flex flex-col relative">
                    
                    {/* Top Utility Layer */}
                    <div className="hidden lg:flex h-10 border-b border-gray-100 items-center justify-end px-12 gap-6 text-[11px] font-bold text-slate-500 tracking-wider">
                        <div className="flex items-center gap-4 border-r border-gray-200 pr-6 h-full">
                            <Facebook className="w-3.5 h-3.5 cursor-pointer hover:text-[#005A2B]" />
                            <Instagram className="w-3.5 h-3.5 cursor-pointer hover:text-[#005A2B]" />
                            <XIcon />
                            <Youtube className="w-3.5 h-3.5 cursor-pointer hover:text-[#005A2B]" />
                            <Linkedin className="w-3.5 h-3.5 cursor-pointer hover:text-[#005A2B]" />
                        </div>
                        <a href="https://faz-market.online/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#005A2B] transition uppercase">
                            <ShoppingCart className="w-3.5 h-3.5" /> MYFAZSHOP
                        </a>
                        {/* Login Removed */}
                    </div>

                    {/* Desktop Navigation Area */}
                    <div className="flex-1 flex items-stretch px-4 lg:px-8 pl-10">
                        <nav className="flex items-stretch flex-1">
                            <ul className="flex items-stretch">
                                {NAV_ITEMS.map((item, index) => {
                                    const isOpen = activeDropdown === item.label;
                                    const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);

                                    return (
                                        <li 
                                            key={item.label}
                                            className="relative hidden lg:flex items-stretch"
                                            onMouseEnter={() => item.dropdown && setActiveDropdown(item.label)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            {index > 0 && <div className="w-[1px] h-full bg-gray-100 -skew-x-[20deg] mx-1" />}
                                            <NavLink 
                                                to={item.to}
                                                className={`px-4 xl:px-6 flex items-center gap-1 text-[13px] font-extrabold tracking-[0.1em] transition-all relative
                                                    ${isActive ? 'text-[#005A2B]' : 'text-slate-800 hover:text-[#005A2B]'}
                                                `}
                                            >
                                                {item.label}
                                                {item.dropdown && <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
                                                {isActive && <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange-500" />}
                                            </NavLink>

                                            {item.dropdown && isOpen && (
                                                <div className="absolute top-full left-0 w-max min-w-[240px] bg-white border border-gray-100 shadow-xl z-[100]">
                                                    <div className="p-4 space-y-4">
                                                        {item.dropdown.map(cat => (
                                                            <div key={cat.title}>
                                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-4">{cat.title}</h4>
                                                                <ul className="space-y-1">
                                                                    {cat.items.map(sub => (
                                                                        <li key={sub.to}>
                                                                            <Link to={sub.to} className="block px-4 py-2 text-sm font-bold text-slate-700 hover:bg-gray-50 hover:text-[#005A2B]" onClick={() => setActiveDropdown(null)}>
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

                        <div className="hidden lg:flex items-center ml-4 px-4 border-l border-gray-100">
                             <Search className="w-5 h-5 text-slate-800 cursor-pointer hover:text-[#005A2B] transition" />
                        </div>

                        <div className="flex items-center ml-auto lg:hidden">
                            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-slate-800">
                                {mobileOpen ? <CloseIcon size={28} /> : <Menu size={28} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-x-0 top-[80px] bottom-0 bg-white z-[100] overflow-y-auto border-t">
                    <div className="flex flex-col p-6 space-y-4 pb-20">
                        {NAV_ITEMS.map((item) => (
                            <div key={item.label} className="border-b border-gray-50 pb-4">
                                <NavLink to={item.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => `text-xl font-black uppercase block py-2 ${isActive ? 'text-[#005A2B]' : 'text-slate-800'}`}>
                                    {item.label}
                                </NavLink>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}