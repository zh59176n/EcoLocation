import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-green-600 text-white px-4 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link to="/">EcoLocation</Link>
      </div>

      {/* Hamburger menu for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
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

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-green-600 flex flex-col items-center space-y-4 py-4 md:hidden z-50">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
          <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setIsOpen(false);
            }}
            className="bg-white text-green-700 px-2 py-1 rounded"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
