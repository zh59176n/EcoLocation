import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "⚡",
    title: "EV Charging Finder",
    desc: "Locate nearby charging stations in real time using live OpenChargeMap data, with custom filters and a favorites system.",
    color: "text-green-600 dark:text-green-400",
  },
  {
    icon: "🧮",
    title: "Carbon Calculator",
    desc: "Estimate your daily CO₂ footprint across transport, energy, flights, and diet — powered by EPA eGRID 2022 and IPCC AR6 factors.",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: "🏆",
    title: "Weekly Challenges",
    desc: "Take on eco challenges, check off daily progress, and see where you rank on a live leaderboard.",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: "📰",
    title: "Green News",
    desc: "Stay informed with curated environmental news from The Guardian — filterable by topic and searchable.",
    color: "text-emerald-600 dark:text-emerald-400",
  },
];

const stats = [
  { value: "16 tons", label: "Average American's annual CO₂ output — 2× the global average" },
  { value: "2× faster", label: "The rate climate change accelerates without individual action" },
  { value: "1 tree", label: "Absorbs ~21 kg of CO₂ per year — every reduction counts" },
];

function About() {
  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-100">

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div
          className="h-72 sm:h-80 bg-fixed bg-center bg-cover flex items-center justify-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542281286-9e0a16bb7366?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')" }}
        >
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 text-center px-6">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Your green impact, <span className="text-green-400">simplified.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-xl mx-auto">
              EcoLocation gives you the tools to measure, reduce, and track your environmental footprint — one day at a time.
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
          Why we built this
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
          Most people want to live more sustainably but don't know where to start.
          EcoLocation removes the guesswork — connecting you to EV infrastructure near you,
          showing you exactly where your emissions come from, and making eco habits something
          you can compete over with friends.
        </p>
      </section>

      {/* Real stats */}
      <section className="bg-white/40 dark:bg-black/20 backdrop-blur-sm border-y border-white/20 dark:border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-300">{s.value}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
          Sources: EPA, IPCC AR6, Nature Climate Change
        </p>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 dark:text-green-200 mb-10">
          Everything you need to make an impact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-white/30 dark:border-white/10 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <span className={`text-3xl`}>{f.icon}</span>
              <h3 className={`mt-3 text-lg font-bold ${f.color}`}>{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 pb-20">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">
          Ready to see your impact?
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
          Create a free account and start tracking in under two minutes.
        </p>
        <Link
          to="/register"
          className="inline-block bg-green-600 hover:bg-green-500 text-white font-semibold px-10 py-3 rounded-full shadow-lg shadow-green-500/40 hover:shadow-green-400/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
        >
          Get started — it's free
        </Link>
      </section>

    </div>
  );
}

export default About;
