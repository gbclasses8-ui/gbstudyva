import React from 'react';
import { X, ExternalLink, Download, FileText } from 'lucide-react';
import { buildProxyPdfUrl } from '../services/api';

interface PdfViewerModalProps {
  url: string;
  title?: string;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  url,
  title,
  onClose,
}) => {
  // If the URL is already a proxy or direct URL:
  const proxyUrl = url.startsWith('http') ? buildProxyPdfUrl(url) : url;

  const handleOpenDirect = () => {
    window.open(proxyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-[#14081c] border-2 border-pink-500/30 shadow-[0_20px_60px_rgba(236,72,153,0.35)]">
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#1e0a29] to-[#12051a] border-b border-pink-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-pink-400" />
            </div>
            <div className="min-w-0">
              <h3 className="text-white font-bold text-xs sm:text-sm truncate">
                {title || 'Lecture Notes / PDF Document'}
              </h3>
              <p className="text-[10px] text-pink-300/70 truncate">GB STUDY Educational Material</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenDirect}
              className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-pink-600/30"
              title="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white transition-colors border border-white/10"
              aria-label="Close PDF viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Embedded Frame */}
        <div className="flex-1 w-full bg-[#0a050f] relative">
          <iframe
            src={proxyUrl}
            title={title || 'PDF Document'}
            className="w-full h-full border-none"
          />

          {/* Bottom Bar Info / Direct Link Fallback */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-pink-500/30 px-4 py-2 rounded-xl text-xs text-stone-300 flex items-center gap-3 shadow-xl">
            <span>Can't view PDF in your mobile browser?</span>
            <button
              onClick={handleOpenDirect}
              className="text-pink-400 hover:text-pink-300 font-bold underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Download / View Directly
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
