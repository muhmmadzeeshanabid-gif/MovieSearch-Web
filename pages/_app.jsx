import Head from "next/head";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Head>
          <title>MovieSearch | Discover Movies Your Way</title>
          <meta
            name="description"
            content="MovieSearch is a cinematic movie browser with search, favorites, and a light/dark theme switch."
          />
          <meta name="theme-color" content="#0f172a" />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
