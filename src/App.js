import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import UserPage from '../src/userPage';
import AdminPage from '../src/Adminpage';
import './App.css';

const shopInfo = {
  name: 'Mobile Xpress & Electronics',
  owner: 'Rahul Sharma',
  phone: '+91 9876543210',
  address: 'Shop No. 4, Main Market, Near Tech Park, Pune - 411001',
  whatsappNumber: '919876543210'
};

export default function App() {
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'admin'
  const [theme, setTheme] = useState('dark'); // 'dark' | 'light'

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Direct image URL provided for your logo
  const logoUrl = "https://instagram.fpnq13-3.fna.fbcdn.net/v/t51.82787-19/591050369_18099708403826748_4045984995916688743_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby44NzUuYzIifQ&_nc_ht=instagram.fpnq13-3.fna.fbcdn.net&_nc_cat=100&_nc_oc=Q6cZ2gEifW7jYDRoMfnrlJPP4HiiDj2Pqd8rDlQWnzkfxOWofYz2Yk_0t9fte3oq3LjWGD0cUVMcZANNxYKqZQez4xT5&_nc_ohc=s3xJHa4zhuUQ7kNvwHFMl2d&_nc_gid=0knAsh6WrWYn-FLVLch6Kw&edm=APoiHPcBAAAA&ccb=7-5&oh=00_AQIah8EinWOHxvE3GLH89-jt7ySQzAhN5QagmlnrATAO1Q&oe=6AB47A2B&_nc_sid=22de04";

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Header with Dark / Light Mode & White-Orange Theme */}
      <header className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-900 text-white' 
          : 'bg-white text-slate-900 border-b border-orange-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo & Brand Name */}
          <div className="flex items-center space-x-3">
            <img 
              src={logoUrl} 
              alt="MOBILE XPRESS Logo" 
              className="h-8 w-8 rounded-full object-cover border-2 border-orange-500 shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="font-bold text-lg tracking-wider">MOBILE XPRESS</span>
          </div>

          {/* Navigation Links */}
          {activeTab === 'user' && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a href="#home" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>Home</a>
              <a href="#categories" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>Categories</a>
              <a href="#services" className={`transition ${theme === 'dark' ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}>Services</a>
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

      {/* Main Content View with Transition */}
      <AnimatePresence mode="wait">
        {activeTab === 'user' ? (
          <motion.div
            key="user"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <UserPage shopInfo={shopInfo} theme={theme} />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AdminPage theme={theme} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}