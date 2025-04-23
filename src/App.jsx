// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import SolarProviderList from "./components/SolarProviderList";
import ForgotPassword from "./components/ForgotPassword";
import CantAccessAccount from "./components/CantAccessAccount";
import NewsFeed from "./components/NewsFeed";
import House from "./components/House";
import CarbonCalculator from "./components/CarbonCalculator";
import EcoChallengeTracker from "./components/EcoChallengeTracker";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-green-100 to-green-300 dark:from-green-800 dark:to-green-900">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main className="text-gray-900 dark:text-white transition-all duration-300">
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Home />} />
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
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cant-access-account" element={<CantAccessAccount />} />

            {/* Protected pages */}
            <Route
              path="/solar"
              element={
                <PrivateRoute>
                  <SolarProviderList />
                </PrivateRoute>
              }
            />
            <Route
              path="/map"
              element={
                <PrivateRoute>
                  <House />
                </PrivateRoute>
              }
            />
            <Route
              path="/carbon"
              element={
                <PrivateRoute>
                  <CarbonCalculator />
                </PrivateRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <PrivateRoute>
                  <EcoChallengeTracker />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
