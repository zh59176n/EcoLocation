import React from 'react';

const SolarProviderDetails = ({ provider, onClose }) => {
  if (!provider) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full text-gray-800 dark:text-gray-200">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-4">
          {provider.name}
        </h2>
        <ul className="space-y-2">
          <li><strong>Address:</strong> {provider.address}</li>
          <li><strong>Distance:</strong> {provider.distance}</li>
          <li><strong>Rating:</strong> ⭐ {provider.rating}</li>
          <li><strong>More Info:</strong> {provider.description}</li>
        </ul>
        <button
          onClick={onClose}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SolarProviderDetails;
