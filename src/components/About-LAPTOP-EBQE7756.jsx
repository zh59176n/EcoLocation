// components/About.jsx
import React from 'react';
import Counter from './Counter';

function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-300 dark:from-green-800 dark:to-green-900 text-center px-4 transition-all duration-300">
      <h1 className="text-5xl font-bold text-green-800 dark:text-green-200 mb-6">
        About EcoLocation
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mb-8">
        EcoLocation is designed to help users find sustainable and environmentally friendly locations. Our mission is to make eco-conscious living easier for everyone.
      </p>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-green-400 max-w-md w-full">
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 flex items-center justify-center mb-3">
          🌿 Track Your Green Actions
        </h2>
        <p className="text-md text-gray-600 dark:text-gray-300 mb-4">
          Earn <span className="font-semibold text-green-600">Green Points</span> by doing something eco-friendly today.
        </p>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md shadow-inner">
          <Counter />
        </div>
      </div>
    </div>
  );
}

export default About;
