// components/About.jsx
import React from 'react';

function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-green-300 dark:from-green-800 dark:to-green-900 text-center px-4 transition-all duration-300">
      <h1 className="text-5xl font-bold text-green-800 dark:text-green-200 mb-6">
        About EcoLocation
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mb-8">
        EcoLocation is designed to help users find sustainable and environmentally friendly locations. Our mission is to make eco-conscious living easier for everyone.
      </p>
    </div>
  );
}

export default About;
