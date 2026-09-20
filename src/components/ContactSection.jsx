import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';

export default function ContactSection({ shopInfo }) {
  // Use passed shopInfo props if available, or fall back to Rahul Varma's details
  const info = shopInfo || {
    owner: " varma",
    phone: "+91 9876543210",
    address: "Balaji chowk, Pashan Sus Road Opp mountvert arcade, Pune, Maharashtra 411021"
  };

  // Encode the shop address for the Google Maps embed URL
  const encodedAddress = encodeURIComponent(info.address);

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 py-8 transition-colors duration-200">
      {/* Outer card switches background and border between light and dark mode */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Left column text details */}
        <div className="space-y-6">
          <div>
            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-widest">Get In Touch</span>
            <h2 className="text-3xl font-extrabold mt-1 text-slate-900 dark:text-white">Visit Our Store</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
            Have questions about products or need urgent device repairs? Drop by our store or call our primary desk anytime.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Owner</p>
                <p className="text-slate-600 dark:text-slate-300">{info.owner}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Mobile Number</p>
                <p className="text-slate-600 dark:text-slate-300">{info.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Address</p>
                <p className="text-slate-600 dark:text-slate-300">{info.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Google Map container */}
        <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 min-h-[300px] border border-slate-200 dark:border-slate-700 relative w-full h-full transition-colors duration-200">
          <iframe
            title="Store Location Map"
            src={`https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            className="w-full h-full min-h-[300px] border-0 filter contrast-110 dark:contrast-125 dark:invert dark:hue-rotate-180 opacity-95 hover:opacity-100 transition-opacity"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
}