import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import logo from "../assets/organic.png";

function Navbar({ darkMode, setDarkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setIsOpen(false);
  const handleLogout = () => { signOut(auth); close(); };

  const linkClasses =
    "px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 hover:bg-white/25 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white";

  const renderLinks = (onNavigate = () => {}) => (
    <>
      <Link to="/" className={linkClasses} onClick={onNavigate}>Home</Link>

      {user && <Link to="/dashboard" className={linkClasses} onClick={onNavigate}>Dashboard</Link>}
      {user && <Link to="/map" className={linkClasses} onClick={onNavigate}>EV Stations</Link>}
      <Link to="/news" className={linkClasses} onClick={onNavigate}>News</Link>
      {user && <Link to="/carbon" className={linkClasses} onClick={onNavigate}>Carbon</Link>}
      {user && <Link to="/challenges" className={linkClasses} onClick={onNavigate}>Challenges</Link>}
      <Link to="/about" className={linkClasses} onClick={onNavigate}>About</Link>

      {!user && <Link to="/login" className={linkClasses} onClick={onNavigate}>Login</Link>}
      {!user && <Link to="/register" className={linkClasses} onClick={onNavigate}>Register</Link>}

      {user && (
        <>
          <button
            className="relative group bg-white text-green-700 font-semibold px-3 py-1 rounded hover:bg-green-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => { navigate("/profile"); onNavigate(); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { navigate("/profile"); onNavigate(); } }}
            aria-label={`Go to profile for ${user.email.split("@")[0]}`}
          >
            {user.email.split("@")[0]}
            <div className="absolute left-0 mt-1 w-max bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10" aria-hidden="true">
              Go to Profile
            </div>
          </button>
          <button onClick={handleLogout} className={`${linkClasses} underline`}>
            Logout
          </button>
        </>
      )}

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-white text-green-700 px-2 py-1 rounded transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-gray-200"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </>
  );

  return (
    <nav className={`${scrolled ? "bg-green-600/95 dark:bg-gray-900/95 shadow-lg shadow-green-900/20" : "bg-green-600/80 dark:bg-gray-900/80"} backdrop-blur-md border-b border-white/20 text-white px-4 py-3 flex items-center justify-between relative z-50 h-16 transition-all duration-300`}>
      <Link to="/" className="flex items-center" onClick={close}>
        <img src={logo} alt="EcoLocation Logo" className="h-9 w-auto object-contain" />
        <span className="text-2xl font-bold leading-none ml-2">EcoLocation</span>
      </Link>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      <div className="hidden md:flex items-center gap-4">{renderLinks()}</div>

      {isOpen && (
        <div id="mobile-menu" className="absolute top-16 left-0 w-full bg-green-600/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-white/20 flex flex-col items-center space-y-4 py-4 md:hidden z-50">
          {renderLinks(close)}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
