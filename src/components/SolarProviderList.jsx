import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SolarProviderDetails from "./SolarProviderDetails.jsx";

const SolarProviderList = () => {
  const [solarProviders, setSolarProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const snapshot = await getDocs(collection(db, "solar_providers"));
        const providers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSolarProviders(providers);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch solar providers:", err.message);
      }
    };

    fetchProviders();
  }, []);

  const handleMoreInfo = (provider) => setSelectedProvider(provider);
  const handleCloseModal = () => setSelectedProvider(null);

  const filteredProviders = solarProviders.filter((provider) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-3xl mx-auto text-gray-800 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-6 text-center">
        🌞 Solar Providers Near You
      </h1>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Loading providers...</p>
      ) : (
        <>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search providers or locations..."
            className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded shadow-sm dark:bg-gray-800 dark:text-white"
          />

          <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 p-4 mb-6 rounded text-center text-sm text-green-800 dark:text-green-200">
            (🗺️ Map will be displayed here)
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
        </>
      )}

      {selectedProvider && (
        <SolarProviderDetails provider={selectedProvider} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SolarProviderList;