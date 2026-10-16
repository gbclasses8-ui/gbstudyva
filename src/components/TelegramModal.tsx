import React from 'react';
import { Send, X, Bell, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';
import { BRAND_CONFIG } from '../data/batches';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleJoin = () => {
    window.open(BRAND_CONFIG.telegramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-3xl overflow-hidden bg-[#150a1e] border-2 border-pink-500/30 shadow-[0_20px_60px_rgba(236,72,153,0.35)] z-10 animate-scaleUp">
        {/* Glow header banner */}
        <div className="relative h-28 bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-pink-300" />
            Official Community
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 pt-0 text-center relative">
          {/* Centered Brand Icon overlapping header */}
          <div className="w-20 h-20 mx-auto -mt-10 rounded-2xl overflow-hidden border-4 border-[#150a1e] shadow-xl bg-black relative z-10">
            <img
              src={BRAND_CONFIG.logoUrl}
              alt="GB STUDY"
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-display mt-3 tracking-tight">
            Join <span className="text-pink-400">GB STUDY</span> Telegram Channel
          </h2>

          <p className="text-xs sm:text-sm text-pink-100/70 mt-2 leading-relaxed max-w-xs mx-auto">
            Get instant notifications for new Kota batch lectures, Kota class DPPs, test series solutions, and PDF materials.
          </p>

          {/* Feature Highlights */}
          <div className="my-5 grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center gap-2">
              <Bell className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="text-[11px] font-semibold text-pink-100">Daily Kota Updates</span>
            </div>
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-pink-400 shrink-0" />
              <span className="text-[11px] font-semibold text-pink-100">100% Free Access</span>
            </div>
          </div>

          {/* Channel handle badge */}
          <div className="inline-block px-3 py-1 mb-5 rounded-lg bg-pink-950/60 border border-pink-500/30 text-pink-300 text-xs font-mono">
            {BRAND_CONFIG.telegramChannelName}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleJoin}
              className="flex-1 py-3 px-5 rounded-xl font-black text-sm bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:brightness-110 active:scale-95 text-white shadow-[0_4px_20px_rgba(236,72,153,0.5)] transition-all flex items-center justify-center gap-2 border border-pink-400/30"
            >
              <Send className="w-4 h-4 fill-white" />
              Join Telegram
              <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>
            <button
              onClick={onClose}
              className="py-3 px-6 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 active:scale-95 text-stone-300 hover:text-white border border-white/10 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
