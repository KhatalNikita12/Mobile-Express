import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { saveToken } from '../AuthToken';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

export default function AdminLogin({ theme, onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // <--- State to toggle visibility
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
          <p className={`text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Authorized access only</p>
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

          {/* Password Input with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 pr-3 flex items-center transition ${
                dark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-400 hover:text-slate-600'
              }`}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

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