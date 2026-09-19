import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

export default function ProductTable({ products, loading, editProduct, deleteProduct }) {
  return (
    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b"><h3 className="text-lg font-bold text-slate-900">Current Inventory ({products.length})</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr><td className="p-6 text-center text-slate-400" colSpan={4}>Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td className="p-6 text-center text-slate-400" colSpan={4}>No products yet.</td></tr>
            ) : products.map(p => {
              // FIXED: Check images array first, fallback to single image or placeholder
              const thumbnail = (p.images && p.images.length > 0) 
                ? p.images[0] 
                : (p.image || 'https://via.placeholder.com/100');

              return (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={thumbnail} alt="" className="w-10 h-10 object-contain bg-slate-100 rounded-lg p-1" />
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-indigo-600">{p.brand}</p>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-slate-600">{p.category}</td>
                  <td className="p-4 font-semibold text-slate-900">₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => editProduct(p)} className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => deleteProduct(p.id)} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}