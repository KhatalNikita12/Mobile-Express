import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className="bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-indigo-400" />
            <span className="font-bold text-lg tracking-wider">MOBILE XPRESS</span>
          </div>

          {activeTab === 'user' && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              <a href="#home" className="hover:text-indigo-400 transition">Home</a>
              <a href="#categories" className="hover:text-indigo-400 transition">Categories</a>
              <a href="#services" className="hover:text-indigo-400 transition">Services</a>
              <a href="#contact" className="hover:text-indigo-400 transition">Contact Us</a>
            </nav>
          )}

          <button
            onClick={() => setActiveTab(activeTab === 'user' ? 'admin' : 'user')}
            className="bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow"
          >
            {activeTab === 'user' ? 'Switch to Admin Panel' : 'Switch to User View'}
          </button>
        </div>
      </header>

      {/* One deliberate transition when swapping views — not scattered per-element motion */}
      <AnimatePresence mode="wait">
        {activeTab === 'user' ? (
          <motion.div
            key="user"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <UserPage shopInfo={shopInfo} />
          </motion.div>
        ) : (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AdminPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
