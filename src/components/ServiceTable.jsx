import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function ServiceTable({ services, loading, editService, deleteService }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b"><h3 className="text-lg font-bold text-slate-900">Current Services ({services.length})</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b">
            <tr>
              <th className="p-4">Service Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Estimate</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td className="p-6 text-center text-slate-400" colSpan={4}>Loading…</td></tr>
            ) : services.length === 0 ? (
              <tr><td className="p-6 text-center text-slate-400" colSpan={4}>No services yet.</td></tr>
            ) : services.map(s => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="p-4">
                  <p className="font-bold text-slate-900">{s.name}</p>
                  <p className="text-xs text-slate-500 truncate max-w-xs">{s.description}</p>
                </td>
                <td className="p-4 capitalize text-slate-600">{s.category}</td>
                <td className="p-4 font-semibold text-indigo-600">{s.price}</td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => editService(s)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"><Edit className="h-4 w-4" /></button>
                  <button onClick={() => deleteService(s.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}