import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

// 🌿 Rotating inspirational quotes
const quotes = [
  "“A small step toward sustainability makes a big difference over time.”",
  "“Green choices today grow a better tomorrow.”",
  "“The earth is what we all have in common.” — Wendell Berry",
  "“Live simply so others may simply live.” — Gandhi",
  "“One action a day keeps the pollution away.”",
];

function Home() {
  const [user] = useAuthState(auth);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fade, setFade] = useState(true);

  if (user) return <Navigate to="/dashboard" replace />;

  // Handle rotating quotes
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 400);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 text-gray-900 dark:text-gray-100 overflow-hidden">

      {/* Aurora blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-[480px] h-[480px] rounded-full bg-emerald-400/45 dark:bg-emerald-400/30 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-20 w-[360px] h-[360px] rounded-full bg-lime-300/40 dark:bg-lime-300/20 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] rounded-full bg-green-400/35 dark:bg-green-400/25 blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
      </div>

      {/* 🌍 Spinning Earth */}
      <div className="text-5xl mb-4 animate-spin-slow" role="img" aria-label="Earth">🌍</div>

      {/* Heading */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-green-800 dark:text-green-100 mb-6 drop-shadow-lg">
        Welcome to EcoLocation
      </h1>

      {/* Subheading */}
      <p className="text-xl md:text-2xl max-w-3xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
        EcoLocation helps you live sustainably by connecting you to local EV stations, solar providers, and daily eco challenges — all while tracking your green impact 
      </p>

      {/* Auth-Aware Buttons */}
      {!user && (
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link
            to="/register"
            className="bg-green-600 hover:bg-green-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-400/60 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            <span aria-hidden="true">✍️</span> Get Started
          </Link>
          <Link
            to="/login"
            className="border border-green-600 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 font-semibold px-8 py-3 rounded-lg shadow-md shadow-green-400/30 hover:shadow-lg hover:shadow-green-400/50 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            <span aria-hidden="true">🔐</span> Returning User
          </Link>
          <Link
            to="/about"
            className="bg-white/70 dark:bg-transparent border border-green-600 text-green-800 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-800 font-semibold px-8 py-3 rounded-lg shadow-md shadow-green-400/30 hover:shadow-lg hover:shadow-green-400/50 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
          >
            <span aria-hidden="true">ℹ️</span> Learn More
          </Link>
        </div>
      )}

      {/* 💬 Rotating Quote */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="mt-4 max-w-2xl w-full"
      >
        <div
          key={quoteIndex}
          className={`bg-white/30 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-2xl shadow-lg p-6 text-lg italic text-green-900 dark:text-green-100 transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {quotes[quoteIndex]}
        </div>
      </div>

    </div>
  );
}

export default Home;
