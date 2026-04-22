import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, Heart, Play, Star } from "lucide-react";
import { motion } from "framer-motion";
import RecommendationRow from "@/components/RecommendationRow";
import NoticeModal from "@/components/NoticeModal";
import TrailerModal from "@/components/TrailerModal";
import { useAuth } from "@/contexts/AuthContext";
import { useTrailerPlayer } from "@/hooks/useTrailerPlayer";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { backdropUrl, getMovieDetails, getSimilarMovies, posterUrl } from "@/lib/tmdb";

export default function MovieDetailPage() {
  const router = useRouter();
  const movieId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [notice, setNotice] = useState(null);
  const { trailerState, openTrailer, closeTrailer } = useTrailerPlayer();
  const { user } = useAuth();

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!movieId) {
      setLoading(false);
      return;
    }

    const numericId = Number(movieId);
    if (Number.isNaN(numericId)) {
      setLoading(false);
      return;
    }

    setMovie(null);
    setSimilar([]);
    setFavorite(false);
    setLoading(true);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    Promise.all([getMovieDetails(numericId), getSimilarMovies(numericId)])
      .then(([details, similarResponse]) => {
        setMovie(details);
        setSimilar((similarResponse.results || []).slice(0, 15));
        setFavorite(isFavorite(details.id));
      })
      .catch((error) => {
        console.error(error);
        setMovie(null);
      })
      .finally(() => setLoading(false));
  }, [movieId, router.isReady]);

  const handleFavorite = () => {
    if (!movie) {
      return;
    }

    if (!user) {
      setNotice({
        title: "Login required",
        description: "Please login to add movies to your favorites.",
        actionLabel: "Go to login",
        onAction: () => router.push("/login"),
      });
      return;
    }

    const added = toggleFavorite(movie.id);
    setFavorite(added);
    setNotice({
      title: added ? "Added to Favorites" : "Removed from Favorites",
      description: added
        ? "This movie has been saved to your favorites list."
        : "This movie has been removed from your favorites list.",
      actionLabel: null,
      onAction: null,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-[60vh] skeleton-shimmer" />
        <div className="container mx-auto px-4 py-8 space-y-4">
          <div className="h-10 w-1/2 skeleton-shimmer rounded" />
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 text-center">
        Movie not found.
      </div>
    );
  }

  const backgroundImage = backdropUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen bg-background">
      <TrailerModal
        open={trailerState.open}
        movie={trailerState.movie}
        trailer={trailerState.trailer}
        loading={trailerState.loading}
        error={trailerState.error}
        onClose={closeTrailer}
      />
      <NoticeModal
        open={Boolean(notice)}
        title={notice?.title}
        description={notice?.description}
        onClose={() => setNotice(null)}
        actionLabel={notice?.actionLabel}
        onAction={() => {
          const action = notice?.onAction;
          setNotice(null);
          if (action) {
            action();
          }
        }}
      />

      <div className="relative h-[60vh] min-h-[350px]">
        {backgroundImage && <img src={backgroundImage} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-background/50" />

        <Link href="/" className="absolute top-6 left-6 z-10 p-2 rounded-full bg-background/60 backdrop-blur-sm text-foreground hover:bg-background/80 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10 pb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row gap-8">
          <img src={posterUrl(movie.poster_path, "w500")} alt={movie.title} className="w-48 md:w-64 rounded-lg shadow-2xl shrink-0 self-start" />
          <div className="space-y-4 flex-1">
            <h1 className="font-display text-4xl md:text-6xl text-foreground tracking-wider">{movie.title}</h1>

            {movie.tagline && <p className="text-muted-foreground italic text-lg">"{movie.tagline}"</p>}

            <div className="flex flex-wrap gap-3 text-sm text-secondary-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                {movie.vote_average?.toFixed ? movie.vote_average.toFixed(1) : movie.vote_average}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {movie.release_date}
              </span>
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {movie.runtime} min
                </span>
              )}
            </div>

            {Array.isArray(movie.genres) && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-secondary-foreground leading-relaxed max-w-2xl">{movie.overview}</p>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => openTrailer(movie)}
                className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
              >
                <Play className="w-5 h-5 fill-current" /> Play Trailer
              </button>
              <button
                type="button"
                onClick={handleFavorite}
                className={`flex items-center gap-2 px-6 py-3 rounded-md font-semibold transition-colors ${
                  favorite
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                <Heart className={`w-5 h-5 ${favorite ? "fill-primary text-primary" : ""}`} />
                {favorite ? "Favorited" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </motion.div>

        {similar.length > 0 && (
          <div className="mt-16">
            <RecommendationRow title="SIMILAR MOVIES" movies={similar} onPlayTrailer={openTrailer} />
          </div>
        )}
      </div>
    </div>
  );
}
