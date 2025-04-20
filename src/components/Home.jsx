import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Firebase";

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
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-12 bg-gradient-to-b from-green-100 via-emerald-100 to-lime-200 dark:from-green-800 dark:via-emerald-800 dark:to-green-900 text-gray-900 dark:text-gray-100 transition-all duration-300 overflow-hidden">

      {/* 🌍 Spinning Earth */}
      <div className="text-5xl mb-4 animate-spin-slow">🌍</div>

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
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition duration-200 flex items-center gap-2"
          >
            ✍️ Get Started
          </Link>
          <Link
            to="/login"
            className="border border-green-600 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800 font-semibold px-8 py-3 rounded-lg shadow transition duration-200 flex items-center gap-2"
          >
            🔐 Returning User
          </Link>
          <Link
            to="/about"
            className="bg-white dark:bg-transparent border border-green-600 text-green-800 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-800 font-semibold px-8 py-3 rounded-lg shadow transition duration-200 flex items-center gap-2"
          >
            ℹ️ Learn More
          </Link>
        </div>
      )}

      {/* 💬 Rotating Quote */}
      <div
        key={quoteIndex}
        className={`mt-4 max-w-2xl bg-white/80 dark:bg-[#2f2f2f]/80 border border-green-300 dark:border-green-700 rounded-md shadow p-6 text-lg italic text-green-900 dark:text-green-200 transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {quotes[quoteIndex]}
      </div>

      {/* 🌍 Custom CSS for spin */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Home;
