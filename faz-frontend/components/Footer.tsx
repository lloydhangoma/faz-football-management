import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const CLUB_LOGO = "https://res.cloudinary.com/digaq48bp/image/upload/v1758265423/football-association-of-zambia-logo_oe9kyd.png";

  return (
    <footer className="relative overflow-hidden bg-green-900 text-white/90 pt-20 pb-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-[360px] bg-no-repeat bg-right-bottom opacity-[0.07]"
        style={{ backgroundImage: `url(${CLUB_LOGO})`, backgroundSize: "280px" }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={CLUB_LOGO} 
                alt="FAZ" 
                className="w-16 h-16 object-contain opacity-95 hover:opacity-100 transition"
              />
              <div className="leading-tight">
                <span className="block text-white font-condensed text-xl uppercase tracking-tighter">Football Association</span>
                <span className="block text-orange-400 font-condensed text-lg uppercase tracking-tighter">of Zambia</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-green-50">
              Advancing Zambian football through professionalism, transparency, and innovation. From grassroots to the global stage.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full hover:bg-orange-500 hover:text-white transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full hover:bg-orange-500 hover:text-white transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full hover:bg-orange-500 hover:text-white transition"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/10 flex items-center justify-center rounded-full hover:bg-orange-500 hover:text-white transition"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest border-l-2 border-orange-500 pl-3">Association</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-orange-400 transition">Executive Committee</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">General Secretary's Office</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">Constitutions & Regulations</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">Electoral Committee</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">Judicial Bodies</Link></li>
            </ul>
          </div>

          {/* Competitions */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest border-l-2 border-orange-500 pl-3">Competitions</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-orange-400 transition">MTN Super League</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">National Division One</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">Women's Super League</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">ABSA Cup</Link></li>
              <li><Link to="#" className="hover:text-orange-400 transition">Regional Leagues</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest border-l-2 border-orange-500 pl-3">Head Office</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-green-50">Football House, Alick Nkhata Road, Lusaka, Zambia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-green-50">+260 211 251 251</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <span className="text-green-50">info@footballzambia.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-green-100">
          <p>© {new Date().getFullYear()} Football Association of Zambia. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-orange-400 transition">Privacy Policy</Link>
            <Link to="#" className="hover:text-orange-400 transition">Terms of Service</Link>
            <Link to="#" className="hover:text-orange-400 transition">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
