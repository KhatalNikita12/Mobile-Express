import React from 'react';
import { Smartphone } from 'lucide-react';

export default function Header({ activeTab, setActiveTab }) {
  return (
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
  );
}