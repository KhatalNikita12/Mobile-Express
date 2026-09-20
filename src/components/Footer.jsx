import React from 'react';
import { MapPin, Phone, Mail, Heart, ArrowUp } from 'lucide-react';

export default function Footer({ shopInfo }) {
  // Use passed shopInfo props if available, or fall back to defaults
  const info = shopInfo || {
    owner: "Rahul Varma",
    phone: "+91 9876543210",
    address: "Balaji chowk, Pashan Sus Road Opp mountvert arcade, Pune, Maharashtra 411021",
    email: "support@repairshop.com" // fallback if email is part of shopInfo
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-2 m-3 space-y-12">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & About */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Mobile Xpress( Varma Ent )<span className="text-indigo-500">.</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Your trusted destination for expert mobile, laptop, and electronics hardware repairs in Pune. Quality diagnostics, swift turnaround, and reliable support by {info.owner}.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#services" className="hover:text-indigo-400 transition-colors">Our Services</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-indigo-400 transition-colors">Visit Store</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-indigo-400 transition-colors">Book a Repair</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-indigo-400 transition-colors">Contact Support</a>
              </li>
            </ul>
          </div>

          {/* Contact Summary */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Store Desk</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-indigo-400 mt-1 shrink-0" />
                <span className="text-slate-400 text-xs leading-normal">{info.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span className="text-slate-400 text-xs">{info.phone}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {info.owner} — Mobile Xpress. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <p className="flex items-center gap-1">
              Crafted with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> in Pune
            </p>
            <button
              onClick={scrollToTop}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2 rounded-xl transition shadow flex items-center justify-center"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}