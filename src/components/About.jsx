import React, { useState } from 'react';

function About() {
  const [points, setPoints] = useState(0);
  const [selectedAction, setSelectedAction] = useState('');
  const actions = ['Recycled ♻️', 'Biked 🚲', 'Used Solar ☀️', 'Avoided Plastic 🚫', 'Carpooled 🚗'];
  const progressPercent = (points / 20) * 100;

  const addPoint = () => {
    if (!selectedAction) return alert("Please select an action!");
    setPoints((prev) => Math.min(prev + 1, 20));
    setSelectedAction('');
  };

  const resetPoints = () => setPoints(0);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-green-300 dark:from-green-800 dark:to-green-900 px-4 py-12 text-center text-gray-800 dark:text-gray-100 transition-all duration-300">
      <h1 className="text-5xl font-bold text-green-800 dark:text-green-200 mb-6">About EcoLocation</h1>
      <p className="text-lg max-w-3xl mx-auto mb-12">
        EcoLocation is designed to help users find sustainable and environmentally friendly
        locations. Our mission is to make eco-conscious living easier for everyone.
      </p>

      {/* Mission Icons Layout */}
      <div className="flex flex-wrap justify-between items-start gap-6 max-w-6xl mx-auto mb-12">
        <div className="w-full sm:w-[25%] flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-100 mb-2">♻️ Reduce</h3>
            <p className="text-sm">Cut down on single-use waste and overconsumption.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-yellow-600 mb-2">☀️ Use Renewables</h3>
            <p className="text-sm">Opt for solar, wind, and green energy sources.</p>
          </div>
        </div>

        {/* Track Your Green Actions */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-green-400 w-full sm:w-[45%]">
          <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 flex items-center justify-center mb-3">
            <span className="animate-pulse mr-2">🌱</span> Track Your Green Actions
          </h2>
          <p className="text-md text-gray-600 dark:text-gray-300 mb-4">
            Earn <span className="font-semibold text-green-600">Green Points</span> by doing something eco-friendly today.
          </p>
          <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md shadow-inner mb-4">
            <div className="text-2xl font-semibold mb-2">Green Points: {points}</div>
            <div className="w-full bg-gray-300 dark:bg-gray-700 h-3 rounded-full overflow-hidden mb-3">
              <div
                className="bg-green-600 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {points >= 20 && (
              <div className="text-green-700 dark:text-green-300 font-semibold mb-2">
                🏅 Weekly Eco Badge Achieved!
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mb-3">
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select an action</option>
                {actions.map((action, index) => (
                  <option key={index} value={action}>
                    {action}
                  </option>
                ))}
              </select>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                onClick={addPoint}
              >
                Submit
              </button>
            </div>

            <button
              className="text-sm text-red-500 underline hover:text-red-700"
              onClick={resetPoints}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="w-full sm:w-[25%] flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">🚲 Greener Travel</h3>
            <p className="text-sm">Walk, bike, or carpool to reduce carbon output.</p>
          </div>
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-green-600 mb-2">🌿 Conserve Resources</h3>
            <p className="text-sm">Turn off lights and save water when not needed.</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="text-left max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-green-900 dark:text-green-100 mb-4">
          <span className="mr-2">👥</span> Team Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            {
              name: "Grace Langton",
              image: "/grace.jpg",
              role: "Product Owner",
              bg: "bg-pink-200 dark:bg-pink-900",
            },
            {
              name: "Donovan Lane",
              image: "/donovan.jpg",
              role: "Developer",
              bg: "bg-blue-200 dark:bg-blue-900",
            },
            {
              name: "Zara Hameedi",
              image: "/zara.jpg",
              role: "Developer",
              bg: "bg-red-200 dark:bg-red-900",
            },
            {
              name: "Patrick Casseus",
              image: "/patrick.jpg",
              role: "Scrum Master",
              bg: "bg-yellow-200 dark:bg-yellow-900",
            },
          ].map((member) => (
            <div
              key={member.name}
              className={`${member.bg} rounded-lg shadow p-4 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <img
                src={member.image}
                alt={member.name}
                className="mx-auto rounded-md mb-3 h-32 object-cover"
              />
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{member.name}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-200">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default About;
