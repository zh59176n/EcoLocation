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
    <div className="pt-20 px-6 space-y-8">
      <div className="flex space-x-4 mb-8 justify-center">
        <button className={tabClass('ev')} onClick={() => setActiveTab('ev')}>
          EV Charging Stations
        </button>
        <button className={tabClass('solar')} onClick={() => setActiveTab('solar')}>
          Level 2 / DC Fast
        </button>
      </div>

      <div className="rounded-xl overflow-hidden shadow-md border border-green-300 dark:border-green-700">
        {activeTab === 'ev' ? <EVMap /> : <StationMap />}
      </div>
    </div>
  );
};

export default StationExplorer;
