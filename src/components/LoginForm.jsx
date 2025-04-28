// src/components/LoginForm.jsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { requestNotificationPermission } from "../utils/notifications"; // <-- ADDED this import

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, email, password);

      // ✅ Ask for notification permission after successful login
      await requestNotificationPermission();

      const from = new URLSearchParams(location.search).get("redirect") || "/";
      navigate(from, { replace: true });
    } catch (err) {
      switch (err.code) {
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/user-not-found":
          setError("No account found with that email.");
          break;
        case "auth/user-disabled":
          setError("This account is disabled. Contact support.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please wait and try again.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    }
  };

  const inputClasses = `
    mt-1 block w-full px-4 py-2 border
    border-gray-300 dark:border-gray-600
    rounded-md shadow-sm
    focus:outline-none focus:ring-green-500 focus:border-green-500
    bg-white dark:bg-gray-700
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
  `;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-green-300 dark:from-green-900 dark:to-green-950 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-100 text-center">
          Login
        </h2>

        {error && (
          <p role="alert" className="text-red-600 text-sm mb-4">
            {error}
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClasses}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
            />
            <label
              htmlFor="remember"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-green-800"
          >
            Sign In
          </button>

          <div className="flex flex-col items-center mt-4 space-y-2">
            <Link
              to="/forgot-password"
              className="text-sm text-green-700 dark:text-green-300 hover:underline"
            >
              Forgot your password?
            </Link>
            <Link
              to="/cant-access-account"
              className="text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Can’t access your account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
