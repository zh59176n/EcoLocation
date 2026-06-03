
import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const AccountRecovery = () => {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('✅ Reset link sent! Check your inbox.');
    } catch (err) {
      // You can map err.code to friendlier text if you like
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-green-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Can’t Access Your Account?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Enter your email below and we’ll send a password‑reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-green-600">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-red-600">{error}</p>
        )}

        <p className="mt-6 text-gray-500 text-sm">
          Or contact our support team:
          <a
            href="mailto:support@ecolocation.com"
            className="text-green-700 font-semibold hover:underline mx-1"
          >
            support@ecolocation.com
          </a>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          We typically respond within 24 hours.
        </p>
      </div>
    </div>
  );
};

export default AccountRecovery;
