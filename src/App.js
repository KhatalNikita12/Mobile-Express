import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import UserPage from './userPage';
import AdminPage from './Adminpage';
import AdminLogin from './components/AdminLogin';
import { readToken, saveToken } from './AuthToken';
import './App.css';

const shopInfo = {
  name: 'Mobile Xpress( Varma Ent )',
  owner: 'Dhruv varma',
  phone: '+91 7588255962',
  address: 'Balaji chowk,Pashan Sus Road Opp mountvert arcade, Pune, Maharashtra 411021',
  whatsappNumber: '917588255962'
};

// Max gap (ms) between two clicks to count as a double-click.
// A single click waits this long so it doesn't flicker the theme before a double-click.
const DOUBLE_CLICK_DELAY = 250;
const API_BASE = process.env.REACT_APP_API_URL || '/api';

function AppContent() {
  const [theme, setTheme] = useState('light');
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const clickTimer = useRef(null);

  const isAdmin = location.pathname.startsWith('/admin');

  // On load: if a saved token exists, check with the server that it is still valid
  useEffect(() => {
    const token = readToken();
    if (!token) { setCheckingAuth(false); return; }
    fetch(`${API_BASE}/auth/verify`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => { if (res.ok) setAuthed(true); else saveToken(null); })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, []);

  // api.js fires this when the server rejects the token (expired) -> back to login
  useEffect(() => {
    const onExpired = () => setAuthed(false);
    window.addEventListener('mx-auth-expired', onExpired);
    return () => window.removeEventListener('mx-auth-expired', onExpired);
  }, []);

  const handleLogout = () => {
    saveToken(null);
    setAuthed(false);
    navigate('/user');
  };

  const handleUserPage = () => {
    // saveToken(null);
    // setAuthed(false);
    navigate('/user');
  };
  // Clean up any pending timer on unmount
  useEffect(() => () => clearTimeout(clickTimer.current), []);

  // Scroll to top whenever we switch between /user and /admin
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Single click  -> toggle dark / light theme
  // Double click  -> switch page: /user  <->  /admin   (no login / token needed)
  const handleThemeClick = (e) => {
    // e.detail === 2 is the second click of a double-click: cancel the pending theme change
    if (e.detail >= 2) {
      clearTimeout(clickTimer.current);
      clickTimer.current = null;
      navigate(isAdmin ? '/user' : '/admin');
      return;
    }
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      toggleTheme();
      clickTimer.current = null;
    }, DOUBLE_CLICK_DELAY);
  };

  const logoUrl = '/logo.jpg';
  const dark = theme === 'dark';

  const pageMotion = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.25 },
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      dark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 shadow-md transition-colors duration-300 ${
        dark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border-b border-orange-200'
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

          {/* Navigation Links (only on User view) */}
          {!isAdmin && (
            <nav className="hidden md:flex space-x-6 text-sm font-medium">
              {[
                ['#home', 'Home'],
                ['#categories', 'Categories'],
                ['#services', 'Services'],
                ['#about', 'About Us'],
                ['#contact', 'Contact Us'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className={`transition ${dark ? 'hover:text-indigo-400' : 'hover:text-orange-500'}`}
                >
                  {label}
                </a>
              ))}
            </nav>
          )}

          {/* Theme button: click = theme | double-click = switch /user <-> /admin */}
          <div className="flex items-center space-x-3">
            {isAdmin && authed && (
              <>
              <button
                type="button"
                onClick={handleLogout}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
                  dark
                    ? 'border-slate-600 text-slate-200 hover:bg-slate-800'
                    : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                }`}
              >
                Logout
              </button>

                <button
                type="button"
                onClick={handleUserPage}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
                  dark
                    ? 'border-slate-600 text-slate-200 hover:bg-slate-800'
                    : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                }`}
              >
                Back to User Page
              </button>
</>
            )}
            <button
              type="button"
              onClick={handleThemeClick}
              style={{ touchAction: 'manipulation' }}
              className={`p-2 rounded-full transition shadow-sm border select-none cursor-pointer ${
                dark
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                  : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
              }`}
              title="Click: toggle theme | Double-click: switch between User and Admin"
              aria-label="Toggle theme. Double-click to switch between user and admin view."
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route
          path="/admin"
          element={
            <motion.div key="admin" {...pageMotion}>
              {checkingAuth ? null : authed ? (
                <AdminPage theme={theme} />
              ) : (
                <AdminLogin theme={theme} onSuccess={() => setAuthed(true)} />
              )}
            </motion.div>
          }
        />
        <Route
          path="/user"
          element={
            <motion.div key="user" {...pageMotion}>
              <UserPage shopInfo={shopInfo} theme={theme} />
            </motion.div>
          }
        />
        <Route path="*" element={<Navigate to="/user" replace />} />
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