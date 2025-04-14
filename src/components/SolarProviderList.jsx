import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import SolarProviderDetails from "./SolarProviderDetails.jsx";

const SolarProviderList = () => {
  const [solarProviders, setSolarProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Solar Providers</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading providers...</p>
      ) : (
        <>
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
        </>
      )}

      {selectedProvider && (
        <SolarProviderDetails provider={selectedProvider} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default SolarProviderList;
