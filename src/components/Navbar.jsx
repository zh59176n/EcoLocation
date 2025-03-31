import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="flex justify-between items-center p-4 bg-green-600 text-white">
      <div className="text-xl font-bold">
        <Link to="/">EcoLocation</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/about">About</Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-green-700 px-2 py-1 rounded"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
