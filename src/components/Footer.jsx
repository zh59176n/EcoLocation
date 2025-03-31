// src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="bg-green-600 text-white py-4 mt-8 w-full">
      <div className="max-w-screen-lg mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} EcoLocation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
