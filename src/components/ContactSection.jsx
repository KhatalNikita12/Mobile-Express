import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';

export default function ContactSection({ shopInfo,theme }) {
  // Use passed shopInfo props if available, or fall back to Rahul Varma's details
  const info = shopInfo || {
    owner: "Dhruv varma",
    phone: "+91 7588255962",
    address: "Balaji chowk, Pashan Sus Road Opp mountvert arcade, Pune, Maharashtra 411021"
  };
  const isDark = theme === 'dark';
  // Encode the shop address for the Google Maps embed URL
  const encodedAddress = encodeURIComponent(info.address);

  return (
    <section id="contact" className="max-w-7xl mx-auto px-4 py-8 transition-colors duration-200">
      {/* Outer card switches background and border between light and dark mode */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-xl border border-slate-200 dark:border-slate-800 transition-colors duration-200">
        
        {/* Left column text details */}
       <div className={`shadow-sm rounded-2xl p-6 sm:p-10 border grid grid-cols-1 md:grid-cols-2 gap-8 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
        }`}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Visit Our Store</h2>
            <div className={`space-y-3 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
           <p className="flex items-center space-x-3">
                <span className="text-indigo-500 font-bold">
                  <i className='fa fa-user'></i>
                </span>
                <span>{shopInfo.owner}</span>
              </p>
              <p className="flex items-start space-x-3">
                <span className="text-indigo-500 font-bold">📍</span>
                <span>{shopInfo.address}</span>
              </p>
              <p className="flex items-center space-x-3">
                <span className="text-indigo-500 font-bold">📞</span>
                <span>{shopInfo.phone}</span>
              </p>
             
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Operating Hours</h2>
            <div className={`space-y-2 text-sm p-4 rounded-xl border ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-gray-50 border-gray-100 text-gray-600'
            }`}>
              <div className={`flex justify-between py-1 border-b ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Monday – Saturday:</span>
                <span>10:00 AM – 9:00 PM</span>
              </div>
              <div className="flex justify-between py-1">
                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>Sunday:</span>
                <span>11:00 AM – 6:00 PM</span>
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