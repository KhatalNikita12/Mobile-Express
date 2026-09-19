import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../api';

export default function CategoryBrandManager({ theme = 'dark', showToast }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [catName, setCatName] = useState('');
  const [brandForm, setBrandForm] = useState({ name: '', category_id: '' });
  const [saving, setSaving] = useState(false);

  const isDark = theme === 'dark';

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [catData, brandData] = await Promise.all([
        api.getCategories(),
        api.getBrands()
      ]);
      setCategories(Array.isArray(catData) ? catData : []);
      setBrands(Array.isArray(brandData) ? brandData : []);
    } catch (err) {
      showToast('error', 'Failed to load categories or brands');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle Category Submit
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setSaving(true);
    try {
      const newCat = await api.createCategory({ name: catName });
      setCategories([newCat, ...categories]);
      setCatName('');
      showToast('success', 'Category added successfully');
    } catch (err) {
      showToast('error', err.message || 'Could not add category');
    } finally {
      setSaving(false);
    }
  };

  // Handle Brand Submit
  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    if (!brandForm.name.trim() || !brandForm.category_id) return;
    setSaving(true);
    try {
      const newBrand = await api.createBrand(brandForm);
      setBrands([newBrand, ...brands]);
      setBrandForm({ name: '', category_id: '' });
      showToast('success', 'Brand added successfully');
    } catch (err) {
      showToast('error', err.message || 'Could not add brand');
    } finally {
      setSaving(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Deleting this category will also delete its linked brands. Proceed?')) return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      setBrands(brands.filter(b => b.category_id !== id));
      showToast('success', 'Category deleted');
    } catch (err) {
      showToast('error', 'Could not delete category');
    }
  };

  // Delete Brand
  const handleDeleteBrand = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    try {
      await api.deleteBrand(id);
      setBrands(brands.filter(b => b.id !== id));
      showToast('success', 'Brand deleted');
    } catch (err) {
      showToast('error', 'Could not delete brand');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* CATEGORIES MANAGEMENT PANEL */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-orange-200'
      }`}>
        <h3 className="text-xl font-bold">Manage Categories</h3>
        
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">New Category Name</label>
            <input 
              type="text" 
              value={catName}
              onChange={e => setCatName(e.target.value)}
              placeholder="e.g. Smartphones, Laptops"
              required
              className={`w-full p-3 rounded-xl border text-sm ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
              }`}
            />
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              isDark ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            Add Category
          </button>
        </form>

        <div className="border-t pt-4 border-slate-800/10">
          <h4 className="text-sm font-semibold mb-3">Existing Categories</h4>
          {categories.length === 0 ? (
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No categories found.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map(cat => (
                <div key={cat.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-orange-50/30 border-orange-100'
                }`}>
                  <span className="font-medium text-sm">{cat.name}</span>
                  <button 
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="text-rose-500 text-xs font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BRANDS MANAGEMENT PANEL */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-6 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-orange-200'
      }`}>
        <h3 className="text-xl font-bold">Manage Brands (Linked to Category)</h3>

        <form onSubmit={handleBrandSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">Select Category</label>
            <select 
              value={brandForm.category_id}
              onChange={e => setBrandForm({...brandForm, category_id: e.target.value})}
              required
              className={`w-full p-3 rounded-xl border text-sm ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
              }`}
            >
              <option value="">-- Choose Category --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Brand Name</label>
            <input 
              type="text" 
              value={brandForm.name}
              onChange={e => setBrandForm({...brandForm, name: e.target.value})}
              placeholder="e.g. Apple, Samsung, Dell"
              required
              className={`w-full p-3 rounded-xl border text-sm ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
              }`}
            />
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className={`w-full py-3 rounded-xl font-semibold text-white transition ${
              isDark ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-orange-500 hover:bg-orange-600'
            }`}
          >
            Add Brand
          </button>
        </form>

        <div className="border-t pt-4 border-slate-800/10">
          <h4 className="text-sm font-semibold mb-3">Existing Brands</h4>
          {brands.length === 0 ? (
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No brands found.</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {brands.map(brand => {
                const parentCat = categories.find(c => c.id === brand.category_id);
                return (
                  <div key={brand.id} className={`flex items-center justify-between p-3 rounded-xl border ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-orange-50/30 border-orange-100'
                  }`}>
                    <div>
                      <span className="font-medium text-sm block">{brand.name}</span>
                      <span className={`text-[10px] uppercase font-bold tracking-wider ${
                        isDark ? 'text-indigo-400' : 'text-orange-600'
                      }`}>
                        Category: {parentCat ? parentCat.name : 'Unknown'}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="text-rose-500 text-xs font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}