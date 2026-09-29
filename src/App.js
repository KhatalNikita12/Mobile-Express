import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Lock } from 'lucide-react';
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

const API_BASE = process.env.REACT_APP_API_URL || '/api';
const TOKEN_KEY = 'mx_admin_token';

// sessionStorage can be blocked in some browsers, so never let it crash the app
const readToken = () => {
  try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
};
const saveToken = (t) => {
  try { t ? sessionStorage.setItem(TOKEN_KEY, t) : sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
};

/* ---------------- Admin login panel ---------------- */
function AdminLogin({ theme, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dark = theme === 'dark';

  const handleLogin = async () => {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Login failed');
      saveToken(data.token);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition ${
    dark
      ? 'bg-slate-800 border-slate-700 text-white focus:border-indigo-500'
      : 'bg-white border-orange-200 text-slate-900 focus:border-orange-500'
  }`;

  return (
    <div className="flex items-center justify-center px-4 py-20">
      <div
        className={`w-full max-w-sm rounded-2xl shadow-lg border p-6 ${
          dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-orange-200'
        }`}
        onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
      >
        <div className="flex flex-col items-center mb-5">
          <div className={`p-3 rounded-full mb-2 ${dark ? 'bg-indigo-600' : 'bg-orange-500'} text-white`}>
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold">Admin Login</h2>
          <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            Authorized access only
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-2 rounded-lg text-sm font-semibold text-white transition disabled:opacity-60 ${
              dark ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const [theme, setTheme] = useState('light'); // 'dark' | 'light'
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  // On load, check whether a saved token is still valid
  useEffect(() => {
    const token = readToken();
    if (!token) {
      setCheckingAuth(false);
      return;
    }
    fetch(`${API_BASE}/auth/verify`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.ok) setAuthed(true);
        else saveToken(null);
      })
      .catch(() => {})
      .finally(() => setCheckingAuth(false));
  }, []);

  // Functional update so a quick double-click toggles twice and lands back on the same theme
  const toggleTheme = () => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  };

  // Hidden entry to admin: double-click the theme button (user side only)
  const handleThemeDoubleClick = () => {
    if (!isAdmin) navigate('/admin');
  };

  // Admin -> user in one click
  const handleSwitchToUser = () => navigate('/user');

  const handleLogout = () => {
    saveToken(null);
    setAuthed(false);
    navigate('/user');
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
            {/* Theme Toggle: 1 click = change theme, double-click = open admin (user side) */}
            <button
              onClick={toggleTheme}
              onDoubleClick={handleThemeDoubleClick}
              className={`p-2 rounded-full transition shadow-sm border select-none ${
                theme === 'dark'
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700'
                  : 'bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100'
              }`}
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Admin-only buttons: never shown on the user side */}
            {isAdmin && (
              <>
                <button
                  onClick={handleSwitchToUser}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition shadow ${
                    theme === 'dark'
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  Switch to User View
                </button>
                {authed && (
                  <button
                    onClick={handleLogout}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition border ${
                      theme === 'dark'
                        ? 'border-slate-600 text-slate-200 hover:bg-slate-800'
                        : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    Logout
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Routes setup */}
      <Routes>
        <Route 
          path="/admin" 
          element={
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
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
