import { GENRES } from "@/lib/tmdb";

export default function CategoryFilter({ activeGenre, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 py-2 px-1">
      <button
        type="button"
        onClick={() => onSelect(null)}
        className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          activeGenre === null
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
            : "bg-secondary text-secondary-foreground hover:bg-accent"
        }`}
      >
        Trending
      </button>

      {GENRES.map((genre) => (
        <button
          key={genre.id}
          type="button"
          onClick={() => onSelect(genre.id)}
          className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            activeGenre === genre.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}
