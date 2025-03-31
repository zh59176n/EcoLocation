import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PublicRoute from './components/PublicRoute';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode by adding/removing the 'dark' class on the root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      {/* Navbar receives darkMode state and its setter */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

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
                  <a
                    href="/login"
                    className="bg-green-600 text-white py-3 px-6 rounded text-xl font-semibold transition transform duration-200 hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                  >
                    Login
                  </a>
                  <a
                    href="/register"
                    className="bg-green-600 text-white py-3 px-6 rounded text-xl font-semibold transition transform duration-200 hover:bg-green-700 hover:scale-105 hover:shadow-lg"
                  >
                    Sign Up
                  </a>
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
