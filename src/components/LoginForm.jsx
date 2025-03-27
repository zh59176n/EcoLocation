// src/components/LoginForm.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Adjust path to your firebase.js

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user);
      // Clear fields or navigate the user somewhere else
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Login failed: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* Heading for the form, referenced by aria-labelledby */}
      <h2
        id="login-form-heading"
        className="text-2xl font-bold text-center text-green-700 mb-4"
      >
        Login
      </h2>
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="login-form-heading"
      >
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "login-error" : undefined}
          />
        </div>
        {/* Inline error message with ARIA attributes for screen readers */}
        {error && (
          <div
            id="login-error"
            role="alert"
            aria-live="assertive"
            className="text-red-600 text-sm"
          >
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
