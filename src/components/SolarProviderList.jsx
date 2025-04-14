import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import SolarProviderDetails from './SolarProviderDetails.jsx';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

const SolarProviderList = () => {
  const [solarProviders, setSolarProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "solar_providers"));
        const providers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSolarProviders(providers);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch providers:", err);
      }
    };

    fetchProviders();
  }, []);

  const filteredProviders = solarProviders.filter((provider) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMoreInfo = (provider) => setSelectedProvider(provider);
  const handleCloseModal = () => setSelectedProvider(null);

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-800 dark:text-gray-100">
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

      <div className="mb-6">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={4}
          >
            {filteredProviders.map((provider) => (
              provider.lat && provider.lng && (
                <Marker
                  key={provider.id}
                  position={{ lat: provider.lat, lng: provider.lng }}
                  title={provider.name}
                />
              )
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Loading providers...</p>
      ) : (
        filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className="bg-white dark:bg-gray-800 rounded shadow-md p-4 mb-4 transition-transform transform hover:scale-105"
          >
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-300">
              {provider.name}
            </h2>
            <p className="dark:text-gray-300">📍 Address: {provider.address}</p>
            <p className="dark:text-gray-300">⭐ Rating: {provider.rating}</p>
            <button
              onClick={() => handleMoreInfo(provider)}
              className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              More Info ➡
            </button>
          </div>
        ))
      )}

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