import React from 'react';

const Footer = () => {
  return (
    <footer className="text-yellow-500 py-4 w-full md:fixed bottom-0 z-20" style={{ backgroundColor: "rgb(29, 61, 36)" }}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Copyright Information */}
        <div className="text-sm text-center md:text-left mb-4 md:mb-0 text-yellow-500">
          &copy; {new Date().getFullYear()} Gym Management App. All rights reserved.
        </div>

        {/* Links or Social Icons */}
        <div className="flex space-x-4">
          <a href="#" className="text-yellow-500 hover:text-white transition-colors duration-300">
            Privacy Policy
          </a>
          <a href="#" className="text-yellow-500 hover:text-white transition-colors duration-300">
            Terms of Service
          </a>
          <a href="#" className="text-yellow-500 hover:text-white transition-colors duration-300">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
