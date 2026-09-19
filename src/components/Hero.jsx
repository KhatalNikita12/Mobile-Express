import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-950 text-white py-20 px-4 text-center relative overflow-hidden shadow-inner">
      <motion.div
        className="max-w-4xl mx-auto space-y-6 relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs px-3 py-1 rounded-full uppercase tracking-widest font-semibold">
          Next-Gen Gadgets & Expert Repair 
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Your Ultimate Tech Destination
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
          Explore top-tier Mobiles, Laptops, and Home Appliances. Professional repair services with genuine parts guaranteed.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <a href="#categories" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition">
            Explore Products
          </a>
          <a href="#services" className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-6 py-3 rounded-xl font-medium transition">
            Repair Services
          </a>
        </div>
      </motion.div>
    </section>
  );
}