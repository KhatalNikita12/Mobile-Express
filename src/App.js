import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import UserPage from '../src/userPage';
import AdminPage from '../src/Adminpage';
import './App.css';

const shopInfo = {
  name: 'Mobile Xpress( Varma Ent )',
  owner: 'Dhruv varma',
  phone: '+91 7588255962',
  address: 'Balaji chowk,Pashan Sus Road Opp mountvert arcade, Pune, Maharashtra 411021',
  whatsappNumber: '917588255962'
};

function AppContent() {
  const [theme, setTheme] = useState('light'); // 'dark' | 'light'
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleTogglePanel = () => {
    if (isAdmin) {
      navigate('/user');
    } else {
      navigate('/admin');
    }
  };

  const logoUrl = "/logo.jpg";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900 text-white' 
          : 'bg-white text-slate-900 border-b border-orange-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/user')}>
            <img 
              src={logoUrl} 
              alt="MOBILE XPRESS Logo" 
              className="h-8 w-8 rounded-full object-cover border-2 border-orange-500 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-bold text-lg tracking-wider">MOBILE XPRESS</span>
          </div>

          {/* Navigation Links (Only shown on User view) */}
          {!isAdmin && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a href="#home" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>Home</a>
              <a href="#categories" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>Categories</a>
              <a href="#services" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>Services</a>
             <a href="#about" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>About Us</a>
        
              <a href="#contact" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>Contact Us</a>
            </nav>
          )}

          {/* Action Buttons */}
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
              onClick={handleTogglePanel}
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

      {/* Routes setup */}
      <Routes>
        <Route 
          path="/admin" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <AdminPage theme={theme} />
            </motion.div>
          } 
        />
        <Route 
          path="/user" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <UserPage shopInfo={shopInfo} theme={theme} />
            </motion.div>
          } 
        />
        {/* Default fallback route */}
        <Route 
          path="*" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <UserPage shopInfo={shopInfo} theme={theme} />
            </motion.div>
          } 
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}