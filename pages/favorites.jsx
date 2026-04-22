import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import MovieCard from "@/components/MovieCard";
import { SkeletonGrid } from "@/components/MovieCardSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getFavorites } from "@/lib/favorites";
import { getMovieDetails } from "@/lib/tmdb";
import TrailerModal from "@/components/TrailerModal";
import { useTrailerPlayer } from "@/hooks/useTrailerPlayer";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, isReady } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { trailerState, openTrailer, closeTrailer } = useTrailerPlayer();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    const ids = getFavorites();
    if (!ids.length) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(ids.map((movieId) => getMovieDetails(movieId).catch(() => null)))
      .then((results) => {
        setMovies(results.filter(Boolean));
      })
      .finally(() => setLoading(false));
  }, [isReady, router, user]);

  if (!isReady || (!user && loading)) {
    return (
      <div className="min-h-screen bg-background pt-8">
        <div className="container mx-auto px-4 py-8">
          <SkeletonGrid count={6} />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pt-8">
      <TrailerModal
        open={trailerState.open}
        movie={trailerState.movie}
        trailer={trailerState.trailer}
        loading={trailerState.loading}
        error={trailerState.error}
        onClose={closeTrailer}
      />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full bg-secondary text-foreground hover:bg-accent transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-4xl text-foreground tracking-wider">MY FAVORITES</h1>
        </div>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : movies.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">No favorites yet. Start adding movies you love!</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} onPlayTrailer={openTrailer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
