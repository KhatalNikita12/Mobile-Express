import React, { useState } from 'react';

export default function ProductForm({ 
  pForm, 
  setPForm, 
  isEditingProduct, 
  handleProductSubmit, 
  resetProductForm, 
  saving, 
  categories = [], // <--- Dynamic categories from backend
  brands = [],       // <--- Dynamic brands from backend
  theme = 'dark' 
}) {
  const [imageFiles, setImageFiles] = useState([]);
  const isDark = theme === 'dark';

  const onSubmitWithFiles = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('category', pForm.category);
    formData.append('name', pForm.name);
    formData.append('brand', pForm.brand);
    formData.append('price', pForm.price);
    formData.append('specs', pForm.specs);

    for (let i = 0; i < imageFiles.length; i++) {
      formData.append('imageFiles', imageFiles[i]);
    }

    handleProductSubmit(e, formData); 
  };

  // Filter brands based on the currently selected category if you're using separate tables
  // (Assuming category name or ID matches)
  const selectedCategoryObj = categories.find(c => c.name.toLowerCase() === pForm.category.toLowerCase());
  const filteredBrands = brands.filter(b => 
    selectedCategoryObj ? b.category_id === selectedCategoryObj.id : true
  );

  return (
    <div className={`p-6 rounded-2xl border shadow-sm space-y-4 h-fit transition-colors duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
    }`}>
      <h3 className="text-lg font-bold">{isEditingProduct ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={onSubmitWithFiles} className="space-y-4 text-sm">
        
        {/* Dynamic Category Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
          <select
            value={pForm.category}
            onChange={(e) => setPForm({ ...pForm, category: e.target.value, brand: '' })}
            required
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            }`}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id || cat.name} value={cat.name.toLowerCase()}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Name */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Product Name</label>
          <input 
            type="text" 
            required 
            value={pForm.name} 
            onChange={(e) => setPForm({ ...pForm, name: e.target.value })} 
            placeholder="e.g. Galaxy S24" 
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            }`} 
          />
        </div>

        {/* Dynamic Brand Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Brand</label>
          <select
            value={pForm.brand}
            onChange={(e) => setPForm({ ...pForm, brand: e.target.value })}
            required
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            }`}
          >
            <option value="">-- Select Brand --</option>
            {filteredBrands.map((brand) => (
              <option key={brand.id || brand.name} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Price (₹)</label>
          <input 
            type="number" 
            required 
            value={pForm.price} 
            onChange={(e) => setPForm({ ...pForm, price: e.target.value })} 
            placeholder="e.g. 45000" 
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            }`} 
          />
        </div>

        {/* Specifications */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Specifications</label>
          <textarea 
            rows="2" 
            required 
            value={pForm.specs} 
            onChange={(e) => setPForm({ ...pForm, specs: e.target.value })} 
            placeholder="RAM, Storage, Camera..." 
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            }`}
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Upload Device Images (Multiple allowed)</label>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={(e) => setImageFiles(e.target.files)} 
            className={`w-full border rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-slate-300 file:bg-indigo-500/20 file:text-indigo-300 hover:file:bg-indigo-500/30' 
                : 'bg-orange-50/50 border-orange-200 text-slate-700 file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200'
            }`} 
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button 
            type="submit" 
            disabled={saving} 
            className={`flex-1 font-medium py-2.5 rounded-xl transition text-white ${
              isDark ? 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50' : 'bg-orange-500 hover:bg-orange-600 disabled:opacity-50'
            }`}
          >
            {saving ? 'Uploading & Saving…' : isEditingProduct ? 'Update Product' : 'Add Product'}
          </button>
          {isEditingProduct && (
            <button 
              type="button" 
              onClick={resetProductForm} 
              className={`px-4 py-2.5 rounded-xl border ${
                isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
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