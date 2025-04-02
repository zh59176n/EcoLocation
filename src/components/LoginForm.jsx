// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Firebase';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
    } else {
      setError('');
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-green-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md transition-all duration-300 ease-in-out">
        <h2 className="text-2xl font-bold mb-6 text-green-800 text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div role="alert" className="text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 active:bg-green-800"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
