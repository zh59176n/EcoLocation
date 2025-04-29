import React, { useState } from 'react';
import House from './House';      // EV Charging Stations
import SolarMap from './SolarMap'; // Solar Providers (new)

const SolarProviderList = () => {
  const [activeTab, setActiveTab] = useState('ev');

  return (
    <div className="pt-20 px-6 space-y-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-8 justify-center">
        <button
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === 'ev'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
          }`}
          onClick={() => setActiveTab('ev')}
        >
          EV Charging Stations
        </button>
        <button
          className={`px-6 py-2 rounded-full font-semibold ${
            activeTab === 'solar'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
          }`}
          onClick={() => setActiveTab('solar')}
        >
          Solar Providers
        </button>
      </div>

      {/* Active Content */}
      <div className="rounded-xl overflow-hidden shadow-md border border-green-300 dark:border-green-700">
        {activeTab === 'ev' ? <House /> : <SolarMap />}
      </div>
    </div>
  );
};

export default SolarProviderList;
