<<<<<<< HEAD
// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginForm from './components/LoginForm';
import About from './components/About';
import Home from './components/Home';
import RegisterForm from './components/RegisterForm';
import SolarProviderList from './components/SolarProviderList';
=======
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PublicRoute from "./components/PublicRoute";
>>>>>>> 7348abf0546100e7b2ab89b2191fde14ed9e18ea

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="min-h-screen bg-gradient-to-r from-green-100 to-green-300 dark:from-green-800 dark:to-green-900 text-gray-900 dark:text-white transition-all duration-300">
        <Routes>
          <Route path="/" element={<Home />} />
<<<<<<< HEAD
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/solar" element={<SolarProviderList />} />
=======
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
>>>>>>> 7348abf0546100e7b2ab89b2191fde14ed9e18ea
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
