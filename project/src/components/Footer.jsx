import React from 'react';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative py-12 bg-gradient-to-br from-[#0E1F47] via-[#2B3A75] to-[#3C165A] overflow-hidden">
      {/* Decorative Background SVG */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0E1F47" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3C165A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          <rect width="800" height="600" fill="url(#footerGradient)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-300">
        {/* About Us */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#FFA500] to-[#FFC107] bg-clip-text text-transparent">
            About Us
          </h3>
          <p className="text-sm leading-relaxed tracking-wide" style={{ textAlign: 'justify' }}>
            <span className="font-bold">Sustainable Maasai Legacy</span> is dedicated to preserving and celebrating Maasai culture through authentic, ethically crafted products. Our mission is to empower local artisans while sharing their rich heritage with the world.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#FFA500] to-[#FFC107] bg-clip-text text-transparent">
            Quick Links
          </h3>
          <ul className="flex flex-col space-y-3">
            {[
              { label: "Home", path: "/" },
              { label: "Shop", path: "/store" },
              { label: "About", path: "/story" },
              { label: "Contact", path: "/contact" },
            ].map(({ label, path }) => (
              <li key={label}>
                <button
                  type="button"
                  className="inline-flex items-center justify-between w-full px-4 py-2 rounded-md transition-colors duration-300 focus:outline-none hover:bg-[#FFA500] hover:text-[#1E293B]"
                >
                  <Link to={path} className="w-full block text-left">
                    {label}
                  </Link>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect With Us */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#FFA500] to-[#FFC107] bg-clip-text text-transparent">
            Connect With Us
          </h3>
          <div className="flex justify-center space-x-6">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#FFA500] transform hover:scale-110 transition-transform duration-300"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#FFA500] transform hover:scale-110 transition-transform duration-300"
            >
              <Twitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#FFA500] transform hover:scale-110 transition-transform duration-300"
            >
              <Instagram size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-[#475569]">
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; 2025 Sustainable Maasai Legacy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;