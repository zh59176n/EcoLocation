import React, { useState, useEffect } from 'react';

const ecoQuotes = [
  "The Earth is what we all have in common. — Wendell Berry",
  "In nature, nothing exists alone. — Rachel Carson",
  "The future depends on what you do today. — Mahatma Gandhi",
  "We do not inherit the Earth from our ancestors; we borrow it from our children. — Native American Proverb",
  "One small action, one giant impact. 🌎",
];

function About() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [co2Saved, setCo2Saved] = useState(0);
  const [stationsFound, setStationsFound] = useState(0);
  const [solarConnections, setSolarConnections] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % ecoQuotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const counter = setInterval(() => {
      setCo2Saved((prev) => Math.min(prev + 5, 10000));
      setStationsFound((prev) => Math.min(prev + 1, 1200));
      setSolarConnections((prev) => Math.min(prev + 1, 800));
    }, 50);
    return () => clearInterval(counter);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-green-200 to-green-300 dark:from-green-800 dark:via-green-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 py-12 px-6 transition-all">

      {/* Parallax Section */}
      <div className="relative overflow-hidden rounded-xl mb-16">
        <div className="bg-fixed bg-center bg-cover h-64 flex items-center justify-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')" }}>
          <div className="bg-black bg-opacity-50 w-full h-full flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white animate-pulse">
              Why We Exist: Make Eco Living Easy 🌿
            </h1>
          </div>
        </div>
      </div>

      {/* Global Impact Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
        <div className="bg-white dark:bg-green-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-300">{co2Saved.toLocaleString()} kg</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">CO₂ Saved Globally</p>
        </div>
        <div className="bg-white dark:bg-green-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-300">{stationsFound.toLocaleString()}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">EV Stations Found</p>
        </div>
        <div className="bg-white dark:bg-green-900 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-green-700 dark:text-green-300">{solarConnections.toLocaleString()}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Solar Connections Made</p>
        </div>
      </div>

      {/* Eco Stories */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">🌱 Real Eco Stories</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md">
            <p className="italic">"Using EcoLocation helped me find a solar installer within 5 miles!"</p>
            <p className="mt-2 font-semibold">- Sarah, Brooklyn</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md">
            <p className="italic">"Tracking my footprint motivated me to switch to an electric car."</p>
            <p className="mt-2 font-semibold">- Jamal, Queens</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-6 rounded-lg shadow-md">
            <p className="italic">"The weekly challenges made it fun to be more eco-conscious."</p>
            <p className="mt-2 font-semibold">- Lina, Manhattan</p>
          </div>
        </div>
      </div>

      {/* Explore Grid */}
      <div className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">🔎 Explore Your Power</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-green-900 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold text-lg text-green-700 dark:text-green-300 mb-2">⚡ EV Charging</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Find EV stations near you in seconds.</p>
          </div>
          <div className="bg-white dark:bg-green-900 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold text-lg text-yellow-600 mb-2">☀️ Solar Providers</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Explore sustainable solar energy options.</p>
          </div>
          <div className="bg-white dark:bg-green-900 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold text-lg text-blue-600 mb-2">🧮 Carbon Calculator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Estimate your carbon footprint easily.</p>
          </div>
          <div className="bg-white dark:bg-green-900 p-6 rounded-lg shadow hover:scale-105 transition-transform">
            <h3 className="font-semibold text-lg text-pink-600 mb-2">🏆 Weekly Challenges</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Compete and win eco badges!</p>
          </div>
        </div>
      </div>

      {/* Eco Quotes Rotating Wall */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold mb-6">💬 Get Inspired</h2>
        <blockquote className="italic text-xl text-green-800 dark:text-green-300 transition-opacity animate-fade-in">
          {ecoQuotes[quoteIndex]}
        </blockquote>
      </div>

      {/* CTA Button */}
      <div className="text-center">
        <a href="/solar" className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-lg transition-all">
          Start Your Eco Journey
        </a>
      </div>
    </div>
  );
}

export default About;
