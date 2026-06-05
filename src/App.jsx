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
import StationExplorer from "./components/StationExplorer";
import ForgotPassword from "./components/ForgotPassword";
import AccountRecovery from "./components/AccountRecovery";
import NewsFeed from "./components/NewsFeed";
import EVMap from "./components/EVMap";
import CarbonCalculator from "./components/CarbonCalculator";
import ChallengeTracker from "./components/ChallengeTracker";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="min-h-screen eco-bg transition-colors duration-300">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-700 focus:text-white focus:rounded focus:outline-none"
        >
          Skip to main content
        </a>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <main id="main-content" className="text-gray-900 dark:text-white transition-all duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
            <Route path="/news" element={<ErrorBoundary fallback="The news feed couldn't load."><NewsFeed /></ErrorBoundary>} />
            <Route path="/about" element={<About />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cant-access-account" element={<AccountRecovery />} />

            <Route path="/solar" element={<PrivateRoute><ErrorBoundary fallback="The map couldn't load."><StationExplorer /></ErrorBoundary></PrivateRoute>} />
            <Route path="/map" element={<PrivateRoute><ErrorBoundary fallback="The map couldn't load."><EVMap /></ErrorBoundary></PrivateRoute>} />
            <Route path="/carbon" element={<PrivateRoute><CarbonCalculator /></PrivateRoute>} />
            <Route path="/challenges" element={<PrivateRoute><ChallengeTracker /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

