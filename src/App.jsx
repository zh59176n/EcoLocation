// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PublicRoute from './components/PublicRoute';
import logo from './assets/logo.png';
import Footer from "./components/Footer.jsx";


function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode by adding/removing the 'dark' class on the document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      {/* Header with clickable logo redirecting to home and dark mode toggle */}
      <header className="bg-green-600 text-white px-4 py-3 shadow-md relative flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-4xl font-bold mr-4">EcoLocation</h1>
          <img 
            src={logo} 
            alt="EcoLocation Logo" 
            className="h-20 w-20 relative -top-0" 
          />
        </Link>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-green-600 px-3 py-1 rounded shadow hover:shadow-lg transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-start p-6 pt-4">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="flex flex-col items-center">
                <h1 className="text-5xl text-green-700 dark:text-green-300 mb-6 font-extrabold tracking-wide animate-pulse">
                  Welcome to EcoLocation
                </h1>
                <div className="space-x-4">
                  <Link 
                    to="/login"
                    className="bg-green-600 text-white py-3 px-6 rounded text-xl font-semibold transition transform duration-200 hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-green-600 text-white py-3 px-6 rounded text-xl font-semibold transition transform duration-200 hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterForm />
              </PublicRoute>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </Router>
  );
}

export default App;
