import React, { useState } from "react";

const CAR_CO2_PER_MILE = 0.411; // kg CO2 per mile
const ENERGY_CO2_PER_KWH = 0.92; // kg CO2 per kWh
const AIR_CO2_PER_MILE = 0.2; // kg CO2 per mile

function CarbonCalculator() {
  const [commute, setCommute] = useState("");
  const [energy, setEnergy] = useState("");
  const [airMiles, setAirMiles] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const commuteNum = parseFloat(commute) || 0;
    const energyNum = parseFloat(energy) || 0;
    const airMilesNum = parseFloat(airMiles) || 0;

    const totalCO2 =
      commuteNum * CAR_CO2_PER_MILE +
      energyNum * ENERGY_CO2_PER_KWH +
      airMilesNum * AIR_CO2_PER_MILE;

    setResult(totalCO2.toFixed(2));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-green-50 dark:bg-green-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-green-800 dark:text-green-100 mb-6">
        Carbon Footprint Calculator
      </h1>
      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <label
            htmlFor="commute"
            className="block text-green-700 dark:text-green-200 font-semibold mb-1"
          >
            Daily Commute (miles):
          </label>
          <input
            id="commute"
            type="number"
            value={commute}
            onChange={(e) => setCommute(e.target.value)}
            placeholder="e.g., 30"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label
            htmlFor="energy"
            className="block text-green-700 dark:text-green-200 font-semibold mb-1"
          >
            Daily Home Energy (kWh):
          </label>
          <input
            id="energy"
            type="number"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            placeholder="e.g., 20"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div>
          <label
            htmlFor="airMiles"
            className="block text-green-700 dark:text-green-200 font-semibold mb-1"
          >
            Annual Air Travel (miles):
          </label>
          <input
            id="airMiles"
            type="number"
            value={airMiles}
            onChange={(e) => setAirMiles(e.target.value)}
            placeholder="e.g., 5000"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Calculate
        </button>
      </form>
      {result && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-800 rounded border border-green-300 dark:border-green-700 shadow-sm">
          <p className="text-green-800 dark:text-green-100 text-center font-semibold">
            Your daily CO₂ footprint is:
          </p>
          <p className="text-center text-2xl font-bold text-green-900 dark:text-green-50">
            {result} kg
          </p>
          <p className="mt-2 text-sm text-center text-green-700 dark:text-green-200">
            Consider eco-friendly changes like carpooling or using energy-efficient appliances!
          </p>
        </div>
      )}
    </div>
  );
}

export default CarbonCalculator;
