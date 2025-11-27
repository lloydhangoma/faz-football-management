import React from "react";
import { QrCode, Star, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlayerIDCardProps {
  player: any;
  onAction: (player: any) => void;
}

const PlayerIDCard: React.FC<PlayerIDCardProps> = ({ player, onAction }) => {
  const clubName = player.club?.clubName || player.club?.name || "Free Agent";
  // Generate a pseudo-random ID based on player ID for the visual
  const regNumber = `FAZ-${player._id.substring(player._id.length - 6).toUpperCase()}`;
  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-col gap-3">
      {/* The Physical ID Card Look */}
      <div className="relative w-full aspect-[1.58/1] rounded-xl overflow-hidden shadow-xl border border-slate-200 bg-white group hover:scale-[1.02] transition-transform duration-300">
        
        {/* Header - Dark Blue */}
        <div className="h-[18%] bg-[#001e4d] flex items-center justify-between px-3 md:px-4 relative z-10">
          <h2 className="text-white font-bold text-[10px] md:text-xs tracking-tight">
            Football Association of Zambia
          </h2>
          <div className="flex flex-col items-end leading-none">
            <span className="text-[10px] font-black text-white">FAZ</span>
            <div className="flex h-1 gap-0.5 mt-0.5">
              <div className="w-1.5 bg-green-600"></div>
              <div className="w-1.5 bg-red-600"></div>
              <div className="w-1.5 bg-black"></div>
              <div className="w-1.5 bg-orange-500"></div>
            </div>
          </div>
        </div>

        {/* Subheader Strip */}
        <div className="h-[8%] bg-slate-100 border-b border-slate-200 flex items-center justify-center">
          <span className="text-[9px] md:text-[10px] font-bold text-slate-800 tracking-wider uppercase">
            FAZ Registered Player • 2024/2025
          </span>
        </div>

        {/* Body Content */}
        <div className="relative h-[54%] p-3 md:p-4 flex flex-row">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '8px 8px' }}>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none z-0">
             <Fingerprint size={120} />
          </div>

          {/* Left Side: Details */}
          <div className="w-[65%] flex flex-col justify-between relative z-10 pr-2">
            <div className="space-y-2">
              <div>
                <span className="block text-[9px] font-bold text-slate-900 uppercase">Name</span>
                <span className="block text-sm md:text-base font-bold text-slate-800 truncate leading-tight">
                  {player.name}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-1">
                 <div>
                    <span className="block text-[8px] font-bold text-slate-500 uppercase">Reg Number</span>
                    <span className="block text-[10px] md:text-xs font-mono font-medium text-slate-700">{regNumber}</span>
                 </div>
                 <div>
                    <span className="block text-[8px] font-bold text-slate-500 uppercase">DOB</span>
                    <span className="block text-[10px] md:text-xs font-medium text-slate-700">
                      {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : "N/A"}
                    </span>
                 </div>
              </div>

              <div>
                <span className="block text-[8px] font-bold text-slate-500 uppercase">Current Club</span>
                <span className="block text-[10px] md:text-xs font-bold text-[#001e4d] truncate">{clubName}</span>
              </div>
            </div>
          </div>

          {/* Right Side: Photo */}
          <div className="w-[35%] flex flex-col items-center justify-start pt-1 relative z-10">
            <div className="aspect-[3/4] w-full bg-slate-100 rounded border border-slate-300 overflow-hidden shadow-inner relative">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                   <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                     <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                   </svg>
                </div>
              )}
            </div>
            <div className="mt-2 w-full text-center">
              <div className="font-serif italic text-[10px] md:text-xs text-slate-600 -rotate-2 select-none">
                {player.name.split(' ')[0]}
              </div>
              <div className="border-t border-slate-300 w-full mt-0.5"></div>
              <div className="text-[7px] text-slate-400 uppercase tracking-tighter">Signature</div>
            </div>
          </div>
        </div>

        {/* Footer - Dark Blue */}
        <div className="h-[20%] bg-[#001e4d] flex items-center justify-between px-3 md:px-4 relative overflow-hidden">
          {/* Hologram Effect */}
          <div className="relative group/holo">
             <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-tr from-cyan-300 via-blue-400 to-purple-500 opacity-90 shadow-[0_0_15px_rgba(34,211,238,0.6)] flex items-center justify-center animate-pulse">
                <Star size={16} className="text-white fill-white" />
             </div>
             {/* Shine effect */}
             <div className="absolute inset-0 bg-white/30 rounded-full skew-x-12 translate-x-full animate-shimmer"></div>
          </div>

          {/* Center Text */}
          <div className="text-center">
             <div className="flex items-center justify-center gap-1 mb-0.5">
                <img src="https://flagcdn.com/w20/zm.png" alt="Zambia" className="h-2.5 w-4 object-cover rounded-[1px]" />
                <span className="text-[8px] text-slate-300 font-bold tracking-widest uppercase">Zambia</span>
             </div>
             <div className="text-[9px] font-mono text-cyan-400 tracking-wider">
               {currentDate}
             </div>
          </div>

          {/* QR Code */}
          <div className="bg-white p-0.5 rounded-sm">
             <QrCode size={32} className="text-black" />
          </div>
        </div>
      </div>

      {/* Action Button Below Card */}
      <Button 
        className="w-full bg-[#001e4d] hover:bg-[#002a6b] text-white shadow-md border-t-2 border-orange-500" 
        onClick={() => onAction(player)}
      >
        Make Transfer Offer
      </Button>
    </div>
  );
};

export default PlayerIDCard;
