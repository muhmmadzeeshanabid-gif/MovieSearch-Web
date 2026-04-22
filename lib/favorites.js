const FAVORITES_KEY = "movie_favorites";

export function getFavorites() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(id) {
  const favorites = getFavorites();
  const existingIndex = favorites.indexOf(id);

  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.push(id);
  }

  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return existingIndex < 0;
}

export function isFavorite(id) {
  return getFavorites().includes(id);
}
