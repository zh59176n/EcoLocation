import React, { useState, useEffect } from "react";

// Helper: Get Monday (start of week) from a given date (assumes Monday as start)
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay(); // Sunday = 0, Monday = 1, etc.
  const diff = day === 0 ? -6 : 1 - day; // if Sunday, subtract 6 days; otherwise, 1 - day
  d.setDate(d.getDate() + diff);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Helper: Generate an array of 7 dates for the week starting at weekStart
function getWeekDates(weekStart) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function EcoChallengeTracker() {
  // Get Monday of the current week
  const initialWeekStart = getWeekStart(new Date());
  const [weekStart, setWeekStart] = useState(initialWeekStart);
  const weekDates = getWeekDates(weekStart);

  // Define the challenge details
  const challenge = {
    id: 1,
    title: "Weekly Eco Challenge",
    description:
      "Mark each day when you complete your eco-friendly goal for the week.",
  };

  // Store progress for each of the 7 days as booleans
  const [progress, setProgress] = useState(Array(7).fill(false));

  // When the component mounts or weekStart changes, check if a new week has started and reset if needed.
  useEffect(() => {
    const todayWeekStart = getWeekStart(new Date());
    if (todayWeekStart.getTime() !== weekStart.getTime()) {
      setWeekStart(todayWeekStart);
      setProgress(Array(7).fill(false));
    }
  }, [weekStart]);

  // Toggle completion for a specific day (by index)
  const toggleDay = (index) => {
    setProgress((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Refresh the week manually
  const refreshWeek = () => {
    const newWeekStart = getWeekStart(new Date());
    setWeekStart(newWeekStart);
    setProgress(Array(7).fill(false));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 rounded shadow">
      {/* Challenge Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
          {challenge.title}
        </h1>
        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {challenge.description}
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
        Week of {weekStart.toLocaleDateString()}
      </h2>

      {/* Display the week with each day as a checkable button */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, index) => (
          <button
            key={index}
            onClick={() => toggleDay(index)}
            className={`border rounded p-2 flex flex-col items-center justify-center focus:outline-none focus:ring-2 ${
              progress[index]
                ? "bg-green-600 text-white border-green-600"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300"
            }`}
          >
            <span className="text-xs">
              {date.toLocaleDateString(undefined, { weekday: "short" })}
            </span>
            <span className="text-sm">{date.getDate()}</span>
            {progress[index] && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mt-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={refreshWeek}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Refresh Week
      </button>
    </div>
  );
}

export default EcoChallengeTracker;
