import React, { useState, useEffect } from 'react';
import { api } from '../api';

export default function ServiceForm({ 
  sForm, 
  setSForm, 
  isEditingService, 
  handleServiceSubmit, 
  resetServiceForm, 
  saving, 
  theme = 'dark' 
}) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const isDark = theme === 'dark';

  // Fetch dynamic categories and brands from backend on mount
  useEffect(() => {
    async function fetchDropdownData() {
      try {
        setLoadingOptions(true);
        const [catData, brandData] = await Promise.all([
          api.getCategories(),
          api.getBrands()
        ]);
        setCategories(Array.isArray(catData) ? catData : []);
        setBrands(Array.isArray(brandData) ? brandData : []);
      } catch (err) {
        console.error('Failed to load form options:', err);
      } finally {
        setLoadingOptions(false);
      }
    }
    fetchDropdownData();
  }, []);

  // Filter brands based on the selected category ID
  const filteredBrands = brands.filter(b => 
    sForm.category_id ? String(b.category_id) === String(sForm.category_id) : true
  );

  return (
    <div className={`p-6 rounded-2xl shadow-sm border space-y-4 h-fit transition-colors duration-200 ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">
          {isEditingService ? 'Edit Service' : 'Add New Service'}
        </h3>
        {isEditingService && (
          <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            Editing Mode
          </span>
        )}
      </div>

      <form onSubmit={handleServiceSubmit} className="space-y-4 text-sm">
        
        {/* Category Selector */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Service Category
          </label>
          <select
            value={sForm.category_id || ''}
            onChange={(e) => {
              const selectedCatId = e.target.value;
              const selectedCat = categories.find(c => String(c.id) === String(selectedCatId));
              setSForm({ 
                ...sForm, 
                category_id: selectedCatId, 
                category: selectedCat ? selectedCat.name : '' 
              });
            }}
            disabled={loadingOptions}
            required
            className={`w-full border rounded-xl p-2.5 outline-none transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            <option value="">{loadingOptions ? 'Loading categories...' : '-- Select Category --'}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Selector (Optional / Linked) */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Target Brand (Optional)
          </label>
          <select
            value={sForm.brand_id || ''}
            onChange={(e) => setSForm({ ...sForm, brand_id: e.target.value })}
            className={`w-full border rounded-xl p-2.5 outline-none transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          >
            <option value="">-- All Brands / General --</option>
            {filteredBrands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Service Name */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Service Name
          </label>
          <input 
            type="text" 
            required 
            value={sForm.name || ''} 
            onChange={(e) => setSForm({ ...sForm, name: e.target.value })} 
            placeholder="e.g. Screen Replacement" 
            className={`w-full border rounded-xl p-2.5 outline-none transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`} 
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Description
          </label>
          <textarea 
            rows="2" 
            required 
            value={sForm.description || ''} 
            onChange={(e) => setSForm({ ...sForm, description: e.target.value })} 
            placeholder="Service details..." 
            className={`w-full border rounded-xl p-2.5 outline-none transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          ></textarea>
        </div>

        {/* Price Tag */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Price Tag / Estimate
          </label>
          <input 
            type="text" 
            required 
            value={sForm.price || ''} 
            onChange={(e) => setSForm({ ...sForm, price: e.target.value })} 
            placeholder="e.g. Starts at ₹999" 
            className={`w-full border rounded-xl p-2.5 outline-none transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`} 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button 
            type="submit" 
            disabled={saving} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition shadow"
          >
            {saving ? 'Saving…' : isEditingService ? 'Update Service' : 'Add Service'}
          </button>
          {isEditingService && (
            <button 
              type="button" 
              onClick={resetServiceForm} 
              className={`px-4 py-2.5 rounded-xl transition ${
                isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              Cancel
            </button>
          )}
        </div>

      </form>
    </div>
  );
}