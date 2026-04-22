import Link from "next/link";
import { Clock3, Play } from "lucide-react";
import { motion } from "framer-motion";
import { posterUrl } from "@/lib/tmdb";

export default function MovieCard({ movie, index = 0, runtime, onPlayTrailer }) {
  const year = movie.release_date ? movie.release_date.split("-")[0] : "";
  const movieRuntime = runtime ?? movie.runtime ?? null;

  const handlePlayTrailer = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onPlayTrailer) {
      onPlayTrailer(movie);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          src={posterUrl(movie.poster_path)}
          alt={movie.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-95 transition-opacity duration-300 group-hover:from-black/90" />

        <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/30 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
          FHD
        </div>

        <Link href={`/movie?id=${movie.id}`} aria-label={`Open ${movie.title}`} className="absolute inset-0 z-10 rounded-2xl" />

        {onPlayTrailer && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={handlePlayTrailer}
              className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 shadow-xl shadow-primary/25 transition-transform duration-300 hover:scale-105"
              aria-label={`Play trailer for ${movie.title}`}
            >
              <Play className="ml-0.5 h-6 w-6 fill-current text-primary-foreground" />
            </button>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 p-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.24em] text-primary/80">Movie</p>
              <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-white transition-colors group-hover:text-primary-foreground sm:text-base">
                {movie.title}
              </h3>
            </div>

            <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
              {movieRuntime ? (
                <span className="inline-flex items-center gap-1">
                  <Clock3 className="h-3 w-3" />
                  {movieRuntime} min
                </span>
              ) : (
                "Loading"
              )}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
            <span>{year || "Unknown year"}</span>
            <span className="h-1 w-1 rounded-full bg-white/40" />
            <span>{movieRuntime ? "Runtime shown" : "Updating time"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
