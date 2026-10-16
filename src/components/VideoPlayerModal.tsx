import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  FileText,
  AlertCircle,
  Loader2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Check,
} from 'lucide-react';
import { VideoDetail, VideoQuality } from '../types';
import { buildProxyStreamUrl, fetchVideoDetails } from '../services/api';

interface VideoPlayerModalProps {
  courseId: string | number;
  videoId: string | number;
  initialTitle?: string;
  onClose: () => void;
  onOpenPdf: (url: string, title?: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  courseId,
  videoId,
  initialTitle,
  onClose,
  onOpenPdf,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoDetail | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentQuality, setCurrentQuality] = useState<string>('Auto');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Menus
  const [activeMenu, setActiveMenu] = useState<'none' | 'settings' | 'quality' | 'speed' | 'notes'>('none');
  const [skipNotice, setSkipNotice] = useState<'left' | 'right' | null>(null);

  const controlsTimeoutRef = useRef<any>(null);

  // Auto-hide controls
  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying && activeMenu === 'none') {
        setShowControls(false);
      }
    }, 3500);
  };

  // Fetch video details
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const data = await fetchVideoDetails(courseId, videoId);
        if (!isMounted) return;
        setVideoData(data);
        setLoading(false);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load video details');
        setLoading(false);
      }
    }

    loadData();
    return () => {
      isMounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [courseId, videoId]);

  // Initialize playback when videoData is ready
  useEffect(() => {
    if (!videoData || !videoRef.current) return;

    // Pick stream url: first quality or decoded_video_link
    let targetStream = '';
    if (videoData.qualities && videoData.qualities.length > 0) {
      targetStream = videoData.qualities[0].url;
      setCurrentQuality(videoData.qualities[0].quality);
    } else if (videoData.decoded_video_link) {
      targetStream = videoData.decoded_video_link;
    }

    if (targetStream) {
      playStream(targetStream);
    }
  }, [videoData]);

  const playStream = (rawUrl: string, startPos: number = 0) => {
    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const proxyUrl = buildProxyStreamUrl(rawUrl);

    if (Hls.isSupported()) {
      const hls = new Hls({
        startPosition: startPos > 0 ? startPos : -1,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(proxyUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {
          // Autoplay was blocked
          setIsPlaying(false);
        });
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = proxyUrl;
      video.addEventListener('loadedmetadata', () => {
        if (startPos > 0) video.currentTime = startPos;
        video.play().catch(() => setIsPlaying(false));
      });
    }
  };

  // Video event handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    if (videoRef.current.buffered.length > 0) {
      setBuffered(
        (videoRef.current.buffered.end(videoRef.current.buffered.length - 1) /
          videoRef.current.duration) *
          100
      );
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    resetControlsTimer();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const target = parseFloat(e.target.value);
    videoRef.current.currentTime = target;
    setCurrentTime(target);
    resetControlsTimer();
  };

  const skipSeconds = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(videoRef.current.currentTime + seconds, duration)
    );
    setSkipNotice(seconds < 0 ? 'left' : 'right');
    setTimeout(() => setSkipNotice(null), 700);
    resetControlsTimer();
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    videoRef.current.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
    resetControlsTimer();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 1;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
    resetControlsTimer();
  };

  const handleSpeedSelect = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setActiveMenu('none');
    resetControlsTimer();
  };

  const handleQualitySelect = (quality: VideoQuality) => {
    if (!videoRef.current) return;
    const currentPos = videoRef.current.currentTime;
    setCurrentQuality(quality.quality);
    playStream(quality.url, currentPos);
    setActiveMenu('none');
    resetControlsTimer();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '0:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div
        ref={containerRef}
        onMouseMove={resetControlsTimer}
        onTouchStart={resetControlsTimer}
        className="relative w-full h-full max-w-7xl max-h-screen flex flex-col justify-center items-center bg-black select-none overflow-hidden"
      >
        {/* Loading state */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/90 text-white">
            <Loader2 className="w-12 h-12 text-pink-500 animate-spin mb-3" />
            <p className="text-sm font-bold text-pink-200">Loading lecture stream...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/95 text-white p-6 text-center">
            <AlertCircle className="w-14 h-14 text-rose-500 mb-3" />
            <h3 className="text-lg font-bold mb-1">Playback Issue</h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md mb-4">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchVideoDetails(courseId, videoId)
                    .then((d) => {
                      setVideoData(d);
                      setLoading(false);
                    })
                    .catch((e) => {
                      setError(e.message);
                      setLoading(false);
                    });
                }}
                className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
              >
                Retry
              </button>
              {videoData?.player_url && (
                <button
                  onClick={() => window.open(videoData.player_url, '_blank')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" /> Open in Web Player
                </button>
              )}
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          playsInline
          className="w-full h-full object-contain cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {/* Touch double-tap indicators */}
        {skipNotice === 'left' && (
          <div className="absolute left-12 top-1/2 -translate-y-1/2 p-5 rounded-full bg-pink-600/70 backdrop-blur-md text-white font-bold text-sm flex items-center gap-1 animate-pulse z-40 pointer-events-none">
            <RotateCcw className="w-6 h-6" /> -10s
          </div>
        )}
        {skipNotice === 'right' && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 p-5 rounded-full bg-pink-600/70 backdrop-blur-md text-white font-bold text-sm flex items-center gap-1 animate-pulse z-40 pointer-events-none">
            <RotateCw className="w-6 h-6" /> +10s
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-between pointer-events-none transition-opacity duration-300 z-30 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* TOP BAR */}
          <div className="p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent pointer-events-auto flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-pink-600/80 text-white transition-all border border-white/10 active:scale-95"
              aria-label="Back"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <h2 className="text-white font-bold text-sm sm:text-base truncate drop-shadow-md">
                {videoData?.title || initialTitle || 'Lecture Video'}
              </h2>
              {videoData?.date && (
                <p className="text-[11px] text-pink-300/80 truncate">{videoData.date}</p>
              )}
            </div>

            {/* Attached Notes & External Links */}
            <div className="flex items-center gap-2 relative">
              {(videoData?.pdf_viewer || videoData?.decoded_pdf_link) && (
                <button
                  onClick={() =>
                    onOpenPdf(
                      videoData.pdf_viewer || videoData.decoded_pdf_link!,
                      `${videoData.title} (Notes)`
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-600/40 border border-pink-400/40 active:scale-95 transition-all"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Notes</span>
                </button>
              )}

              {videoData?.player_url && (
                <button
                  onClick={() => window.open(videoData.player_url, '_blank')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                  title="Open in Akamai Player"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-auto flex flex-col gap-3">
            {/* Seek Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-pink-200/90 w-12 text-right">
                {formatTime(currentTime)}
              </span>

              <div className="flex-1 relative group flex items-center h-6">
                {/* Background Track */}
                <div className="w-full h-1.5 bg-white/20 rounded-full relative overflow-hidden">
                  {/* Buffered Bar */}
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-white/30 rounded-full"
                    style={{ width: `${buffered}%` }}
                  />
                  {/* Progress Fill in Hot Pink */}
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full shadow-[0_0_10px_#ec4899]"
                    style={{
                      width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                    }}
                  />
                </div>

                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
              </div>

              <span className="text-xs font-mono text-pink-200/90 w-12">
                {formatTime(duration)}
              </span>
            </div>

            {/* Action Row */}
            <div className="flex items-center justify-between">
              {/* Play / Skip / Volume */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => skipSeconds(-10)}
                  className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                  title="Rewind 10s"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-pink-500 hover:bg-pink-400 active:scale-95 text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-white" />
                  ) : (
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => skipSeconds(10)}
                  className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                  title="Forward 10s"
                >
                  <RotateCw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Volume slider (desktop) */}
                <div className="hidden sm:flex items-center gap-2 group/vol ml-2">
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5 text-rose-400" />
                    ) : (
                      <Volume2 className="w-5 h-5 text-stone-300" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-16 accent-pink-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Quality / Speed / Fullscreen */}
              <div className="flex items-center gap-2 sm:gap-4 relative">
                {/* Speed indicator & button */}
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === 'speed' ? 'none' : 'speed')
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-pink-600/40 text-xs font-bold text-stone-200 hover:text-white transition-colors flex items-center gap-1 border border-white/5"
                >
                  <span>{playbackSpeed}x</span>
                </button>

                {/* Quality & Settings */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === 'settings' ? 'none' : 'settings')
                    }
                    className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-pink-400 transition-colors"
                    aria-label="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>

                  {/* Settings Main Menu */}
                  {activeMenu === 'settings' && (
                    <div className="absolute bottom-12 right-0 w-52 rounded-2xl bg-[#180a22]/95 border border-pink-500/30 p-2 shadow-2xl backdrop-blur-xl z-50 animate-scaleUp">
                      <button
                        onClick={() => setActiveMenu('quality')}
                        className="w-full p-2.5 rounded-xl hover:bg-pink-500/20 text-xs font-bold text-stone-200 flex items-center justify-between transition-colors"
                      >
                        <span>Quality</span>
                        <span className="text-pink-400 flex items-center gap-1 font-mono">
                          {currentQuality} <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveMenu('speed')}
                        className="w-full p-2.5 rounded-xl hover:bg-pink-500/20 text-xs font-bold text-stone-200 flex items-center justify-between transition-colors"
                      >
                        <span>Playback Speed</span>
                        <span className="text-pink-400 flex items-center gap-1 font-mono">
                          {playbackSpeed}x <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Quality Submenu */}
                  {activeMenu === 'quality' && (
                    <div className="absolute bottom-12 right-0 w-52 rounded-2xl bg-[#180a22]/95 border border-pink-500/30 p-2 shadow-2xl backdrop-blur-xl z-50">
                      <button
                        onClick={() => setActiveMenu('settings')}
                        className="w-full p-2 rounded-xl text-stone-400 hover:text-white text-xs font-bold flex items-center gap-1 border-b border-white/10 mb-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                        {videoData?.qualities && videoData.qualities.length > 0 ? (
                          videoData.qualities.map((q) => (
                            <button
                              key={q.quality}
                              onClick={() => handleQualitySelect(q)}
                              className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                                currentQuality === q.quality
                                  ? 'bg-pink-600 text-white'
                                  : 'hover:bg-white/10 text-stone-300'
                              }`}
                            >
                              <span>{q.quality}</span>
                              {currentQuality === q.quality && <Check className="w-3.5 h-3.5" />}
                            </button>
                          ))
                        ) : (
                          <div className="p-2 text-stone-400 text-xs">Auto Quality (Default)</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Speed Submenu */}
                  {activeMenu === 'speed' && (
                    <div className="absolute bottom-12 right-0 w-44 rounded-2xl bg-[#180a22]/95 border border-pink-500/30 p-2 shadow-2xl backdrop-blur-xl z-50">
                      <button
                        onClick={() => setActiveMenu('settings')}
                        className="w-full p-2 rounded-xl text-stone-400 hover:text-white text-xs font-bold flex items-center gap-1 border-b border-white/10 mb-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      <div className="flex flex-col gap-1">
                        {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSpeedSelect(s)}
                            className={`w-full p-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                              playbackSpeed === s
                                ? 'bg-pink-600 text-white'
                                : 'hover:bg-white/10 text-stone-300'
                            }`}
                          >
                            <span>{s}x</span>
                            {playbackSpeed === s && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-pink-400 transition-colors"
                  aria-label="Fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
