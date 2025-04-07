import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => (prev > 0 ? prev - 1 : 0));
  const reset = () => setCount(0);

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-xl text-green-700 dark:text-green-200 font-semibold">Green Points: {count}</h2>
      <div className="flex space-x-6 text-3xl">
        <button
          onClick={increment}
          aria-label="Add point"
          className="text-green-600 hover:text-green-800 transition-transform transform hover:scale-110"
        >
          🌱
        </button>
        <button
          onClick={decrement}
          aria-label="Remove point"
          className="text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
        >
          🗑️
        </button>
      </div>
      <button
        onClick={reset}
        className="text-sm text-gray-500 hover:text-black dark:hover:text-white underline"
      >
        Reset
      </button>
    </div>
  );
}

export default Counter;
