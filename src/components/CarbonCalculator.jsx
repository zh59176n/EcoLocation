import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import app from "../firebase";

const auth = getAuth(app);
const db = getFirestore(app);

const CAR_CO2_PER_MILE = 0.411;
const ENERGY_CO2_PER_KWH = 0.92;
const AIR_CO2_PER_MILE = 0.2;

function CarbonCalculator() {
  const [commute, setCommute] = useState("");
  const [energy, setEnergy] = useState("");
  const [airMiles, setAirMiles] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser) return;
      const q = query(
        collection(db, "carbon_history"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
        limit(7)
      );
      try {
        const snapshot = await getDocs(q);
        setHistory(snapshot.docs.map((doc) => doc.data()));
      } catch (err) {
        console.error("Failed to fetch carbon history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleCalculate = async (e) => {
    e.preventDefault();

    if (commute === "" || energy === "" || airMiles === "") {
      setError("Please fill out all fields.");
      setResult(null);
      return;
    }

    setError("");

    const commuteNum = parseFloat(commute) || 0;
    const energyNum = parseFloat(energy) || 0;
    const airMilesNum = parseFloat(airMiles) || 0;

    const totalCO2 =
      commuteNum * CAR_CO2_PER_MILE +
      energyNum * ENERGY_CO2_PER_KWH +
      airMilesNum * AIR_CO2_PER_MILE;

    const formatted = totalCO2.toFixed(2);
    setResult(formatted);

    try {
      await addDoc(collection(db, "carbon_history"), {
        userId: auth.currentUser.uid,
        timestamp: Date.now(),
        input: { commute: commuteNum, energy: energyNum, airMiles: airMilesNum },
        result: formatted,
      });
    } catch (err) {
      console.error("Failed to save carbon entry:", err);
    }

    try {
      const q = query(
        collection(db, "carbon_history"),
        where("userId", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc"),
        limit(7)
      );
      const snapshot = await getDocs(q);
      setHistory(snapshot.docs.map((doc) => doc.data()));
    } catch (err) {
      console.error("Failed to refresh carbon history:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-green-50 dark:bg-green-900 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-green-800 dark:text-green-100 mb-6">
        Carbon Footprint Calculator
      </h1>

      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <label htmlFor="commute" className="block text-green-700 dark:text-green-200 font-semibold mb-1">
            Daily Commute (miles):
          </label>
          <input
            id="commute"
            type="number"
            value={commute}
            onChange={(e) => setCommute(e.target.value)}
            placeholder="e.g., 30"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 dark:text-white bg-white dark:bg-green-800 placeholder:text-gray-400 dark:placeholder:text-green-300"
          />
        </div>

        <div>
          <label htmlFor="energy" className="block text-green-700 dark:text-green-200 font-semibold mb-1">
            Daily Home Energy (kWh):
          </label>
          <input
            id="energy"
            type="number"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            placeholder="e.g., 20"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 dark:text-white bg-white dark:bg-green-800 placeholder:text-gray-400 dark:placeholder:text-green-300"
          />
        </div>

        <div>
          <label htmlFor="airMiles" className="block text-green-700 dark:text-green-200 font-semibold mb-1">
            Annual Air Travel (miles):
          </label>
          <input
            id="airMiles"
            type="number"
            value={airMiles}
            onChange={(e) => setAirMiles(e.target.value)}
            placeholder="e.g., 5000"
            className="w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-green-900 dark:text-white bg-white dark:bg-green-800 placeholder:text-gray-400 dark:placeholder:text-green-300"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-800 px-3 py-2 rounded mt-2 animate-fade-in">
            <span className="text-xl">⚠️</span>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Calculate
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-100 dark:bg-green-800 rounded border border-green-300 dark:border-green-700 shadow-sm animate-fade-in">
          <p className="text-green-800 dark:text-green-100 text-center font-semibold">
            Your estimated CO₂ footprint:
          </p>
          <p className="text-center text-3xl font-bold text-green-900 dark:text-green-50">
            {result} kg
          </p>
          <p className="mt-2 text-sm text-center text-green-700 dark:text-green-200">
            Consider eco-friendly changes like carpooling or using energy-efficient appliances!
          </p>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
            Last 7 Entries
          </h3>
          <ul className="list-disc list-inside space-y-1 text-gray-800 dark:text-gray-200">
            {history.map((h, index) => (
              <li key={index}>
                {new Date(h.timestamp).toLocaleDateString()}: {h.result} kg CO₂
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CarbonCalculator;
