const AUTH_KEY = "cineverse_user";

export function getUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const data = window.localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function login(email) {
  const user = { email, name: email.split("@")[0] };
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function signup(name, email) {
  const user = { email, name };
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_KEY);
  }
}
