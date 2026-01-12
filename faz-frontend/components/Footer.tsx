
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const CLUB_LOGO = "https://upload.wikimedia.org/wikipedia/en/0/06/Football_Association_of_Zambia_logo.png";

  return (
    <footer className="bg-[#0b0c0d] text-gray-400 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={CLUB_LOGO} 
                alt="FAZ" 
                className="w-16 h-16 brightness-110 grayscale hover:grayscale-0 transition"
              />
              <div className="leading-tight">
                <span className="block text-white font-condensed text-xl uppercase tracking-tighter">Football Association</span>
                <span className="block text-faz-orange font-condensed text-lg uppercase tracking-tighter">of Zambia</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Advancing Zambian football through professionalism, transparency, and innovation. From grassroots to the global stage.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-faz-orange hover:text-faz-green transition"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-faz-orange hover:text-faz-green transition"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-faz-orange hover:text-faz-green transition"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-full hover:bg-faz-orange hover:text-faz-green transition"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest border-l-2 border-faz-orange pl-3">Association</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-white transition">Executive Committee</Link></li>
              <li><Link to="#" className="hover:text-white transition">General Secretary's Office</Link></li>
              <li><Link to="#" className="hover:text-white transition">Constitutions & Regulations</Link></li>
              <li><Link to="#" className="hover:text-white transition">Electoral Committee</Link></li>
              <li><Link to="#" className="hover:text-white transition">Judicial Bodies</Link></li>
            </ul>
          </div>

          {/* Competitions */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest border-l-2 border-faz-orange pl-3">Competitions</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-white transition">MTN Super League</Link></li>
              <li><Link to="#" className="hover:text-white transition">National Division One</Link></li>
              <li><Link to="#" className="hover:text-white transition">Women's Super League</Link></li>
              <li><Link to="#" className="hover:text-white transition">ABSACup</Link></li>
              <li><Link to="#" className="hover:text-white transition">Regional Leagues</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold uppercase text-xs tracking-widest border-l-2 border-faz-orange pl-3">Head Office</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-faz-orange flex-shrink-0" />
                <span>Football House, Alick Nkhata Road, Lusaka, Zambia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-faz-orange flex-shrink-0" />
                <span>+260 211 251 251</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-faz-orange flex-shrink-0" />
                <span>info@footballzambia.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Football Association of Zambia. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link to="#" className="hover:text-white">Privacy Policy</Link>
            <Link to="#" className="hover:text-white">Terms of Service</Link>
            <Link to="#" className="hover:text-white">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
