// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "./components/Navbar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm"; // <- make sure this exists

function App() {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Routes>
          <Route path="/" element={<h1 className="text-4xl text-green-700">Welcome to EcoLocation</h1>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* Add more routes here later */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
