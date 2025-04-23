import React, { useState } from 'react';
import House from './House';

const providers = [
  {
    id: 1,
    name: 'SolarCity NYC',
    location: 'Brooklyn, NY',
    rating: 4.8,
    address: '123 Green Rd',
  },
  {
    id: 2,
    name: 'Bright Future Solar',
    location: 'Queens, NY',
    rating: 4.5,
    address: '456 Sunshine Ave',
  },
];

const SolarProviderList = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);

  const handleMoreInfo = (provider) => setSelectedProvider(provider);
  const handleCloseModal = () => setSelectedProvider(null);

  return (
    <div className="pt-20 px-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Solar Providers</h1>

      {/* ✅ Replaced EVMapCluster with House */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-md border border-green-300 dark:border-green-700">
        <House />
      </div>

      {/* ✅ Original provider cards */}
      <ul className="space-y-4 mt-6">
        {providers.map((provider) => (
          <li
            key={provider.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{provider.name}</h2>
            <p>{provider.location}</p>
            <p>⭐ {provider.rating}</p>
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => handleMoreInfo(provider)}
            >
              More Info
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SolarProviderList;
