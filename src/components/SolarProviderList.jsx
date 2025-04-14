import React, { useState } from 'react';
import SolarProviderDetails from './SolarProviderDetails.jsx';
import House from './House'; // ✅ import Leaflet map

const solarProviders = [
  {
    id: 1,
    name: "SunPower Solar",
    distance: "3.2 miles",
    rating: 4.8,
    address: "123 Solar Ave, San Diego, CA",
    description: "Leading provider of clean solar energy solutions for homes and businesses.",
  },
  {
    id: 2,
    name: "GreenLight Energy",
    distance: "5.1 miles",
    rating: 4.5,
    address: "456 Eco Rd, Austin, TX",
    description: "Affordable and efficient residential solar installations.",
  },
];

const SolarProviderList = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = solarProviders.filter((provider) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMoreInfo = (provider) => setSelectedProvider(provider);
  const handleCloseModal = () => setSelectedProvider(null); // ✅ THIS WAS CUT OFF

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
        🌞 Solar Providers Near You
      </h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search providers or locations..."
        className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded shadow-sm dark:bg-gray-800 dark:text-white"
      />

      {/* ✅ Map Debug Box */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-md border border-green-300 dark:border-green-700">
  <House />
</div>


      {filteredProviders.map((provider) => (
        <div
          key={provider.id}
          className="bg-white dark:bg-gray-800 rounded shadow-md p-4 mb-4 transition-transform transform hover:scale-105"
        >
          <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
            {provider.name}
          </h2>
          <p className="dark:text-gray-300">📍 Distance: {provider.distance}</p>
          <p className="dark:text-gray-300">⭐ Rating: {provider.rating}</p>
          <button
            onClick={() => handleMoreInfo(provider)}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            More Info ➡
          </button>
        </div>
      ))}

      {selectedProvider && (
        <SolarProviderDetails provider={selectedProvider} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SolarProviderList;
