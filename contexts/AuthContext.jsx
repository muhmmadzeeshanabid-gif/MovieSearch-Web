import { createContext, useContext, useEffect, useState } from "react";
import { getUser, login as loginUser, logout as logoutUser, signup as signupUser } from "@/lib/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setIsReady(true);
  }, []);

  const login = (email, password) => {
    const currentUser = loginUser(email, password);
    setUser(currentUser);
  };

  const signup = (name, email, password) => {
    const currentUser = signupUser(name, email, password);
    setUser(currentUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, isReady, login, signup, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
