import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <p className="text-7xl font-bold text-green-600 dark:text-green-400">404</p>
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4">
        Page not found
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
