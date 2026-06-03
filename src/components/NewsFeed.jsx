import React, { useState, useEffect } from "react";

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

function ArticleSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col animate-pulse">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      <div className="space-y-2 flex-grow">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-4" />
    </div>
  );
}

function NewsFeed() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 9;

  useEffect(() => {
    fetch("/eco-news")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        const validArticles = data.articles.filter(
          (article) =>
            article.title &&
            article.description &&
            stripHtmlTags(article.description).length > 30
        );
        setArticles(validArticles.map((article) => ({
          ...article,
          title: stripHtmlTags(article.title),
          description: stripHtmlTags(article.description),
        })));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Calculate the range of articles to display.
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <main className="px-4 py-8 md:px-8 lg:px-16">
      {/* Hero/Header Section */}
      <section
        className="bg-green-200 dark:bg-green-700 rounded-lg p-6 mb-8 text-center"
        aria-labelledby="newsfeed-header"
      >
        <h1 id="newsfeed-header" className="text-3xl font-bold text-gray-800 dark:text-white">
          Eco-Friendly Newsfeed
        </h1>
        <p className="mt-2 text-lg text-gray-700 dark:text-gray-200">
          Stay informed with the latest updates on sustainability and environmental news.
        </p>
      </section>

      {/* Articles Section */}
      <section aria-live="polite">
        {error && (
          <div role="alert" className="text-red-600 text-center mb-4">
            Error: {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array(9).fill(0).map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {currentArticles.map((article, index) => (
            <article
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col"
            >
              <header>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {article.title}
                </h2>
              </header>
              <p className="flex-grow text-gray-700 dark:text-gray-300 mb-4">
                {article.description}
              </p>
              <footer>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-blue-500 dark:text-blue-300 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
                >
                  Read more
                </a>
              </footer>
            </article>
          ))}
        </div>
        )}

        {/* Pagination Controls */}
        {articles.length > articlesPerPage && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Previous
            </button>
            <span className="text-gray-800 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

export default NewsFeed;
