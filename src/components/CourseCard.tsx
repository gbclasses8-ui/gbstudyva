import React from 'react';
import { ArrowRight, Check, Plus, Video, FileText, Sparkles } from 'lucide-react';
import { Batch } from '../types';

interface CourseCardProps {
  batch: Batch;
  isEnrolled: boolean;
  onToggleEnroll: (batchId: number | string) => void;
  onOpenCourse: (batch: Batch) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  batch,
  isEnrolled,
  onToggleEnroll,
  onOpenCourse,
}) => {
  return (
    <div className="pink-card rounded-2xl overflow-hidden flex flex-col group relative border border-pink-500/20 hover:border-pink-500/50">
      {/* Thumbnail Container */}
      <div
        className="relative w-full aspect-[16/9] overflow-hidden bg-black cursor-pointer"
        onClick={() => onOpenCourse(batch)}
      >
        <img
          src={batch.thumbnail}
          alt={batch.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLElement).setAttribute(
              'src',
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
            );
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#100718] via-transparent to-transparent opacity-90"></div>

        {/* Free Tag in Pink */}
        <div className="absolute top-3 right-3 bg-pink-500/90 text-white font-black text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-lg shadow-lg backdrop-blur-md border border-pink-400/40">
          FREE
        </div>

        {/* Class Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md border border-pink-500/30 px-2 py-0.5 rounded-md flex items-center gap-1.5 text-pink-300 text-[11px] font-bold">
          <Sparkles className="w-3 h-3 text-pink-400" />
          {batch.classLabel}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3
          onClick={() => onOpenCourse(batch)}
          className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-2 cursor-pointer group-hover:text-pink-300 transition-colors mb-2"
        >
          {batch.title}
        </h3>

        {/* Counts / Description snippet */}
        <div className="flex items-center gap-3 text-xs text-pink-200/60 mb-4 mt-auto pt-2">
          {batch.totalVideos ? (
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-pink-400" />
              {batch.totalVideos}+ Lectures
            </span>
          ) : null}
          {batch.totalPdfs ? (
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-pink-400" />
              {batch.totalPdfs}+ Notes
            </span>
          ) : null}
        </div>

        {/* Faculties pills if available */}
        {batch.faculties && batch.faculties.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {batch.faculties.slice(0, 3).map((faculty, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-pink-950/50 text-pink-300 border border-pink-500/20 px-2 py-0.5 rounded"
              >
                {faculty}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Actions - All in requested Pink Theme! */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-pink-500/15 mt-auto">
          {/* Enroll / Enrolled Button */}
          <button
            onClick={() => onToggleEnroll(batch.id)}
            className={`px-3 py-2 rounded-xl text-xs font-bold tracking-wider flex items-center gap-1.5 transition-all active:scale-95 border ${
              isEnrolled
                ? 'bg-pink-950/60 text-pink-300 border-pink-500/40 shadow-sm'
                : 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 hover:text-pink-200 border-pink-500/30'
            }`}
          >
            {isEnrolled ? (
              <>
                <Check className="w-3.5 h-3.5 text-pink-400" />
                <span>ENROLLED</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 text-pink-400" />
                <span>ENROLL</span>
              </>
            )}
          </button>

          {/* Let's Study Button in Vibrant Pink */}
          <button
            onClick={() => onOpenCourse(batch)}
            className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:brightness-110 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_4px_15px_rgba(236,72,153,0.35)] border border-pink-400/30"
          >
            Let's Study
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
