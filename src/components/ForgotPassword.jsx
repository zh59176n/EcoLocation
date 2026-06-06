import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("✅ A reset link has been sent to your email.");
    } catch (error) {
      console.error("Reset error:", error.message);
      setMessage("❌ Failed to send reset email. Try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl border border-white/40 dark:border-white/10 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2 text-green-800 dark:text-green-100 text-center">Reset your password</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
          Enter your email and we’ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-white/40 dark:border-white/10 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg shadow-lg shadow-green-500/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
