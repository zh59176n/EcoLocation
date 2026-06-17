// src/components/RegisterForm.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please fill out both email and password.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast.success("Account created! Welcome to EcoLocation 🌱");
      navigate("/dashboard");
    } catch (err) {
      const messages = {
        "auth/email-already-in-use": "An account with that email already exists.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
      };
      setError(messages[err.code] || "Registration failed. Please try again.");
    }
  };

  const inputClasses = `
    mt-1 block w-full px-4 py-2 border
    border-white/40 dark:border-white/10
    rounded-lg shadow-sm
    focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
    bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
  `;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-100 text-center">
          Register
        </h2>

        {error && (
          <p role="alert" className="text-red-600 dark:text-red-400 text-sm mb-4">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="register-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClasses}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg transition-colors duration-200 hover:bg-green-500 shadow-lg shadow-green-500/40 hover:shadow-green-400/50 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-green-800"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
