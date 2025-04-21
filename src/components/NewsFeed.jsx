import React, { useState } from "react";

const dummyArticles = [
  {
    title: "Cities Turn Rooftops Green to Fight Urban Heat",
    description: "Cities are incentivizing rooftop gardens and solar panels to combat climate change.",
    full: "With rising urban temperatures, many cities are offering grants to install rooftop vegetation and solar arrays to reduce heat and pollution.",
    url: "#"
  },
  {
    title: "10 Eco-Friendly Habits to Start Today",
    description: "From composting to reducing single-use plastic, here are easy daily sustainability wins.",
    full: "Even small changes like using reusable shopping bags, walking instead of driving, or composting kitchen waste can significantly reduce your environmental impact.",
    url: "#"
  },
  {
    title: "Electric Vehicle Charging Gets Easier",
    description: "A federal rollout of EV infrastructure aims to eliminate range anxiety.",
    full: "New public-private partnerships will install thousands of new fast-charging stations across underserved areas, improving access for all EV drivers.",
    url: "#"
  },
  {
    title: "Recycled Plastic Roads Take Off Globally",
    description: "Paving roads with plastic waste is a growing innovation in green infrastructure.",
    full: "These roads are cheaper and more durable while providing a new use for single-use plastics, which are otherwise landfill-bound or incinerated.",
    url: "#"
  },
  {
    title: "Youth Climate Movement Gains Momentum",
    description: "Young leaders are shaping policy and driving action with global climate strikes.",
    full: "Movements like Fridays for Future are holding governments accountable, pushing legislation, and building coalitions for a livable future.",
    url: "#"
  },
  {
    title: "Top 5 Renewable Energy Breakthroughs of 2025",
    description: "From algae fuel to transparent solar glass, innovation leads the way.",
    full: "Green tech startups and researchers are revolutionizing how we generate, store, and use energy in more sustainable ways than ever.",
    url: "#"
  },
];

function NewsFeed() {
  const [modalArticle, setModalArticle] = useState(null);

  return (
    <main className="px-4 py-8 md:px-8 lg:px-32 min-h-screen bg-green-300 dark:bg-green-900 text-black dark:text-white">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-green-600 dark:text-green-400">🌿 Eco Newsroom</h1>
        <p className="text-lg mt-2 text-gray-700 dark:text-gray-300">
          Stay updated with the latest in sustainability, green tech, and climate action.
        </p>
      </header>

      {/* Scrollable List */}
      <section className="max-h-[75vh] overflow-y-auto space-y-6 pr-2">
        {dummyArticles.map((article, index) => (
          <div
            key={index}
            className="bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-green-500 hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">{article.title}</h2>
            <p className="text-gray-800 dark:text-gray-200">{article.description}</p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setModalArticle(article)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Quick Summary
              </button>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded hover:opacity-90 text-center"
              >
                Read Full Article
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Modal */}
      {modalArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
              {modalArticle.title}
            </h2>
            <p>{modalArticle.full}</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalArticle(null)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default NewsFeed;
