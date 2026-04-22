import { useCallback, useRef, useState } from "react";
import { getMovieTrailer } from "@/lib/tmdb";

const initialState = {
  open: false,
  movie: null,
  trailer: null,
  loading: false,
  error: null,
};

export function useTrailerPlayer() {
  const [trailerState, setTrailerState] = useState(initialState);
  const requestIdRef = useRef(0);

  const closeTrailer = useCallback(() => {
    requestIdRef.current += 1;
    setTrailerState((previous) => ({
      ...previous,
      open: false,
      loading: false,
    }));

    if (typeof document !== "undefined" && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const openTrailer = useCallback(async (movie) => {
    if (!movie?.id) {
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    setTrailerState({
      open: true,
      movie,
      trailer: null,
      loading: true,
      error: null,
    });

    const trailer = await getMovieTrailer(movie.id);

    if (requestId !== requestIdRef.current) {
      return;
    }

    setTrailerState({
      open: true,
      movie,
      trailer,
      loading: false,
      error: trailer ? null : "Trailer not available right now.",
    });
  }, []);

  return {
    trailerState,
    openTrailer,
    closeTrailer,
  };
}
