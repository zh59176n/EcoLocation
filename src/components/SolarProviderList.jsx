// src/components/SolarProviderList.jsx
import React, { useState } from 'react';
import SolarProviderDetails from './SolarProviderDetails.jsx';
import House from './House';

const SolarProviderList = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);

  const solarProviders = [
    { id: 1, name: 'SunPower', location: 'California', rating: 4.5 },
    { id: 2, name: 'Tesla Solar', location: 'Nevada', rating: 4.7 },
    { id: 3, name: 'Vivint Solar', location: 'Utah', rating: 4.3 },
  ];

  const handleMoreInfo = (provider) => setSelectedProvider(provider);
  const handleCloseModal = () => setSelectedProvider(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Solar Providers</h1>
      <House /> {/* Leaflet map */}
      <ul className="space-y-4 mt-6">
        {solarProviders.map((provider) => (
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

      {selectedProvider && (
        <SolarProviderDetails
          provider={selectedProvider}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default SolarProviderList;
