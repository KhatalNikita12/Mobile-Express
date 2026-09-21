import React from 'react';

export default function AdminHeader({ activeSubTab, setActiveSubTab, theme = 'dark' }) {
  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-wrap gap-3 border-b pb-4 ${
      isDark ? 'border-slate-800' : 'border-orange-200'
    }`}>
      <button
        onClick={() => setActiveSubTab('products')}
        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
          activeSubTab === 'products'
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white')
            : (isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200')
        }`}
      >
        Products Management
      </button>

      <button
        onClick={() => setActiveSubTab('services')}
        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
          activeSubTab === 'services'
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white')
            : (isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200')
        }`}
      >
        Services Management
      </button>

      <button
        onClick={() => setActiveSubTab('categories')}
        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
          activeSubTab === 'categories'
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white')
            : (isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200')
        }`}
      >
        Categories & Brands
      </button>
        <button
        onClick={() => setActiveSubTab('offers')}
        className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-sm ${
          activeSubTab === 'offers'
            ? (isDark ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white')
            : (isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800' : 'bg-white text-slate-700 hover:bg-orange-50 border border-orange-200')
        }`}
      >
        Apply Offers
      </button>
    </div>
  );
}