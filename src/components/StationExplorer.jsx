import React, { useState } from 'react';
import EVMap from './EVMap';
import StationMap from './StationMap';

const StationExplorer = () => {
  const [activeTab, setActiveTab] = useState('ev');

  const tabClass = (tab) =>
    `px-6 py-2 rounded-full font-semibold ${
      activeTab === tab
        ? 'bg-green-600 text-white'
        : 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
    }`;

  return (
    <div className="pt-4 sm:pt-8 px-4 sm:px-6 space-y-6">
      <div className="flex flex-wrap gap-3 justify-center">
        <button className={tabClass('ev')} onClick={() => setActiveTab('ev')}>
          ⚡ EV Stations
        </button>
        <button className={tabClass('solar')} onClick={() => setActiveTab('solar')}>
          ☀️ Solar / DC Fast
        </button>
      </div>

      <div className="rounded-xl overflow-hidden shadow-md border border-green-300 dark:border-green-700">
        {activeTab === 'ev' ? <EVMap /> : <StationMap />}
      </div>
    </div>
  );
};

export default StationExplorer;
