import Link from "next/link";
import { Play } from "lucide-react";
import { posterUrl } from "@/lib/tmdb";

export default function RecommendationRow({ title, movies, onPlayTrailer }) {
  if (!movies.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h2 className="font-display text-2xl text-foreground tracking-wide">{title}</h2>
      <div className="flex gap-4 overflow-x-auto scroll-snap-x pb-4 -mx-4 px-4">
        {movies.map((movie) => (
          <div key={movie.id} className="group relative shrink-0 w-[200px] md:w-[240px]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
              <img
                src={posterUrl(movie.poster_path, "w342")}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <Link href={`/movie?id=${movie.id}`} aria-label={`Open ${movie.title}`} className="absolute inset-0 z-10 rounded-lg" />

              {onPlayTrailer && (
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onPlayTrailer(movie);
                    }}
                    className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 shadow-xl transition-transform duration-300 hover:scale-105"
                    aria-label={`Play trailer for ${movie.title}`}
                  >
                    <Play className="ml-0.5 h-6 w-6 fill-current text-primary-foreground" />
                  </button>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 z-10 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="truncate text-sm font-medium text-white">{movie.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
