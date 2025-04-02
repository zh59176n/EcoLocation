// components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses =
    "hover:underline hover:bg-green-700 hover:text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white";

  return (
    <nav className="bg-green-600 text-white px-4 py-3 flex items-center justify-between relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="EcoLocation Logo" className="h-8 w-8" />
        <Link to="/" className={`${linkClasses} text-xl font-bold`} >
          EcoLocation
        </Link>
      </div>

      {/* Menu for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={
              isOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4">
        <Link to="/" className={linkClasses}>Home</Link>
        <Link to="/login" className={linkClasses}>Login</Link>
        <Link to="/register" className={linkClasses}>Register</Link>
        <Link to="/about" className={linkClasses}>About</Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-green-700 px-2 py-1 rounded transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-gray-200"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-green-600 flex flex-col items-center space-y-4 py-4 md:hidden z-50">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={linkClasses}
          >
            Home
          </Link>
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className={linkClasses}
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setIsOpen(false)}
            className={linkClasses}
          >
            Register
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className={linkClasses}
          >
            About
          </Link>
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              setIsOpen(false);
            }}
            className="bg-white text-green-700 px-2 py-1 rounded transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-gray-200"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
