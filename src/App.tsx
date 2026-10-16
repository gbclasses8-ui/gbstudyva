/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  Bookmark,
  Send,
  Video,
  FileText,
  GraduationCap,
  Users,
  CheckCircle2,
  FolderOpen,
} from 'lucide-react';
import { Header } from './components/Header';
import { CourseCard } from './components/CourseCard';
import { BatchDetailView } from './components/BatchDetailView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { TelegramModal } from './components/TelegramModal';
import { Footer } from './components/Footer';
import { BATCHES_DATA, BRAND_CONFIG } from './data/batches';
import { Batch } from './types';

export default function App() {
  // Navigation & View States
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);

  // Modals
  const [showTelegramModal, setShowTelegramModal] = useState<boolean>(true); // Shows when website opens
  const [activeVideo, setActiveVideo] = useState<{
    courseId: string | number;
    videoId: string | number;
    title: string;
  } | null>(null);
  const [activePdf, setActivePdf] = useState<{ url: string; title?: string } | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Enrolled Batches (Stored in LocalStorage)
  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('gbstudy_enrolled') || localStorage.getItem('studybee_wishlist');
      if (saved) return JSON.parse(saved).map(String);
    } catch {
      // fallback
    }
    return [];
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleToggleEnroll = (batchId: number | string) => {
    const strId = String(batchId);
    setEnrolledIds((prev) => {
      let updated: string[];
      if (prev.includes(strId)) {
        updated = prev.filter((id) => id !== strId);
        showToast('Removed from My Enrolled Batches');
      } else {
        updated = [...prev, strId];
        showToast('Enrolled in batch successfully!');
      }
      localStorage.setItem('gbstudy_enrolled', JSON.stringify(updated));
      return updated;
    });
  };

  // Filtered Batches
  const filteredBatches = useMemo(() => {
    let list = BATCHES_DATA;

    if (activeTab === 'enrolled') {
      list = list.filter((b) => enrolledIds.includes(String(b.id)));
    }

    if (selectedCategory !== 'all') {
      list = list.filter((b) => b.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.classLabel.toLowerCase().includes(q) ||
          (b.faculties && b.faculties.some((f) => f.toLowerCase().includes(q)))
      );
    }

    return list;
  }, [activeTab, selectedCategory, searchQuery, enrolledIds]);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-pink-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-pink-900/90 border border-pink-400 text-pink-100 text-xs sm:text-sm font-bold shadow-[0_10px_35px_rgba(236,72,153,0.4)] backdrop-blur-md animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-pink-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSelectedBatch(null);
        }}
        enrolledCount={enrolledIds.length}
        onOpenTelegram={() => setShowTelegramModal(true)}
        inCourseView={Boolean(selectedBatch)}
        onBackToHome={() => setSelectedBatch(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {selectedBatch ? (
          <BatchDetailView
            batch={selectedBatch}
            onBack={() => setSelectedBatch(null)}
            onPlayVideo={(courseId, videoId, title) =>
              setActiveVideo({ courseId, videoId, title })
            }
            onOpenPdf={(url, title) => setActivePdf({ url, title })}
            onShowToast={showToast}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
            {/* Hero Section */}
            <section className="relative rounded-3xl p-6 sm:p-10 mb-8 sm:mb-12 overflow-hidden pink-card border border-pink-500/30">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold mb-4">
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-pink-400">
                    <img
                      src={BRAND_CONFIG.logoUrl}
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>GB STUDY Official Educational Platform</span>
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight mb-4">
                  Kota Premier{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400">
                    JEE Batches
                  </span>{' '}
                  & Study Material
                </h1>

                <p className="text-sm sm:text-base text-pink-100/70 leading-relaxed mb-6">
                  Stream high-definition Kota classroom lectures, download handwritten chapter notes, test schedules, and practice questions for Class 11, Class 12, and Dropper batches. Completely free with no login required.
                </p>

                {/* Key Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-pink-500/20">
                  <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/20 flex items-center gap-3">
                    <Video className="w-5 h-5 text-pink-400" />
                    <div>
                      <div className="text-base sm:text-lg font-black text-white">3,500+</div>
                      <div className="text-[10px] text-pink-200/60 font-semibold uppercase">Video Lectures</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/20 flex items-center gap-3">
                    <FileText className="w-5 h-5 text-pink-400" />
                    <div>
                      <div className="text-base sm:text-lg font-black text-white">2,400+</div>
                      <div className="text-[10px] text-pink-200/60 font-semibold uppercase">PDFs & DPPs</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/20 flex items-center gap-3">
                    <Users className="w-5 h-5 text-pink-400" />
                    <div>
                      <div className="text-base sm:text-lg font-black text-white">Kota Star</div>
                      <div className="text-[10px] text-pink-200/60 font-semibold uppercase">NJ & MSC Sir</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-pink-500/20 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-pink-400" />
                    <div>
                      <div className="text-base sm:text-lg font-black text-white">100% Free</div>
                      <div className="text-[10px] text-pink-200/60 font-semibold uppercase">No Login Required</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Navigation & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
              {/* Category Pills in Pink */}
              <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar p-1.5 rounded-2xl bg-[#14081c] border border-pink-500/20 shadow-inner">
                {[
                  { id: 'all', label: 'All Batches' },
                  { id: 'class12', label: 'Class 12th' },
                  { id: 'class11', label: 'Class 11th' },
                  { id: 'dropper', label: 'Droppers / Repeaters' },
                  { id: 'modules', label: 'Printed Modules' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === cat.id
                        ? 'bg-pink-600 text-white shadow-md shadow-pink-600/40 border border-pink-400/40'
                        : 'text-stone-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Working Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search batches or faculty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#14081c] border border-pink-500/20 text-white text-xs sm:text-sm rounded-2xl pl-10 pr-9 py-2.5 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 placeholder:text-stone-500 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Filters Info */}
            <div className="flex items-center justify-between mb-6 text-xs text-pink-200/70">
              <span className="font-semibold">
                Showing{' '}
                <strong className="text-white">{filteredBatches.length}</strong>{' '}
                {activeTab === 'enrolled' ? 'enrolled batch(es)' : 'batch(es)'}
              </span>

              {activeTab === 'enrolled' && (
                <button
                  onClick={() => setActiveTab('all')}
                  className="text-pink-400 hover:text-pink-300 font-bold underline"
                >
                  Browse all batches
                </button>
              )}
            </div>

            {/* Batches Grid */}
            {filteredBatches.length === 0 ? (
              <div className="pink-card rounded-3xl p-12 text-center flex flex-col items-center border border-pink-500/20">
                <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Batches Found</h3>
                <p className="text-xs sm:text-sm text-stone-400 max-w-sm mb-6">
                  {activeTab === 'enrolled'
                    ? "You haven't enrolled in any batches yet. Click 'Enroll' on any batch card to pin it here!"
                    : 'Try clearing your search query or selecting a different category filter.'}
                </p>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-pink-600/30 transition-all active:scale-95"
                >
                  Reset Filters & View All
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBatches.map((batch) => (
                  <CourseCard
                    key={batch.id}
                    batch={batch}
                    isEnrolled={enrolledIds.includes(String(batch.id))}
                    onToggleEnroll={handleToggleEnroll}
                    onOpenCourse={(b) => setSelectedBatch(b)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Telegram Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowTelegramModal(true)}
          className="p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:brightness-110 active:scale-95 text-white shadow-[0_4px_25px_rgba(236,72,153,0.5)] flex items-center gap-2 border border-pink-300/40 transition-all group"
          aria-label="Open Telegram Channel"
        >
          <Send className="w-5 h-5 fill-white group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline text-xs font-black tracking-wide">
            Join Telegram
          </span>
        </button>
      </div>

      {/* Telegram Modal */}
      <TelegramModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
      />

      {/* Video Player Modal */}
      {activeVideo && (
        <VideoPlayerModal
          courseId={activeVideo.courseId}
          videoId={activeVideo.videoId}
          initialTitle={activeVideo.title}
          onClose={() => setActiveVideo(null)}
          onOpenPdf={(url, title) => setActivePdf({ url, title })}
        />
      )}

      {/* PDF Viewer Modal */}
      {activePdf && (
        <PdfViewerModal
          url={activePdf.url}
          title={activePdf.title}
          onClose={() => setActivePdf(null)}
        />
      )}

      {/* Footer */}
      <Footer
        onSelectBatch={(batch) => {
          setSelectedBatch(batch);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTelegram={() => setShowTelegramModal(true)}
      />
    </div>
  );
}
