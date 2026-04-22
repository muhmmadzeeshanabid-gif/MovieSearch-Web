import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Maximize2, Minimize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getYouTubeEmbedUrl } from "@/lib/tmdb";

export default function TrailerModal({ open, movie, trailer, loading, error, onClose }) {
  const modalRef = useRef(null);
  const [viewMode, setViewMode] = useState("half");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (open) {
      setViewMode("half");
      return;
    }

    setViewMode("half");
  }, [open]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const embedUrl = useMemo(() => getYouTubeEmbedUrl(trailer?.key), [trailer]);

  const handleToggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (modalRef.current?.requestFullscreen) {
        await modalRef.current.requestFullscreen();
      }
    } catch {
      // If fullscreen is blocked, the modal still works in normal mode.
    }
  };

  const containerClassName = isFullscreen
    ? "h-full w-full rounded-none border-0"
    : viewMode === "full"
      ? "w-[96vw] max-w-7xl rounded-[32px]"
      : "w-full max-w-5xl rounded-[32px]";

  const playerHeightClassName = isFullscreen
    ? "h-full"
    : viewMode === "full"
      ? "h-[78vh]"
      : "h-[58vh] sm:h-[64vh]";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
            className={`relative flex w-full flex-col overflow-hidden border border-primary/20 bg-card/95 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl ${containerClassName}`}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/60 bg-slate-950/70 px-4 py-3 sm:px-5">
              <div className="min-w-0 space-y-1">
                <p className="text-[10px] uppercase tracking-[0.28em] text-primary/80">Trailer Player</p>
                <h3 className="truncate font-display text-2xl text-white">{movie?.title || "Trailer"}</h3>
                <p className="truncate text-xs text-white/60">{trailer?.name || "YouTube trailer"}</p>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode((previous) => (previous === "half" ? "full" : "half"))}
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {viewMode === "half" ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  {viewMode === "half" ? "Full Screen" : "Half Screen"}
                </button>
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  {isFullscreen ? "Exit Fullscreen" : "Browser Fullscreen"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Close trailer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={`relative w-full overflow-hidden bg-black ${playerHeightClassName}`}>
              {loading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                  <Loader2 className="h-9 w-9 animate-spin text-primary" />
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-white">Loading trailer</p>
                    <p className="text-sm text-white/60">We are fetching the best YouTube trailer from TMDB.</p>
                  </div>
                </div>
              ) : embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${movie?.title || "Movie"} trailer`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                  <div className="space-y-2">
                    <p className="text-2xl font-display text-white">Trailer not available</p>
                    <p className="max-w-lg text-sm leading-6 text-white/65">
                      {error || "TMDB does not have a YouTube trailer for this movie right now."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
