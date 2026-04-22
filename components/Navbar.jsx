import Link from "next/link";
import { Film, LogIn, LogOut, MoonStar, SunMedium, User, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/95 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Film className="w-8 h-8 text-primary" />
          <span className="font-display text-3xl tracking-wider hidden sm:block">
            <span className="text-foreground">CINE</span>
            <span className="text-primary">VERSE</span>
          </span>
        </Link>

        <div className="flex-1" />

        <button
          type="button"
          onClick={toggleTheme}
          role="switch"
          aria-checked={theme === "light"}
          className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:border-primary/50"
          aria-label="Toggle website color theme"
          title="Toggle website color theme"
        >
          <MoonStar className="w-4 h-4 text-muted-foreground" />
          <span className={`relative h-7 w-12 rounded-full border transition-colors ${theme === "light" ? "border-primary/40 bg-primary/20" : "border-border bg-secondary"}`}>
            <span
              className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-background shadow transition-transform duration-200 ${theme === "light" ? "translate-x-5" : "translate-x-0"}`}
            />
          </span>
          <SunMedium className="w-4 h-4 text-primary" />
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/favorites" className="text-sm text-secondary-foreground hover:text-foreground transition-colors">
              Favorites
            </Link>
            <span className="flex items-center gap-1.5 text-sm text-secondary-foreground">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.name}</span>
            </span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-secondary-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 text-sm text-secondary-foreground hover:text-foreground transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 px-5 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
