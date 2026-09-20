import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Hero({ theme = 'dark' }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');

  const handleBooking = (e) => {
    e.preventDefault();
    setBookingStatus('Booking confirmed! Our technician will reach out shortly.');
    setTimeout(() => {
      setIsModalOpen(false);
      setBookingStatus('');
    }, 2500);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-[80vh] font-sans relative overflow-hidden flex flex-col justify-between transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white' : 'bg-white text-slate-900 selection:bg-orange-500 selection:text-white'
    }`}>
      
      {/* Background Glows & Patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {isDark ? (
          <>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-1/2 -right-40 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-500/15 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute top-1/2 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#f973160a_1px,transparent_1px),linear-gradient(to_bottom,#f973160a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          </>
        )}
      </div>

      <main className="relative z-10  mx-1 px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Typography and Call to Action */}
        <motion.div 
          className="lg:col-span-7 space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* <div className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest backdrop-blur-md shadow-inner border ${
            isDark 
              ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' 
              : 'bg-orange-50 border-orange-200 text-orange-600'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-indigo-400' : 'bg-orange-500'}`}></span>
            <span>Next-Gen Gadgets & Expert Repair</span>
          </div> */}

          <h1 className="text-4xl  lg:text font-bold tracking-tight leading-[1.1]">
            Your Ultimate &nbsp;
            <span className={isDark 
              ? "bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent"
              : "bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent"
            }>
              Tech Destination
            </span>
          </h1>

          <p className={`max-w-xl  lg:mx-0 text-base sm:text-lg leading-relaxed font-normal ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Explore top-tier Mobiles, Laptops, and Smart Home Appliances. Enjoy professional diagnostic and repair services backed by genuine parts guaranteed.
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
            <a 
              href="#categories" 
              className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0 ${
                isDark 
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
              }`}
            >
              Explore Products
              <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold transition backdrop-blur-md border ${
                isDark 
                  ? 'bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600' 
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 hover:border-orange-300'
              }`}
            >
              Repair Services
            </button>
          </div>

          {/* Trust stats badge */}
          <div className={`pt-6 border-t flex flex-wrap justify-center lg:justify-start gap-8 text-sm ${
            isDark ? 'border-slate-800/80 text-slate-400' : 'border-orange-100 text-slate-600'
          }`}>
            <div>
              <span className={`block text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>15K+</span>
              <span>Devices Repaired</span>
            </div>
            <div className={`w-px h-10 ${isDark ? 'bg-slate-800' : 'bg-orange-200'}`}></div>
            <div>
              <span className={`block text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>4.9/5</span>
              <span>Customer Rating</span>
            </div>
            <div className={`w-px h-10 ${isDark ? 'bg-slate-800' : 'bg-orange-200'}`}></div>
            <div>
              <span className={`block text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>100%</span>
              <span>Genuine Parts</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Floating Interactive Animated Tech Cards / Mockups */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-md h-[450px]">
            
            {/* Main Central Card */}
            <motion.div
              className={`absolute inset-x-4 top-10 border rounded-3xl p-6 shadow-2xl backdrop-blur-xl z-20 ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-900/90 to-slate-950/90 border-slate-700/60' 
                  : 'bg-gradient-to-br from-white/95 to-orange-50/90 border-orange-200 shadow-orange-100'
              }`}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                  isDark ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' : 'text-orange-600 bg-orange-100 border-orange-200'
                }`}>
                    Pro Ultra
                </span>
              </div>

              {/* Simulated Device Graphic */}
              <div className={`relative h-48 rounded-2xl border flex items-center justify-center overflow-hidden group ${
                isDark 
                  ? 'bg-gradient-to-tr from-indigo-950 via-slate-900 to-violet-950 border-slate-800' 
                  : 'bg-gradient-to-tr from-orange-100 via-white to-amber-50 border-orange-200'
              }`}>
                <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15)_0,transparent_70%)]'}`}></div>
                <div className="relative z-10 text-center space-y-2 p-4">
                  <div className={`w-16 h-16 mx-auto rounded-2xl border flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300 ${
                    isDark ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400' : 'bg-orange-500/15 border-orange-300 text-orange-600'
                  }`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>Apple MacBook & Phone Studio</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Advanced Diagnostics & Instant Part Swap</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Special Offer</span>
                  <p className="text-sm font-bold text-emerald-500">Save up to ₹5,000 Today</p>
                </div>
                <button 
                  className={` py-2 rounded-xl text-xs font-semibold shadow transition active:scale-95 ${
                    isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  Quick Add
                </button>
              </div>
            </motion.div>

            {/* Floating Badge 1 */}
            <motion.div
              className={`absolute -top-4 -left-2 border rounded-2xl p-4 shadow-xl backdrop-blur-md z-30 flex items-center space-x-3 ${
                isDark ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-white/90 border-orange-200 text-slate-900'
              }`}
              animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold">Express Repair</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Done in 30 Minutes</p>
              </div>
            </motion.div>

            {/* Floating Badge 2 */}
            <motion.div
              className={`absolute -bottom-6 right-0 border rounded-2xl p-4 shadow-xl backdrop-blur-md z-30 flex items-center space-x-3 ${
                isDark ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-white/90 border-orange-200 text-slate-900'
              }`}
              animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                isDark ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-orange-500/20 border-orange-300 text-orange-600'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold">1 Year Warranty</p>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Certified Original Parts</p>
              </div>
            </motion.div>

          </div>
        </div>

      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              className={`border rounded-3xl max-w-md w-full p-6 shadow-2xl relative ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
              }`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`absolute top-4 right-4 p-2 rounded-full ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h3 className="text-xl font-bold mb-2">Book Express Tech Repair</h3>
              <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Enter your device details and issue to get a quick repair estimate.</p>

              {bookingStatus ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center font-medium">
                  {bookingStatus}
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Device Type</label>
                    <select className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500' : 'bg-orange-50/50 border-orange-200 text-slate-900 focus:border-orange-500'
                    }`}>
                      <option>Smartphone (iPhone / Samsung)</option>
                      <option>Laptop (MacBook / Windows)</option>
                      <option>Tablet / iPad</option>
                      <option>Smart Appliance / Audio</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Issue Description</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g., Cracked screen, Battery drain..." 
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-indigo-500 placeholder-slate-600' : 'bg-orange-50/50 border-orange-200 text-slate-900 focus:border-orange-500 placeholder-slate-400'
                      }`}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className={`w-full py-3.5 font-semibold rounded-xl shadow-lg transition ${
                      isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30' : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                    }`}
                  >
                    Confirm Appointment
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}