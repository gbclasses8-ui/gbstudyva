import React from 'react';
import { Bookmark, Send, Sparkles, BookOpen, ChevronLeft } from 'lucide-react';
import { BRAND_CONFIG } from '../data/batches';

interface HeaderProps {
  activeTab: 'all' | 'enrolled';
  onTabChange: (tab: 'all' | 'enrolled') => void;
  enrolledCount: number;
  onOpenTelegram: () => void;
  inCourseView?: boolean;
  onBackToHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  enrolledCount,
  onOpenTelegram,
  inCourseView,
  onBackToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full nav-glass shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Left: Brand Logo & Title or Back Button */}
        <div className="flex items-center gap-3">
          {inCourseView && onBackToHome && (
            <button
              onClick={onBackToHome}
              className="p-2 sm:p-2.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 transition-all active:scale-95 flex items-center gap-1 text-xs font-bold mr-1"
              title="Back to Batches"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
              <span className="hidden sm:inline">Batches</span>
            </button>
          )}

          <div
            onClick={onBackToHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border-2 border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.4)] group-hover:scale-105 group-hover:border-pink-400 transition-all duration-300 bg-black">
              <img
                src={BRAND_CONFIG.logoUrl}
                alt="GB STUDY Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white">
                  GB <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400">STUDY</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  KOTA
                </span>
              </div>
              <span className="hidden sm:block text-[11px] font-medium text-pink-200/60 -mt-0.5 tracking-wide">
                Free Kota JEE Learning Portal
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right Nav buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Latest Batches */}
          <button
            onClick={() => {
              if (inCourseView && onBackToHome) onBackToHome();
              onTabChange('all');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              !inCourseView && activeTab === 'all'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 border border-pink-400/40'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-300" />
            <span className="hidden xs:inline">Batches</span>
          </button>

          {/* Enrolled Tab */}
          <button
            onClick={() => {
              if (inCourseView && onBackToHome) onBackToHome();
              onTabChange('enrolled');
            }}
            className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all relative ${
              !inCourseView && activeTab === 'enrolled'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 border border-pink-400/40'
                : 'text-stone-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
            <span className="hidden sm:inline">Enrolled</span>
            {enrolledCount > 0 && (
              <span className="ml-0.5 bg-pink-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center leading-tight">
                {enrolledCount}
              </span>
            )}
          </button>

          {/* Telegram Channel Button in Hot Pink */}
          <button
            onClick={onOpenTelegram}
            className="px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-[0_0_18px_rgba(236,72,153,0.4)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 border border-pink-300/30"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
            <span className="hidden sm:inline">Telegram</span>
          </button>
        </div>
      </div>
    </header>
  );
};
