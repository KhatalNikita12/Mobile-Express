import React, { useState } from 'react';

export default function ProductForm({ pForm, setPForm, isEditingProduct, handleProductSubmit, resetProductForm, saving }) {
  const [imageFiles, setImageFiles] = useState([]);

  const onSubmitWithFiles = (e) => {
    e.preventDefault(); // Safely prevent default form submission
    
    const formData = new FormData();
    formData.append('category', pForm.category);
    formData.append('name', pForm.name);
    formData.append('brand', pForm.brand);
    formData.append('price', pForm.price);
    formData.append('specs', pForm.specs);

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('imageFiles', imageFiles[i]);
    }

    // Pass both the event and the formData to AdminPage handler
    handleProductSubmit(e, formData); 
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4 h-fit">
      <h3 className="text-lg font-bold text-slate-900">{isEditingProduct ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={onSubmitWithFiles} className="space-y-4 text-sm">
        <div>
          <label className="block font-medium text-slate-700 mb-1">Category</label>
          <select
            value={pForm.category}
            onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
            className="w-full border rounded-xl p-2.5 bg-slate-50"
          >
            <option value="mobile">Mobile</option>
            <option value="laptop">Laptop</option>
            <option value="washing machine">Washing Machine</option>
          </select>
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Product Name</label>
          <input type="text" required value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })} placeholder="e.g. Galaxy S24" className="w-full border rounded-xl p-2.5 bg-slate-50" />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Brand</label>
          <input type="text" required value={pForm.brand} onChange={(e) => setPForm({ ...pForm, brand: e.target.value })} placeholder="e.g. Samsung" className="w-full border rounded-xl p-2.5 bg-slate-50" />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Price (₹)</label>
          <input type="number" required value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: e.target.value })} placeholder="e.g. 45000" className="w-full border rounded-xl p-2.5 bg-slate-50" />
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Specifications</label>
          <textarea rows="2" required value={pForm.specs} onChange={(e) => setPForm({ ...pForm, specs: e.target.value })} placeholder="RAM, Storage, Camera..." className="w-full border rounded-xl p-2.5 bg-slate-50"></textarea>
        </div>
        <div>
          <label className="block font-medium text-slate-700 mb-1">Upload Device Images (Multiple allowed)</label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setImageFiles(e.target.files)} 
            className="w-full border rounded-xl p-2 bg-slate-50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" 
          />
        </div>
        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition">
            {saving ? 'Uploading & Saving…' : isEditingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {isEditingProduct && (
            <button type="button" onClick={resetProductForm} className="bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl">Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}