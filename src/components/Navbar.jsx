import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import logo from "../assets/logo.png";

function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const close = () => setIsOpen(false);
  const handleLogout = () => { signOut(auth); close(); };

  const linkClasses =
    "hover:underline hover:bg-green-700 hover:text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-white";

  const renderLinks = (onNavigate = () => {}) => (
    <>
      <Link to="/" className={linkClasses} onClick={onNavigate}>Home</Link>

      {user && <Link to="/dashboard" className={linkClasses} onClick={onNavigate}>Dashboard</Link>}
      {user && <Link to="/solar" className={linkClasses} onClick={onNavigate}>EV Stations</Link>}
      {user && <Link to="/map" className={linkClasses} onClick={onNavigate}>Map</Link>}
      <Link to="/news" className={linkClasses} onClick={onNavigate}>News</Link>
      {user && <Link to="/carbon" className={linkClasses} onClick={onNavigate}>Carbon</Link>}
      {user && <Link to="/challenges" className={linkClasses} onClick={onNavigate}>Challenges</Link>}
      <Link to="/about" className={linkClasses} onClick={onNavigate}>About</Link>

      {!user && <Link to="/login" className={linkClasses} onClick={onNavigate}>Login</Link>}
      {!user && <Link to="/register" className={linkClasses} onClick={onNavigate}>Register</Link>}

      {user && (
        <>
          <div
            className="relative group cursor-pointer"
            onClick={() => { navigate("/profile"); onNavigate(); }}
          >
            <span className="bg-white text-green-700 font-semibold px-3 py-1 rounded hover:bg-green-200 transition duration-200">
              {user.email.split("@")[0]}
            </span>
            <div className="absolute left-0 mt-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              Go to Profile
            </div>
          </div>
          <button onClick={handleLogout} className={`${linkClasses} underline`}>
            Logout
          </button>
        </>
      )}

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-white text-green-700 px-2 py-1 rounded transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-gray-200"
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </>
  );

  return (
    <nav className="bg-green-600 dark:bg-gray-900 text-white px-4 py-3 flex items-center justify-between relative shadow-md z-50 h-16">
      <Link to="/" className="flex items-center" onClick={close}>
        <img src={logo} alt="EcoLocation Logo" className="h-16 w-auto min-w-[50px] object-contain relative top-[2px]" />
        <span className="text-2xl font-bold leading-none ml-2">EcoLocation</span>
      </Link>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <div className="hidden md:flex items-center gap-4">{renderLinks()}</div>

      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-green-600 dark:bg-gray-900 flex flex-col items-center space-y-4 py-4 md:hidden z-50">
          {renderLinks(close)}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
