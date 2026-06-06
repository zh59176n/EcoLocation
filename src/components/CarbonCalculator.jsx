import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import {
  collection, addDoc, query, where, orderBy, limit, getDocs,
} from "firebase/firestore";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// Emission factors — EPA eGRID 2022 & IPCC AR6
const FACTORS = {
  car: { gasoline: 0.411, hybrid: 0.211, electric: 0.108 },
  energy: 0.386,              // kg CO₂e per kWh (US grid average)
  flight: { short: 230, long: 975 }, // kg CO₂e per round-trip flight
  diet: { omnivore: 5.0, vegetarian: 2.5, vegan: 1.5 }, // kg CO₂e per day
  heating: 5.3 / 30,          // kg CO₂e per therm → daily from monthly
};

const US_DAILY_AVG = 43.8;   // 16 tons/year ÷ 365
const TREE_KG_PER_YEAR = 21; // avg kg CO₂ absorbed per tree per year

const CATEGORY_COLORS = {
  Transport: "#16a34a",
  Energy:    "#2563eb",
  Flights:   "#d97706",
  Diet:      "#7c3aed",
  Heating:   "#dc2626",
};

function ResultCard({ total }) {
  const annualTons = ((total * 365) / 1000).toFixed(1);
  const pct = Math.round(((total - US_DAILY_AVG) / US_DAILY_AVG) * 100);
  const trees = Math.ceil((total * 365) / TREE_KG_PER_YEAR);
  const above = total > US_DAILY_AVG;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 space-y-4">
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">Daily footprint</p>
        <p className="text-5xl font-bold text-green-700 dark:text-green-300">
          {total.toFixed(1)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">kg CO₂e</p>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="font-bold text-gray-800 dark:text-gray-200">{annualTons}t</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">annual</p>
        </div>
        <div className={`rounded-lg p-3 ${above ? "bg-amber-50 dark:bg-amber-900" : "bg-green-50 dark:bg-green-900"}`}>
          <p className={`font-bold ${above ? "text-amber-700 dark:text-amber-300" : "text-green-700 dark:text-green-300"}`}>
            {above ? `↑ ${pct}%` : `↓ ${Math.abs(pct)}%`}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">vs US avg</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <p className="font-bold text-gray-800 dark:text-gray-200">{trees}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">trees/yr</p>
        </div>
      </div>
    </div>
  );
}

function BreakdownChart({ breakdown }) {
  const data = Object.entries(breakdown)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .filter(d => d.value > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <h3 className="text-base font-bold text-green-800 dark:text-green-200 mb-2">
        Breakdown by category
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? "#6b7280"} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => [`${v} kg CO₂e`, ""]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

const labelClass = "block text-sm font-medium text-green-700 dark:text-green-200 mb-1";
const inputClass = "w-full p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder:text-gray-400";
const selectClass = inputClass;

export default function CarbonCalculator() {
  const [user] = useAuthState(auth);

  const [commuteMiles, setCommuteMiles]   = useState("");
  const [carType, setCarType]             = useState("gasoline");
  const [energyKwh, setEnergyKwh]         = useState("");
  const [heatingTherms, setHeatingTherms] = useState("");
  const [shortFlights, setShortFlights]   = useState("");
  const [longFlights, setLongFlights]     = useState("");
  const [diet, setDiet]                   = useState("omnivore");

  const [result, setResult]       = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [history, setHistory]     = useState([]);
  const [error, setError]         = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "carbon_history"),
      where("userId", "==", user.uid),
      orderBy("timestamp", "desc"),
      limit(7)
    );
    getDocs(q).then(snap => setHistory(snap.docs.map(d => d.data()))).catch(console.error);
  }, [user]);

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError("");

    const transport = (parseFloat(commuteMiles) || 0) * FACTORS.car[carType];
    const energy    = (parseFloat(energyKwh) || 0) * FACTORS.energy;
    const heating   = (parseFloat(heatingTherms) || 0) * FACTORS.heating;
    const flights   = (
      (parseFloat(shortFlights) || 0) * FACTORS.flight.short +
      (parseFloat(longFlights) || 0) * FACTORS.flight.long
    ) / 365;
    const dietCO2   = FACTORS.diet[diet];

    const total = transport + energy + heating + flights + dietCO2;
    const bd = { Transport: transport, Energy: energy, Heating: heating, Flights: flights, Diet: dietCO2 };

    setResult(total);
    setBreakdown(bd);

    if (!user) return;
    try {
      await addDoc(collection(db, "carbon_history"), {
        userId: user.uid,
        timestamp: Date.now(),
        input: { commuteMiles, carType, energyKwh, heatingTherms, shortFlights, longFlights, diet },
        result: total.toFixed(2),
        breakdown: bd,
      });
      const q = query(
        collection(db, "carbon_history"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc"),
        limit(7)
      );
      const snap = await getDocs(q);
      setHistory(snap.docs.map(d => d.data()));
    } catch (err) {
      console.error("Failed to save:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4 pb-12 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-100">
          Carbon Footprint Calculator
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Based on EPA eGRID 2022 &amp; IPCC AR6 emission factors. Results in daily CO₂e.
        </p>
      </div>

      <form onSubmit={handleCalculate} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5 space-y-6">

        {/* Transport */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
            🚗 Transport
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Daily commute (miles)</label>
              <input type="number" min="0" className={inputClass} placeholder="e.g. 20"
                value={commuteMiles} onChange={e => setCommuteMiles(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Vehicle type</label>
              <select className={selectClass} value={carType} onChange={e => setCarType(e.target.value)}>
                <option value="gasoline">Gasoline</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>
          </div>
        </div>

        {/* Home energy */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
            ⚡ Home Energy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Daily electricity (kWh)</label>
              <input type="number" min="0" className={inputClass} placeholder="e.g. 15"
                value={energyKwh} onChange={e => setEnergyKwh(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Monthly gas (therms)</label>
              <input type="number" min="0" className={inputClass} placeholder="e.g. 40"
                value={heatingTherms} onChange={e => setHeatingTherms(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Flights */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
            ✈️ Flights per year
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Short haul (&lt;3 hrs)</label>
              <input type="number" min="0" className={inputClass} placeholder="e.g. 4"
                value={shortFlights} onChange={e => setShortFlights(e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Long haul (&gt;3 hrs)</label>
              <input type="number" min="0" className={inputClass} placeholder="e.g. 2"
                value={longFlights} onChange={e => setLongFlights(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Diet */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-3">
            🥗 Diet
          </h2>
          <select className={selectClass} value={diet} onChange={e => setDiet(e.target.value)}>
            <option value="omnivore">Omnivore — meat most days</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        {error && <p role="alert" className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-2.5 bg-green-600 text-white font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        >
          Calculate
        </button>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500">
          Emission factors: EPA eGRID 2022, IPCC AR6, Oxford Food &amp; Climate Research
        </p>
      </form>

      {result !== null && breakdown && (
        <>
          <ResultCard total={result} />
          <BreakdownChart breakdown={breakdown} />
        </>
      )}

      {history.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <h3 className="text-base font-bold text-green-800 dark:text-green-200 mb-3">
            Recent calculations
          </h3>
          <ul className="space-y-2">
            {history.map((h, i) => (
              <li key={i} className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                <span>{new Date(h.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                <span className="font-medium">{h.result} kg CO₂e</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
