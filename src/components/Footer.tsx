import React from 'react';
import { Send, Shield, Sparkles, BookOpen, Heart } from 'lucide-react';
import { BRAND_CONFIG, BATCHES_DATA } from '../data/batches';
import { Batch } from '../types';

interface FooterProps {
  onSelectBatch: (batch: Batch) => void;
  onOpenTelegram: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectBatch, onOpenTelegram }) => {
  return (
    <footer className="w-full bg-[#08030c] border-t border-pink-500/20 pt-12 pb-8 mt-16 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.3)] bg-black">
                <img
                  src={BRAND_CONFIG.logoUrl}
                  alt="GB STUDY Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl font-black font-display text-white tracking-tight">
                GB <span className="text-pink-400">STUDY</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-pink-100/70 max-w-sm mb-5 leading-relaxed">
              Your free, reliable gateway to Kota's premier JEE classroom lectures, printed modules, chapter tests, and comprehensive DPP sheets.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenTelegram}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:brightness-110 active:scale-95 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-pink-600/30 transition-all border border-pink-300/30"
              >
                <Send className="w-3.5 h-3.5 fill-white" />
                Join Telegram Channel
              </button>
            </div>
          </div>

          {/* Quick Batches Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5 text-pink-400">
              <Sparkles className="w-3.5 h-3.5" /> Popular Batches
            </h4>
            <ul className="space-y-2 text-xs">
              {BATCHES_DATA.slice(0, 4).map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => onSelectBatch(b)}
                    className="hover:text-pink-300 transition-colors text-left truncate w-full"
                  >
                    {b.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features / Notice */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5 text-pink-400">
              <Shield className="w-3.5 h-3.5" /> Features
            </h4>
            <ul className="space-y-2 text-xs text-pink-100/70">
              <li>• 100% Free - No Signups or Passwords</li>
              <li>• Multi-Resolution HLS Video Streaming</li>
              <li>• Kota Classroom Handwritten Notes</li>
              <li>• Fast Responsive UI for Desktop & Mobile</li>
              <li>• Official Channel: <span className="text-pink-400 font-mono">@GBFreestudy</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-pink-500/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-pink-200/50">
          <p>© {new Date().getFullYear()} GB STUDY. Dedicated to Student Success.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>for JEE Aspirants</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
