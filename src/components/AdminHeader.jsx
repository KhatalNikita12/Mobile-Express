import React from 'react';

export default function AdminHeader({ activeSubTab, setActiveSubTab }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Admin Control Panel</h2>
        <p className="text-slate-500 text-sm">Manage inventory, catalog items, and repair service offerings.</p>
      </div>
      <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeSubTab === 'products' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
        >
          Manage Products
        </button>
        <button
          onClick={() => setActiveSubTab('services')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeSubTab === 'services' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600'}`}
        >
          Manage Services
        </button>
      </div>
    </div>
  );
}