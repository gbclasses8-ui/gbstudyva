import React, { useEffect, useState, useMemo } from 'react';
import {
  Folder,
  Play,
  FileText,
  ChevronRight,
  Share2,
  Clock,
  Calendar,
  Search,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { Batch, BreadcrumbCrumb, FolderItem } from '../types';
import { fetchFolderContents } from '../services/api';

interface BatchDetailViewProps {
  batch: Batch;
  onBack: () => void;
  onPlayVideo: (courseId: string | number, videoId: string | number, title: string) => void;
  onOpenPdf: (url: string, title?: string) => void;
  onShowToast: (msg: string) => void;
}

export const BatchDetailView: React.FC<BatchDetailViewProps> = ({
  batch,
  onBack,
  onPlayVideo,
  onOpenPdf,
  onShowToast,
}) => {
  const [navigationStack, setNavigationStack] = useState<BreadcrumbCrumb[]>([
    { id: '-1', title: batch.title },
  ]);
  const [items, setItems] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'FOLDER' | 'VIDEO' | 'PDF'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const currentFolder = navigationStack[navigationStack.length - 1];

  const loadContents = async (parentId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchFolderContents(batch.id, parentId);
      setItems(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load batch contents. Please check internet connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents(currentFolder.id);
  }, [currentFolder.id, batch.id]);

  const handleNavigateToFolder = (folderId: string, folderTitle: string) => {
    setNavigationStack((prev) => [...prev, { id: folderId, title: folderTitle }]);
    setSearchQuery('');
  };

  const handleJumpToCrumb = (index: number) => {
    setNavigationStack((prev) => prev.slice(0, index + 1));
    setSearchQuery('');
  };

  const handleGoBackOneLevel = () => {
    if (navigationStack.length > 1) {
      setNavigationStack((prev) => prev.slice(0, prev.length - 1));
      setSearchQuery('');
    } else {
      onBack();
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      onShowToast('Batch link copied to clipboard!');
    }
  };

  // Filter items by search query and type
  const filteredItems = useMemo(() => {
    let result = items;

    if (filterType !== 'ALL') {
      result = result.filter((item) => {
        const type = (item.material_type || '').toUpperCase();
        if (filterType === 'FOLDER') return type === 'FOLDER';
        if (filterType === 'VIDEO') return type === 'VIDEO';
        if (filterType === 'PDF') return type === 'PDF' || type === 'NOTES';
        return true;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.Title?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [items, filterType, searchQuery]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Course Hero Banner */}
      <div className="pink-card rounded-3xl overflow-hidden border border-pink-500/30 p-4 sm:p-6 mb-6 shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Thumbnail */}
          <div className="w-full sm:w-64 aspect-video rounded-2xl overflow-hidden bg-black shrink-0 border border-pink-500/20 shadow-md">
            <img
              src={batch.thumbnail}
              alt={batch.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).setAttribute(
                  'src',
                  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
                );
              }}
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between w-full">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-pink-500 text-white shadow-sm">
                  FREE BATCH
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  {batch.classLabel}
                </span>
              </div>

              <h1 className="text-lg sm:text-2xl font-black text-white font-display leading-tight mb-2">
                {batch.title}
              </h1>

              <p className="text-xs sm:text-sm text-pink-100/70 line-clamp-2 mb-3">
                {batch.description}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-pink-500/15">
              <div className="flex items-center gap-2 text-xs text-pink-300 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>Kota Faculty Recordings</span>
              </div>

              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1 text-xs sm:text-sm font-semibold text-stone-400">
          {navigationStack.map((crumb, idx) => {
            const isLast = idx === navigationStack.length - 1;
            return (
              <React.Fragment key={crumb.id + idx}>
                <button
                  onClick={() => handleJumpToCrumb(idx)}
                  className={`shrink-0 transition-colors ${
                    isLast
                      ? 'text-pink-400 font-bold pointer-events-none'
                      : 'hover:text-white'
                  }`}
                >
                  {crumb.title}
                </button>
                {!isLast && (
                  <ChevronRight className="w-3.5 h-3.5 text-pink-500/50 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {navigationStack.length > 1 && (
          <button
            onClick={handleGoBackOneLevel}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-pink-500/15 hover:bg-pink-500/25 text-pink-300 border border-pink-500/30 text-xs font-bold transition-all active:scale-95"
          >
            ← Back Level
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        {/* Type tabs in Pink */}
        <div className="flex items-center gap-1 bg-[#14081c] p-1 rounded-xl border border-pink-500/20 shadow-inner overflow-x-auto hide-scrollbar">
          {(['ALL', 'FOLDER', 'VIDEO', 'PDF'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterType(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                filterType === tab
                  ? 'bg-pink-600 text-white shadow-sm shadow-pink-600/30'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {tab === 'ALL' && 'All Items'}
              {tab === 'FOLDER' && 'Folders'}
              {tab === 'VIDEO' && 'Lectures'}
              {tab === 'PDF' && 'Notes & PDFs'}
            </button>
          ))}
        </div>

        {/* Search inside folder */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-pink-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chapters/topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14081c] border border-pink-500/20 text-white text-xs sm:text-sm rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-pink-500 placeholder:text-stone-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col gap-3 py-4">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className="h-20 rounded-2xl bg-pink-950/20 border border-pink-500/10 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="pink-card rounded-2xl p-8 text-center border-rose-500/30 flex flex-col items-center">
          <AlertTriangle className="w-10 h-10 text-rose-400 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Failed to Load Content</h3>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mb-4">{error}</p>
          <button
            onClick={() => loadContents(currentFolder.id)}
            className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-600/30"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try Again
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="pink-card rounded-2xl p-10 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-3 text-pink-400">
            <Folder className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">
            {searchQuery ? 'No matching items found' : 'This folder is empty'}
          </h3>
          <p className="text-xs text-stone-400">
            {searchQuery
              ? 'Try modifying your search term or clearing filters.'
              : 'No lectures or materials in this specific section.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredItems.map((item) => {
            const type = (item.material_type || item.material_type || '').toUpperCase();
            const title = item.Title || 'Untitled';
            const id = item.id;

            // FOLDER CARD
            if (type === 'FOLDER') {
              const counts: string[] = [];
              if (parseInt(item.videos_count || '0') > 0)
                counts.push(`${item.videos_count} Videos`);
              if (parseInt(item.files_count || '0') > 0)
                counts.push(`${item.files_count} PDFs`);
              if (parseInt(item.tests_count || '0') > 0)
                counts.push(`${item.tests_count} Tests`);

              const countText = counts.length > 0 ? counts.join(' • ') : 'Browse items';

              return (
                <div
                  key={id}
                  onClick={() => handleNavigateToFolder(id, title)}
                  className="pink-card rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer group active:scale-[0.99] hover:border-pink-500/50"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0 shadow-[inset_0_0_10px_rgba(236,72,153,0.15)] group-hover:scale-105 transition-transform">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Folder className="w-6 h-6 text-pink-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate group-hover:text-pink-300 transition-colors">
                        {title}
                      </h4>
                      <p className="text-xs text-pink-400/80 font-medium mt-0.5">
                        {countText}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-pink-500/10 group-hover:bg-pink-500/25 flex items-center justify-center text-pink-400 shrink-0 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              );
            }

            // VIDEO LECTURE CARD
            if (type === 'VIDEO') {
              const durationStr = item.duration || '';
              const isUpcoming =
                item.live_status === 2 || (!item.file_link && !item.duration_in_secs);
              const pdfUrl = item.pdf_link || null;

              return (
                <div
                  key={id}
                  className="pink-card rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row gap-3.5 sm:gap-4 relative overflow-hidden group hover:border-pink-500/50"
                >
                  {/* Video Thumbnail */}
                  <div
                    onClick={() => !isUpcoming && onPlayVideo(batch.id, id, title)}
                    className="w-full sm:w-48 aspect-video bg-black rounded-xl relative overflow-hidden shrink-0 border border-pink-500/20 cursor-pointer shadow-inner"
                  >
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black/50 text-pink-400">
                        <Play className="w-8 h-8 fill-pink-500" />
                      </div>
                    )}
                    {durationStr && !isUpcoming && (
                      <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-white font-bold border border-white/10">
                        {durationStr}
                      </div>
                    )}
                  </div>

                  {/* Info & Action Buttons */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4
                        onClick={() => !isUpcoming && onPlayVideo(batch.id, id, title)}
                        className="text-sm sm:text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-pink-300 transition-colors cursor-pointer"
                      >
                        {title}
                      </h4>
                      {item.date_and_time && (
                        <div className="flex items-center gap-1.5 text-[11px] text-pink-200/60 mt-1">
                          <Calendar className="w-3 h-3 text-pink-400" />
                          <span>{item.date_and_time}</span>
                        </div>
                      )}
                    </div>

                    {/* Buttons in requested Pink Theme */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-pink-500/10">
                      {isUpcoming ? (
                        <span className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Upcoming
                        </span>
                      ) : (
                        <button
                          onClick={() => onPlayVideo(batch.id, id, title)}
                          className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:brightness-110 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-pink-600/30 border border-pink-400/30"
                        >
                          <Play className="w-3.5 h-3.5 fill-white" />
                          Watch Lecture
                        </button>
                      )}

                      {pdfUrl && (
                        <button
                          onClick={() => onOpenPdf(pdfUrl, `${title} - Notes`)}
                          className="px-3.5 py-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5 text-pink-400" />
                          <span>Notes</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }

            // PDF / NOTES CARD
            if (type === 'PDF' || type === 'NOTES') {
              const pdfUrl = item.file_link || item.pdf_link || item.download_link;

              return (
                <div
                  key={id}
                  className="pink-card rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:border-pink-500/50"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center shrink-0 text-pink-400 shadow-[inset_0_0_10px_rgba(236,72,153,0.15)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm sm:text-base font-bold text-white truncate hover:text-pink-300 transition-colors">
                        {title}
                      </h4>
                      {item.date_and_time && (
                        <p className="text-[11px] text-pink-200/60 mt-0.5">
                          {item.date_and_time}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => pdfUrl && onOpenPdf(pdfUrl, title)}
                    className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:brightness-110 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-md shadow-pink-600/30 border border-pink-400/30"
                  >
                    Open PDF
                  </button>
                </div>
              );
            }

            // IMAGE / NOTICE CARD
            return (
              <div
                key={id}
                className="pink-card rounded-2xl p-4 flex items-center gap-3 border border-pink-500/20"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center shrink-0 text-pink-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{title}</h4>
                  <p className="text-xs text-pink-300/60">Important Notice / Update</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
