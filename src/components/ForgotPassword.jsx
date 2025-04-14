import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase";

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
    <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-green-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center">
          Enter your email address and we’ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded shadow-sm"
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;