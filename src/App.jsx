// App.jsx
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
import SolarProviderList from "./components/SolarProviderList";
<<<<<<< HEAD
=======
import ForgotPassword from "./components/ForgotPassword";
import CantAccessAccount from "./components/CantAccessAccount";
import NewsFeed from "./components/NewsFeed";
>>>>>>> 700eb06 (✅ T2.1 complete: Embedded Leaflet map centered on user location in Solar Providers page)
import House from "./components/House"; // ✅ new import

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
<<<<<<< HEAD
=======
    const mockProviders = [
      {
        name: "SunPower Solar",
        distance: "3.2 miles",
        rating: 4.8,
        address: "123 Solar Ave, San Diego, CA",
        description: "Leading provider of clean solar energy solutions.",
      },
      {
        name: "GreenLight Energy",
        distance: "5.1 miles",
        rating: 4.5,
        address: "456 Eco Rd, Austin, TX",
        description: "Affordable residential solar installations.",
      }
    ];
  
    const seedProviders = async () => {
      try {
        const colRef = collection(db, "solar_providers");
  
        for (const provider of mockProviders) {
          await addDoc(colRef, provider);
          console.log("✅ Added:", provider.name);
        }
  
      } catch (err) {
        console.error("❌ Firestore Seed Error:", err.message);
      }
    };
  
    // Uncomment this when ready to seed:
    // seedProviders();
  }, []);  

  useEffect(() => {
>>>>>>> 700eb06 (✅ T2.1 complete: Embedded Leaflet map centered on user location in Solar Providers page)
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
          <Route path="/about" element={<About />} />
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
=======
          <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterForm /></PublicRoute>} />
          <Route path="/news" element={<NewsFeed />} />
          <Route path="/solar" element={<SolarProviderList />} />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cant-access-account" element={<CantAccessAccount />} />
>>>>>>> 700eb06 (✅ T2.1 complete: Embedded Leaflet map centered on user location in Solar Providers page)
          <Route path="/map" element={<House />} /> {/* ✅ new route */}
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
