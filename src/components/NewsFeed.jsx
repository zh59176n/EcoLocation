import React, { useState, useEffect, useCallback } from "react";
import { FaSearch } from "react-icons/fa";

const TOPICS = [
  { key: "all",      label: "All" },
  { key: "climate",  label: "Climate" },
  { key: "energy",   label: "Energy" },
  { key: "wildlife", label: "Wildlife" },
  { key: "policy",   label: "Policy" },
  { key: "science",  label: "Science" },
];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function readTime(wordCount) {
  return Math.max(1, Math.ceil(wordCount / 200));
}

function ArticleSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      </div>
    </div>
  );
}

function ArticleCard({ article }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 group">
      {article.thumbnail && !imgFailed ? (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgFailed(true)}
        />
      ) : (
        <div className="w-full h-48 bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <span className="text-5xl">🌿</span>
        </div>
      )}

      <div className="p-4 flex flex-col flex-grow">
        {article.section && (
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-2">
            {article.section}
          </span>
        )}

        <h2 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {article.title}
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 flex-grow mb-3">
          {article.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-3">
          <span>{article.date ? formatDate(article.date) : ""}</span>
          {article.wordCount > 0 && (
            <span>{readTime(article.wordCount)} min read</span>
          )}
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-green-600 dark:text-green-400 hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 rounded self-start"
        >
          Read article →
        </a>
      </div>
    </article>
  );
}

export default function NewsFeed() {
  const [articles, setArticles]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError]             = useState(null);
  const [activeTopic, setActiveTopic] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);

  const fetchArticles = useCallback(async (topic, query, pageNum, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    setError(null);

    try {
      const params = new URLSearchParams({ topic, page: pageNum });
      if (query.trim()) params.set("q", query.trim());

      const res = await fetch(`/eco-news?${params}`);
      if (!res.ok) throw new Error("Failed to load news");
      const data = await res.json();

      const valid = (data.articles ?? []).filter(
        (a) => a.title && a.description && a.description.length > 30
      );

      setArticles((prev) => (append ? [...prev, ...valid] : valid));
      setHasMore(pageNum < (data.totalPages ?? 1) && valid.length > 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchArticles(activeTopic, searchQuery, 1, false);
  }, [activeTopic]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchArticles(activeTopic, searchQuery, 1, false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchArticles(activeTopic, searchQuery, next, true);
  };

  return (
    <main className="px-4 py-8 md:px-8 lg:px-16 max-w-7xl mx-auto">
      <section
        className="bg-green-200 dark:bg-green-700 rounded-xl p-6 mb-8 text-center"
        aria-labelledby="newsfeed-header"
      >
        <h1 id="newsfeed-header" className="text-3xl font-bold text-gray-800 dark:text-white">
          Eco News
        </h1>
        <p className="mt-2 text-gray-700 dark:text-gray-200">
          Stay current with environmental news powered by The Guardian.
        </p>
      </section>

      <div className="space-y-4 mb-8">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search eco news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            aria-label="Search articles"
          />
        </div>

        <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter by topic">
          {TOPICS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={activeTopic === t.key}
              onClick={() => setActiveTopic(t.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTopic === t.key
                  ? "bg-green-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-green-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <section aria-live="polite">
        {error && (
          <div role="alert" className="text-red-600 text-center mb-6 bg-red-50 dark:bg-red-900 rounded-lg p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6).fill(0).map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-4xl mb-4">🔍</p>
            <p>No articles found. Try a different topic or search term.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard key={`${article.url}-${i}`} article={article} />
            ))}
          </div>
        )}

        {!loading && hasMore && (
          <div className="text-center mt-10">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
