import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiFacebook, FiTwitter, FiPhone, FiChevronDown } from "react-icons/fi";

// --- Types ---
type SubItem = { label: string; to: string };
type SubCategory = { title: string; items: SubItem[] };

type Item = { 
    label: string; 
    to: string; 
    dropdown?: SubCategory[] 
};

// --- Data Configuration ---

// Define the Mega Menu content for "Teams"
const TEAMS_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "FAZ Teams",
        items: [
            { label: "Chipolopolo (Men)", to: "/teams/men" },
            { label: "Shepolopolo (Women)", to: "/teams/women" },
            { label: "Chipolopolo (U20)", to: "/teams/u20" },
            { label: "Shepolopolo (U20)", to: "/teams/u20" },
            { label: "Chipolopolo (U17)", to: "/teams/u17" },
            { label: "Shepolopolo (U17)", to: "/teams/u17" },
            { label: "Chipolopolo (U15)", to: "/teams/u15" },

        ]
    },
    {
        title: "Other Teams",
        items: [
          
            { label: "Futsal National Team", to: "/teams/futsal" },
            { label: "Legends / Masters", to: "/teams/legends" },
        ]
    }
];

// Define the Mega Menu content for "Fixtures"
const FIXTURES_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "Men's National Teams",
        items: [
            { label: "Senior Team (Chipolopolo)", to: "/fixtures/men-senior" },
            { label: "CHAN Squad", to: "/fixtures/men-chan" },
            { label: "U-23 Olympic Squad", to: "/fixtures/men-u23" },
            { label: "U-20 National Team", to: "/fixtures/men-u20" },
            { label: "U-17 National Team", to: "/fixtures/men-u17" },
        ]
    },
    {
        title: "Women's National Teams",
        items: [
            { label: "Senior Team (Copper Queens)", to: "/fixtures/women-senior" },
            { label: "U-20 Women's Team", to: "/fixtures/women-u20" },
            { label: "U-17 Women's Team", to: "/fixtures/women-u17" },
            { label: "COSAFA Tournaments", to: "/fixtures/cosafa" },
            { label: "International Friendlies", to: "/fixtures/friendlies" },
        ]
    }
];

// Define the Mega Menu content for "News"
const NEWS_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "News",
        items: [
            { label: "General News", to: "/news/general" },
            { label: "Men's Competitions", to: "/news/mens-competitions" },
            { label: "Women's Competitions", to: "/news/womens-competitions" },
            { label: "Youth Competitions", to: "/news/youth-competitions" },
        ]
    },
    {
        title: "Media",
        items: [
            { label: "Press Releases", to: "/news/press-releases" },
            { label: "Gallery", to: "/news/gallery" },
            { label: "Videos", to: "/news/videos" },
            { label: "Publications", to: "/news/publications" },
        ]
    }
];

// Define the Mega Menu content for "Competitions"
const COMPETITIONS_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "National Leagues",
        items: [
            { label: "MTN Super League", to: "/competitions/mtn-super-league" },
            { label: "National Division One", to: "/competitions/national-division-one" },
            { label: "Women's Super League", to: "/competitions/womens-super-league" },
        ]
    },
    {
        title: "Regional & Cups",
        items: [
            { label: "Provincial Division 1", to: "/competitions/provincial-div-1" },
            { label: "Provincial Division 2", to: "/competitions/provincial-div-2" },
            { label: "ABSA Cup", to: "/competitions/absa-cup" },
            { label: "Youth Leagues", to: "/competitions/youth-leagues" },
        ]
    }
];

// Define the Mega Menu content for "About"
const ABOUT_DROPDOWN_DATA: SubCategory[] = [
    {
        title: "About FAZ",
        items: [
            { label: "Introduction to FAZ", to: "/about/intro" },
            { label: "President's Corner", to: "/about/president" },
            { label: "Mission Statement", to: "/about/mission" },
            { label: "Executive Committee (NEC)", to: "/about/nec" },
            { label: "Secretariat", to: "/about/secretariat" },
        ]
    },
    {
        title: "Development",
        items: [
            { label: "Schools Football", to: "/about/schools" },
            { label: "Coaching Education", to: "/about/coaching" },
            { label: "Refereeing", to: "/about/refereeing" },
            { label: "Technical Centre", to: "/about/technical-centre" },
        ]
    }
];

// Updated Nav Items including the dropdown data
const NAV_ITEMS: Item[] = [
    { label: "Home", to: "/" },
    { label: "Teams", to: "/teams", dropdown: TEAMS_DROPDOWN_DATA },
    { label: "Fixtures", to: "/fixtures", dropdown: FIXTURES_DROPDOWN_DATA },
    { label: "Competitions", to: "/competitions", dropdown: COMPETITIONS_DROPDOWN_DATA },
    { label: "News", to: "/news", dropdown: NEWS_DROPDOWN_DATA },
    { label: "Statistics", to: "/statistics" },
    { label: "Injuries", to: "/injuries" },
    { label: "About", to: "/about", dropdown: ABOUT_DROPDOWN_DATA },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    // State to control which dropdown is currently open (stores label string or null)
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const location = useLocation();

    const CLUB_LOGO =
        "https://res.cloudinary.com/digaq48bp/image/upload/v1758265423/football-association-of-zambia-logo_oe9kyd.png";
    const SPONSOR_LOGO =
        "https://res.cloudinary.com/digaq48bp/image/upload/v1758266474/Zambia-Flag-Transparent-PNG_pjzyxr.png";

    const SOCIAL = {
        facebook: "https://facebook.com/yourpage",
        twitter: "https://twitter.com/yourhandle",
    };

    const CTA = { label: "CONTACT", to: "/contact", Icon: FiPhone };

    // Helper to check if a main category is active (including dropdown items)
    const isPathActive = (path: string, hasDropdown: boolean) => {
        if (path === "/" && location.pathname !== "/") return false;
        // If it has a dropdown, it's active if the path starts with the base path
        if (hasDropdown && location.pathname.startsWith(path)) return true;
        return location.pathname === path;
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-transparent">
            {/* ───────── Top strip ───────── */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-1">
                <div className="flex items-center gap-3">
                    <div className="flex-1 flex items-center gap-3">
                        {/* Left orange bar */}
                        <div className="flex-1 h-4 rounded-full bg-orange-500/90" />
                        {/* Right green socials bar */}
                        <div className="relative flex-1 h-4 rounded-full bg-green-600 shadow-inner">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                <a
                                    href={SOCIAL.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    title="Facebook"
                                    className="h-8 w-8 grid place-items-center rounded-full bg-white text-slate-700 text-base shadow ring-1 ring-black/5 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                >
                                    <FiFacebook />
                                </a>
                                <a
                                    href={SOCIAL.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Twitter"
                                    title="Twitter"
                                    className="h-8 w-8 grid place-items-center rounded-full bg-white text-slate-700 text-base shadow ring-1 ring-black/5 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                                >
                                    <FiTwitter />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block w-[64px]" />
                </div>
            </div>

            {/* ─────── Main row ─────── */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-2">
                <div className="flex items-center gap-2">
                    
                    {/* LOGO */}
                    <Link
                        to="/"
                        title="Home"
                        className="shrink-0 grid place-items-center h-20 w-20 md:h-20 md:w-20 lg:h-24 lg:w-24 -translate-x-2 md:-translate-x-8 lg:-translate-x-14 xl:-translate-x-16 z-20 relative"
                    >
                        <img src={CLUB_LOGO} alt="Club Logo" className="h-full w-full object-contain" />
                    </Link>

                    {/* NAV CONTAINER */}
                    {/* The Dropdown will position itself relative to THIS container 
                        because we remove 'relative' from the individual 'li' items.
                    */}
                    <div className="relative flex-1 z-10">
                        <div className="h-14 md:h-16 rounded-full bg-green-700 text-white shadow-md ring-1 ring-black/5">
                            <div className="flex items-center h-full">
                                
                                {/* Sponsor chip */}
                                <div className="hidden md:flex items-center gap-2 bg-white text-slate-800 rounded-l-full h-full pl-4 pr-5 border-r border-slate-200">
                                    <img
                                        src={SPONSOR_LOGO}
                                        alt="Official Sponsor"
                                        className="h-8 md:h-10 w-auto max-h-full object-contain"
                                        loading="eager"
                                    />
                                    <div className="leading-tight text-[11px] font-semibold opacity-80">
                                        FAZ
                                    </div>
                                </div>

                                {/* DESKTOP NAV LINKS */}
                                <ul className="hidden md:flex flex-1 items-center justify-center gap-1 lg:gap-4 h-full px-2">
                                    {NAV_ITEMS.map((it) => {
                                        const active = isPathActive(it.to, !!it.dropdown);
                                        const isOpen = activeDropdown === it.label;
                                        
                                        if (it.dropdown) {
                                            return (
                                                // 1. Add mouse handlers to control dropdown state
                                                <li 
                                                    key={it.to} 
                                                    className="h-full flex items-center"
                                                    onMouseEnter={() => setActiveDropdown(it.label)}
                                                    onMouseLeave={() => setActiveDropdown(null)}
                                                >
                                                    {/* Wrapper for the NavLink to handle local active indicator */}
                                                    <div className="relative flex items-center h-full">
                                                        <NavLink
                                                            to={it.to}
                                                            className={`
                                                                flex items-center gap-1 px-2 py-2 text-[10px] lg:text-[11px] font-bold tracking-[0.15em] uppercase transition
                                                                ${active || isOpen ? "text-white" : "text-slate-200/80 hover:text-white"}
                                                            `}
                                                        >
                                                            {it.label}
                                                            {/* Change icon rotation based on state */}
                                                            <FiChevronDown className={`${isOpen ? 'rotate-180' : ''} transition-transform duration-300`} />
                                                        </NavLink>
                                                        {/* Active Indicator Line for Parent */}
                                                        {active && (
                                                            <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 h-0.5 w-5 bg-orange-500 rounded-full" />
                                                        )}
                                                    </div>

                                                    {/* 2. Conditionally render the Mega Menu based on state */}
                                                    {isOpen && (
                                                        <div className="absolute top-full left-0 w-full pt-2 cursor-default z-30 animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-black/10 overflow-hidden min-h-[240px]">
                                                                
                                                                {/* Background Image (Watermark) */}
                                                                <div 
                                                                    className="absolute inset-0 z-0 pointer-events-none opacity-[0.07]"
                                                                    style={{
                                                                        backgroundImage: `url(${CLUB_LOGO})`,
                                                                        backgroundPosition: 'center',
                                                                        backgroundRepeat: 'no-repeat',
                                                                        backgroundSize: '40%' 
                                                                    }}
                                                                />

                                                                {/* Content Grid */}
                                                                <div className="relative z-10 grid grid-cols-2">
                                                                    {/* Left Column (Category 1) */}
                                                                    <div className="p-8">
                                                                        <h4 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                            {it.dropdown[0].title}
                                                                        </h4>
                                                                        <ul className="flex flex-col">
                                                                            {it.dropdown[0].items.map((sub) => (
                                                                                <li key={sub.to} className="border-b border-slate-100 last:border-0">
                                                                                    <Link 
                                                                                        to={sub.to}
                                                                                        className="block py-3 text-lg font-medium text-slate-700 hover:text-orange-500 transition-colors"
                                                                                        // Close dropdown when a sub-link is clicked
                                                                                        onClick={() => setActiveDropdown(null)}
                                                                                    >
                                                                                        {sub.label}
                                                                                    </Link>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>

                                                                    {/* Right Column (Category 2) */}
                                                                    <div className="p-8 bg-slate-50/60 border-l border-slate-100">
                                                                        <h4 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                                            {it.dropdown[1].title}
                                                                        </h4>
                                                                        <ul className="flex flex-col">
                                                                            {it.dropdown[1].items.map((sub) => (
                                                                                <li key={sub.to} className="border-b border-slate-200 last:border-0">
                                                                                    <Link 
                                                                                        to={sub.to}
                                                                                        className="block py-3 text-lg font-medium text-slate-600 hover:text-orange-500 transition-colors"
                                                                                        // Close dropdown when a sub-link is clicked
                                                                                        onClick={() => setActiveDropdown(null)}
                                                                                    >
                                                                                        {sub.label}
                                                                                    </Link>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        }

                                        // Standard Link
                                        return (
                                            <li key={it.to} className="h-full flex items-center relative">
                                                <NavLink
                                                    to={it.to}
                                                    className={`
                                                        px-2 py-2 text-[10px] lg:text-[11px] font-bold tracking-[0.15em] uppercase transition block
                                                        ${active ? "text-white" : "text-slate-200/80 hover:text-white"}
                                                    `}
                                                >
                                                    {it.label}
                                                </NavLink>
                                                {active && (
                                                    <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 h-0.5 w-5 bg-orange-500 rounded-full" />
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* Mobile toggle */}
                                <button
                                    className="md:hidden ml-auto mr-3 my-1.5 h-10 w-10 grid place-items-center rounded-full bg-white text-slate-800 shadow-sm"
                                    onClick={() => setOpen((v) => !v)}
                                    aria-label="Toggle menu"
                                >
                                    {open ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Drawer */}
                        {open && (
                            <div className="absolute left-0 right-0 top-full mt-2 z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="rounded-2xl bg-green-800 text-white shadow-2xl ring-1 ring-black/20 overflow-hidden border border-green-600/50">
                                    <ul className="flex flex-col divide-y divide-white/10 max-h-[80vh] overflow-y-auto">
                                        {NAV_ITEMS.map((it) => (
                                            <li key={it.to}>
                                                {it.dropdown ? (
                                                    // NOTE: A more complete implementation would make the mobile dropdown accordion collapsible
                                                    <div className="flex flex-col">
                                                        {/* Mobile Accordion Header */}
                                                        <div className="px-5 py-3 text-[13px] uppercase tracking-wide font-bold bg-green-900/40 text-green-100">
                                                            {it.label}
                                                        </div>
                                                        {/* Mobile Accordion Items */}
                                                        {it.dropdown.map(category => (
                                                               <div key={category.title} className="bg-green-800/50 pb-2">
                                                                    <div className="px-5 py-2 text-[10px] text-green-300 uppercase font-bold tracking-widest opacity-70">
                                                                        {category.title}
                                                                    </div>
                                                                    {category.items.map(sub => (
                                                                        <Link 
                                                                            key={sub.to}
                                                                            to={sub.to}
                                                                            onClick={() => setOpen(false)}
                                                                            className="block px-8 py-2 text-sm text-slate-100 hover:bg-green-700/50 border-l-2 border-transparent hover:border-orange-500 transition-colors"
                                                                        >
                                                                            {sub.label}
                                                                        </Link>
                                                                    ))}
                                                               </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <NavLink
                                                        to={it.to}
                                                        onClick={() => setOpen(false)}
                                                        className={({ isActive }) =>
                                                            [
                                                                "block px-5 py-3.5 text-[13px] uppercase tracking-wide font-medium",
                                                                isActive ? "bg-green-600/60 text-white border-l-4 border-orange-500" : "hover:bg-green-700/50 text-slate-100",
                                                            ].join(" ")
                                                        }
                                                    >
                                                        {it.label}
                                                    </NavLink>
                                                )}
                                            </li>
                                        ))}
                                        <li className="p-4 bg-green-900/20">
                                            <Link
                                                to={CTA.to}
                                                onClick={() => setOpen(false)}
                                                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-3.5 py-3 text-sm font-bold text-slate-900 hover:bg-orange-400 shadow-lg transition"
                                            >
                                                <FiPhone className="h-4 w-4" />
                                                <span>{CTA.label}</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CONTACT Circle Desktop */}
                    <Link
                        to={CTA.to}
                        className="hidden md:grid shrink-0 h-14 w-14 place-items-center rounded-full bg-orange-500 text-slate-900 font-extrabold tracking-wider shadow-md ring-1 ring-black/10 hover:bg-orange-400 hover:scale-105 transition md:translate-x-10 lg:translate-x-16 xl:translate-x-20 z-10"
                        title={CTA.label}
                    >
                        <span className="text-[9px] leading-none">{CTA.label}</span>
                    </Link>

                </div>
            </div>
        </header>
    );
}