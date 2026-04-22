import { useCallback, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import MovieCard from "@/components/MovieCard";
import { SkeletonGrid } from "@/components/MovieCardSkeleton";
import PaginationControls from "@/components/PaginationControls";
import TrailerModal from "@/components/TrailerModal";
import { useTrailerPlayer } from "@/hooks/useTrailerPlayer";
import { getByGenre, getMovieRuntime, getTrending, searchMovies } from "@/lib/tmdb";
import { useDebounce } from "@/hooks/useDebounce";

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState(null);
  const [runtimeMap, setRuntimeMap] = useState({});
  const { trailerState, openTrailer, closeTrailer } = useTrailerPlayer();
  const debouncedQuery = useDebounce(searchQuery, 400);
  const bannerMovie = debouncedQuery ? movies[0] || heroMovie || null : heroMovie || movies[0] || null;

  const fetchMovies = useCallback(
    async (targetPage) => {
      setLoading(true);
      try {
        let data;
        if (debouncedQuery) {
          data = await searchMovies(debouncedQuery, targetPage);
        } else if (activeGenre) {
          data = await getByGenre(activeGenre, targetPage);
        } else {
          data = await getTrending(targetPage);
        }

        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);

        if (targetPage === 1 && (data.results || []).length > 0 && !debouncedQuery) {
          const hero = data.results.find((movie) => movie.backdrop_path) || data.results[0];
          setHeroMovie(hero);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [activeGenre, debouncedQuery],
  );

  useEffect(() => {
    setPage(1);
    fetchMovies(1);
  }, [fetchMovies]);

  useEffect(() => {
    if (!movies.length) {
      return;
    }

    let cancelled = false;
    const missingIds = movies
      .map((movie) => movie.id)
      .filter((id) => runtimeMap[id] == null);

    if (!missingIds.length) {
      return;
    }

    Promise.all(
      missingIds.map(async (id) => ({
        id,
        runtime: await getMovieRuntime(id),
      })),
    ).then((results) => {
      if (cancelled) {
        return;
      }

      const nextMap = {};
      results.forEach(({ id, runtime }) => {
        if (typeof runtime === "number") {
          nextMap[id] = runtime;
        }
      });

      if (Object.keys(nextMap).length > 0) {
        setRuntimeMap((prev) => ({ ...prev, ...nextMap }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [movies, runtimeMap]);

  const handlePageChange = (targetPage) => {
    setPage(targetPage);
    fetchMovies(targetPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const handleGenreSelect = (genreId) => {
    setActiveGenre(genreId);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <HeroBanner
        movie={bannerMovie}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        loading={loading}
        onPlayTrailer={openTrailer}
      />
      <TrailerModal
        open={trailerState.open}
        movie={trailerState.movie}
        trailer={trailerState.trailer}
        loading={trailerState.loading}
        error={trailerState.error}
        onClose={closeTrailer}
      />

      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-16 space-y-6">
        {!debouncedQuery && <CategoryFilter activeGenre={activeGenre} onSelect={handleGenreSelect} />}

        {debouncedQuery && (
          <h2 className="font-display text-3xl text-foreground pt-8">RESULTS FOR "{debouncedQuery.toUpperCase()}"</h2>
        )}

        {loading && movies.length === 0 ? (
          <SkeletonGrid />
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No movies found. Try a different search.</div>
        ) : (
          <>
            {loading && movies.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Updating results...
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {movies.map((movie, index) => (
                <MovieCard
                  key={`${movie.id}-${index}`}
                  movie={movie}
                  runtime={movie.runtime ?? runtimeMap[movie.id]}
                  index={index}
                  onPlayTrailer={openTrailer}
                />
              ))}
            </div>

            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
