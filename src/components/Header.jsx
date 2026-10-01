import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

export default function Header({ theme = 'dark', toggleTheme = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  // Hidden entry to admin: double-click the theme button on user side
  const handleThemeDoubleClick = () => {
    if (!isAdmin) {
      navigate('/admin');
    }
  };

  const handleSwitchToggle = () => {
    if (isAdmin) {
      navigate('/user');
    } else {
      navigate('/admin');
    }
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
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => navigate('/user')}
        >
          <img 
            src={logoUrl} 
            alt="MOBILE XPRESS Logo" 
            className="h-8 w-8 rounded-full object-cover border-2 border-orange-500 shadow-sm"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="font-bold text-lg tracking-wider">MOBILE XPRESS</span>
        </div>

        {/* Navigation Links (User View Only) */}
        {!isAdmin && (
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
              href="#about"
              className={`transition ${
                theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'
              }`}
            >
              About Us
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
          {/* Theme Toggle Button: Click = switch theme | Double-click = open admin */}
          <button
            onClick={toggleTheme}
            onDoubleClick={handleThemeDoubleClick}
            className={`p-2 rounded-full transition shadow-sm border select-none cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
            }`}
            title="Click to toggle theme | Double-click for Admin panel"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Panel Switcher Button */}
          <button
            onClick={handleSwitchToggle}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow ${
              theme === 'dark'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {isAdmin ? 'Switch to User View' : 'Switch to Admin Panel'}
          </button>
        </div>
      </div>
    </header>
  );
}