const API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";
const runtimeCache = new Map();
const trailerCache = new Map();

export function posterUrl(path, size = "w500") {
  return path ? `${IMAGE_BASE}/${size}${path}` : "/placeholder.svg";
}

export function backdropUrl(path) {
  return path ? `${IMAGE_BASE}/original${path}` : null;
}

async function get(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB error: ${response.status}`);
  }

  return response.json();
}

export function searchMovies(query, page = 1) {
  return get("/search/movie", { query, page });
}

export function getTrending(page = 1) {
  return get("/trending/movie/week", { page });
}

export function getByGenre(genreId, page = 1) {
  return get("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
  });
}

export function getMovieDetails(id) {
  return get(`/movie/${id}`);
}

export async function getMovieRuntime(id) {
  if (!id) {
    return null;
  }

  if (runtimeCache.has(id)) {
    return runtimeCache.get(id);
  }

  const runtimePromise = getMovieDetails(id)
    .then((movie) => movie.runtime ?? null)
    .catch(() => null);

  runtimeCache.set(id, runtimePromise);
  return runtimePromise;
}

export function getYouTubeEmbedUrl(key) {
  return key
    ? `https://www.youtube-nocookie.com/embed/${key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : null;
}

export function getMovieVideos(id) {
  return get(`/movie/${id}/videos`);
}

function scoreTrailer(video) {
  const type = String(video.type || "").toLowerCase();
  const name = String(video.name || "").toLowerCase();
  let score = 0;

  if (video.site === "YouTube") {
    score += 100;
  }

  if (type === "trailer") {
    score += 60;
  } else if (type === "teaser") {
    score += 35;
  } else if (type === "clip") {
    score += 10;
  }

  if (video.official) {
    score += 20;
  }

  if (name.includes("official")) {
    score += 10;
  }

  if (name.includes("trailer")) {
    score += 5;
  }

  return score;
}

export async function getMovieTrailer(id) {
  if (!id) {
    return null;
  }

  if (trailerCache.has(id)) {
    return trailerCache.get(id);
  }

  const trailerPromise = getMovieVideos(id)
    .then((data) => {
      const videos = Array.isArray(data.results) ? data.results : [];
      const youtubeVideos = videos.filter((video) => video.site === "YouTube" && video.key);

      if (!youtubeVideos.length) {
        return null;
      }

      return youtubeVideos.sort((a, b) => {
        const scoreDiff = scoreTrailer(b) - scoreTrailer(a);
        if (scoreDiff !== 0) {
          return scoreDiff;
        }

        const dateA = Date.parse(a.published_at || "") || 0;
        const dateB = Date.parse(b.published_at || "") || 0;
        return dateB - dateA;
      })[0];
    })
    .catch(() => null);

  trailerCache.set(id, trailerPromise);
  return trailerPromise;
}

export function getSimilarMovies(id) {
  return get(`/movie/${id}/similar`);
}

export const GENRES = [
  { id: 35, name: "Comedy" },
  { id: 10749, name: "Romantic" },
  { id: 28, name: "Action" },
  { id: 27, name: "Horror" },
  { id: 53, name: "Thriller" },
];
