// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-green-600 text-white px-4 py-3 shadow-md flex items-center justify-between relative">
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="EcoLocation Logo" className="h-10 w-10 mr-2" />
          <span className="text-2xl font-bold">EcoLocation</span>
        </Link>
      </div>
      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/login" className="hover:underline">Login</Link>
        <Link to="/register" className="hover:underline">Sign Up</Link>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-green-600 px-2 py-1 rounded hover:shadow-md transition"
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>
      {/* Mobile navigation button */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            {menuOpen ? (
              <path fillRule="evenodd" clipRule="evenodd" d="M18.3 5.71a1 1 0 010 1.42L13.42 12l4.88 4.88a1 1 0 11-1.42 1.42L12 13.42l-4.88 4.88a1 1 0 01-1.42-1.42L10.58 12 5.7 7.12a1 1 0 011.42-1.42L12 10.58l4.88-4.88a1 1 0 011.42 0z" />
            ) : (
              <path fillRule="evenodd" d="M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z" />
            )}
          </svg>
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-green-600 text-white flex flex-col space-y-2 p-4">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/register" onClick={() => setMenuOpen(false)}>Sign Up</Link>
          <button 
            onClick={() => { 
              setDarkMode(!darkMode); 
              setMenuOpen(false);
            }}
            className="bg-white text-green-600 px-2 py-1 rounded hover:shadow-md transition"
          >
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
