// src/components/About.jsx
import React from 'react';

function About() {
  return (
    <div className="max-w-screen-lg mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-green-700 dark:text-green-300">About EcoLocation</h1>
      <p className="text-lg text-gray-800 dark:text-gray-200">
        EcoLocation is dedicated to helping users find clean energy solutions,
        from EV charging stations to renewable energy providers and government incentives.
      </p>
    </div>
  );
}

export default About;
