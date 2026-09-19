import React from 'react';

export default function ServiceForm({ sForm, setSForm, isEditingService, handleServiceSubmit, resetServiceForm, saving }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4 h-fit">
      <h3 className="text-lg font-bold text-slate-900">{isEditingService ? 'Edit Service' : 'Add New Service'}</h3>
      <form onSubmit={handleServiceSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Service Category</label>
          <select
            value={sForm.category}
            onChange={(e) => setSForm({ ...sForm, category: e.target.value })}
            className="w-full border rounded-xl p-2.5 bg-slate-50"
          >
            <option value="mobile">Mobile</option>
            <option value="laptop">Laptop</option>
            <option value="washing machine">Washing Machine</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Service Name</label>
          <input type="text" required value={sForm.name} onChange={(e) => setSForm({ ...sForm, name: e.target.value })} placeholder="e.g. Screen Replacement" className="w-full border rounded-xl p-2.5 bg-slate-50" />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Description</label>
          <textarea rows="2" required value={sForm.description} onChange={(e) => setSForm({ ...sForm, description: e.target.value })} placeholder="Service details..." className="w-full border rounded-xl p-2.5 bg-slate-50"></textarea>
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Price Tag / Estimate</label>
          <input type="text" required value={sForm.price} onChange={(e) => setSForm({ ...sForm, price: e.target.value })} placeholder="e.g. Starts at ₹999" className="w-full border rounded-xl p-2.5 bg-slate-50" />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition">
            {saving ? 'Saving…' : isEditingService ? 'Update Service' : 'Add Service'}
          </button>
          {isEditingService && (
            <button type="button" onClick={resetServiceForm} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl">Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}