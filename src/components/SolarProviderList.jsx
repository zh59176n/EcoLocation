import React from 'react';
import House from './House';

const SolarProviderList = () => {
  return (
    <div className="pt-20 px-6">
      <h1 className="text-3xl font-bold text-green-900 dark:text-green-200 mb-6">
        🔌 Nearby EV Charging Stations
      </h1>

      {/* EV Map + Station List */}
      <div className="rounded-xl overflow-hidden shadow-md border border-green-300 dark:border-green-700">
        <House />
      </div>
    </div>
  );
};

export default SolarProviderList;
