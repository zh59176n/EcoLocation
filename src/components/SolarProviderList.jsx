import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import app from '../Firebase';
import House from './House';

const db = getFirestore(app);

const SolarProviderList = () => {
  const [solarProviders, setSolarProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const fetchSolarProviders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'solar_providers'));
        const providers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSolarProviders(providers);
      } catch (error) {
        console.error('⚠️ Failed to load solar provider data:', error);
      }
    };

    fetchSolarProviders();
  }, []);

  const handleMoreInfo = (provider) => setSelectedProvider(provider);
  const handleCloseModal = () => setSelectedProvider(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nearby Solar Providers</h1>
      <House /> {/* Leaflet map */}
      <ul className="space-y-4 mt-6">
        {solarProviders.length === 0 ? (
          <p className="text-gray-500"></p>
        ) : (
          solarProviders.map((provider) => (
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
          ))
        )}
      </ul>
    </div>
  );
};

export default SolarProviderList;
