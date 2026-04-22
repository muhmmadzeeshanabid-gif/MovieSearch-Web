import Link from "next/link";
import { Info, Play, Search } from "lucide-react";
import { backdropUrl } from "@/lib/tmdb";

export default function HeroBanner({ movie, searchQuery, onSearch, loading, onPlayTrailer }) {
  const backgroundImage = movie ? backdropUrl(movie.backdrop_path) : null;
  const fallbackBackground = {
    backgroundImage:
      "radial-gradient(circle at top right, hsl(var(--primary) / 0.35), transparent 34%), radial-gradient(circle at bottom left, hsl(var(--accent) / 0.45), transparent 30%), linear-gradient(180deg, hsl(var(--background)), hsl(var(--background)))",
  };

  return (
    <div className="relative h-[70vh] min-h-[400px] flex items-end overflow-hidden">
      {backgroundImage ? (
        <img src={backgroundImage} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={fallbackBackground} />
      )}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative container mx-auto px-4 pb-16 space-y-5 max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-muted-foreground backdrop-blur-sm">
          {movie ? "Trending Spotlight" : "Search Mode"}
        </div>

        <h1 className="font-display text-5xl md:text-7xl text-foreground tracking-wider">
          {movie ? movie.title : searchQuery ? `Searching "${searchQuery}"` : "Discover movies"}
        </h1>
        <p className="text-sm md:text-base text-secondary-foreground line-clamp-3">
          {movie
            ? movie.overview
            : "Your search bar stays here while results load, and the theme switch lives in the navbar."}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => movie && onPlayTrailer?.(movie)}
            disabled={!movie || !onPlayTrailer}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-current" /> Play
          </button>
          {movie ? (
            <Link
              href={`/movie?id=${movie.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-secondary/80 text-secondary-foreground rounded-md font-semibold hover:bg-secondary transition-colors backdrop-blur-sm"
            >
              <Info className="w-5 h-5" /> More Info
            </Link>
          ) : (
            <div className="flex items-center rounded-md border border-border bg-secondary/60 px-6 py-3 text-sm text-secondary-foreground backdrop-blur-sm">
              Search movies from the bar below
            </div>
          )}
        </div>

        <div className="relative pt-2">
          <Search className="absolute left-4 top-1/2 mt-1 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search movies, shows, genres..."
            value={searchQuery}
            onChange={(event) => onSearch(event.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-secondary/80 backdrop-blur-md border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
        </div>

        {loading && (
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            Updating results
          </div>
        )}
      </div>
    </div>
  );
}
