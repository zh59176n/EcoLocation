import React from "react";

const CantAccessAccount = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100 dark:bg-green-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Can't Access Your Account?</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          If you're locked out, lost access to your email, or are experiencing issues with your login,
          please reach out to our support team.
        </p>
        <p className="text-green-700 font-semibold">📧 support@ecolocation.com</p>
        <p className="text-sm text-gray-500 mt-4">We typically respond within 24 hours.</p>
      </div>
    </div>
  );
};

export default CantAccessAccount;