import React, { useState } from 'react';
import SolarProviderDetails from './SolarProviderDetails.jsx';

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

  const handleMoreInfo = (provider) => setSelectedProvider(provider);
  const handleCloseModal = () => setSelectedProvider(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Solar Providers</h1>

      <input
        type="text"
        placeholder="Enter an address..."
        className="w-full mb-4 px-4 py-2 border rounded shadow-sm"
      />

      <div className="bg-green-100 border border-green-300 p-4 mb-6 rounded text-center text-sm text-green-600">
        (🗺️ Map will be displayed here)
      </div>

      {solarProviders.map((provider) => (
        <div key={provider.id} className="bg-white rounded shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold text-green-700">{provider.name}</h2>
          <p>📍 Distance: {provider.distance}</p>
          <p>⭐ Rating: {provider.rating}</p>
          <button
            onClick={() => handleMoreInfo(provider)}
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            More Info ➡
          </button>
        </div>
      ))}

      {/* Modal for Details */}
      {selectedProvider && (
        <SolarProviderDetails provider={selectedProvider} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SolarProviderList;
