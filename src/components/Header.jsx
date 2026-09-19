import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Header({ activeTab = 'user', setActiveTab = () => {} }) {
  // State to track current theme: 'light' or 'dark'
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Direct image URL provided for your logo
  const logoUrl = "./logo.png";
  return (
    <header
      className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-slate-900 text-white'
          : 'bg-white text-slate-900 border-b border-orange-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Section with Custom Image */}
        <div className="flex items-center space-x-3">
          <img 
            src={logoUrl} 
            alt="MOBILE XPRESS Logo" 
            className="h-8 w-8 rounded-full object-cover border-2 border-orange-500 shadow-sm"
            onError={(e) => {
              // Fallback if the image fails to load or blocks due to CORS/hotlinking
              e.target.style.display = 'none';
            }}
          />
          <span className="font-bold text-lg tracking-wider">MOBILE  </span>
        </div>

        {/* Navigation Links (User View) */}
        {activeTab === 'user' && (
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <a
              href="#home"
              className={`transition ${
                theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'
              }`}
            >
              Home
            </a>
            <a
              href="#categories"
              className={`transition ${
                theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'
              }`}
            >
              Categories
            </a>
            <a
              href="#services"
              className={`transition ${
                theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'
              }`}
            >
              Services
            </a>
            <a
              href="#contact"
              className={`transition ${
                theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'
              }`}
            >
              Contact Us
            </a>
          </nav>
        )}

        {/* Action Buttons Section */}
        <div className="flex items-center space-x-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition shadow-sm border ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
            }`}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Panel Switcher Button */}
          <button
            onClick={() => setActiveTab(activeTab === 'user' ? 'admin' : 'user')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {activeTab === 'user' ? 'Switch to Admin Panel' : 'Switch to User View'}
          </button>
        </div>
      </div>
    </header>
  );
}