import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import logo from '../assets/logo.png';

function Navbar({ darkMode, setDarkMode }) {
  const [user] = useAuthState(auth);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <nav className="flex justify-between items-center bg-green-600 px-6 py-4 text-white">
      {/* Left Side: Logo and App Name */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="EcoLocation Logo" className="h-15 w-20 mr-2" />
          <span className="text-2xl font-bold">EcoLocation</span>
        </Link>
      </div>
      {/* Right Side: Navigation Links and Dark Mode Toggle */}
      <div className="flex items-center gap-4">
        <Link to="/" className="hover:underline text-lg font-medium">
          Home
        </Link>
        {!user && (
          <>
            <Link to="/login" className="hover:underline text-lg font-medium">
              Login
            </Link>
            <Link to="/register" className="hover:underline text-lg font-medium">
              Register
            </Link>
          </>
        )}
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Welcome, {user.email}</span>
            <button onClick={handleLogout} className="underline text-sm">
              Logout
            </button>
          </div>
        )}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-green-600 px-2 py-1 rounded hover:shadow-md transition"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
