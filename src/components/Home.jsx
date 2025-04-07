import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-300 dark:from-green-900 dark:to-green-950 text-center px-4 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <h1 className="text-5xl font-bold text-green-800 mb-6">Welcome to EcoLocation 🌿</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mb-8">
        This is the home page for your awesome app! Use this space to explain what your app does, why it’s helpful, or show sample data.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-green-600 text-white px-6 py-3 rounded-md transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          Go to Login
        </Link>
        <Link
          to="/about"
          className="bg-white border border-green-600 text-green-800 px-6 py-3 rounded-md transition-colors duration-200 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          About Page
        </Link>
      </div>
    </div>
  );
}

export default Home;
