import React from 'react'

export default function OffersForm({ 
  pForm, 
  setPForm, 
  isEditingProduct, 
  handleOfferSubmit, 
  resetProductForm, 
  saving, 
  categories = [], 
  brands = [],
  product = [], 
  theme = 'dark' 
}) {
  const isDark = theme === 'dark';

  const onSubmitWithFiles = (e) => {
    e.preventDefault();
    
    // Send standard object or FormData based on your backend implementation
    const formData = new FormData();
    formData.append('category', pForm.category || '');
    formData.append('brand', pForm.brand || '');
    formData.append('product', pForm.product || '');
    formData.append('price', pForm.price || '');
    formData.append('discount', pForm.discount || 0);
    formData.append('offerPrice', pForm.offerPrice || 0);
    formData.append('validUntil', pForm.validUntil || '');

    handleOfferSubmit(e, formData); 
  };

  // Find category object for filtering
  const selectedCategoryObj = categories.find(
    c => c.name.toLowerCase() === (pForm.category || '').toLowerCase()
  );

  const filteredBrands = brands.filter((b) => 
    selectedCategoryObj ? b.category_id === selectedCategoryObj.id : true
  );

  const filteredProducts = product.filter((p) => {
    if (!pForm.brand) return true; 
    return p.brand === pForm.brand || p.brand_name === pForm.brand || p.brand_id === pForm.brand;
  });

  return (
    <div className={`p-6 rounded-2xl border shadow-sm space-y-4 h-fit transition-colors duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
    }`}>
      <form onSubmit={onSubmitWithFiles} className="space-y-4 text-sm">
        
        {/* Dynamic Category Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Category</label>
          <select
            value={pForm.category || ''}
            onChange={(e) => setPForm({ 
              ...pForm, 
              category: e.target.value, 
              brand: '', 
              product: '',
              price: '',
              offerPrice: ''
            })}
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

        {/* Dynamic Brand Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Brand
          </label>
          <select
            value={pForm.brand || ''}
            onChange={(e) => {
              const selectedBrand = e.target.value;
              setPForm({ 
                ...pForm, 
                brand: selectedBrand, 
                product: '',
                price: '',
                offerPrice: ''
              });
            }}
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

        {/* Dynamic Product Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Product</label>
          <select
            value={pForm.product || ''}
            onChange={(e) => {
              const selectedProductName = e.target.value;
              const selectedProductObj = product.find(p => p.name === selectedProductName);
              const originalPrice = selectedProductObj ? selectedProductObj.price : '';
              
              const discountPercent = parseFloat(pForm.discount) || 0;
              const calculatedOfferPrice = originalPrice 
                ? Math.round(originalPrice - (originalPrice * discountPercent) / 100) 
                : '';

              setPForm({ 
                ...pForm, 
                product: selectedProductName,
                price: originalPrice,
                offerPrice: calculatedOfferPrice
              });
            }}
            disabled={!pForm.brand}
            required
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            } ${!pForm.brand ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">-- Select Product --</option>
            {filteredProducts.map((prod) => (
              <option key={prod.id || prod.name} value={prod.name}>
                {prod.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing & Discount Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Original Price */}
          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Original Price 
            </label>
            <input 
              type="number" 
              readOnly
              value={pForm.price || ''} 
              placeholder="Select a product" 
              className={`w-full border rounded-xl p-2.5 opacity-80 cursor-not-allowed ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`} 
            />
          </div>

          {/* Discount Percentage Input */}
          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Discount (%)
            </label>
            <input 
              type="number" 
              min="0"
              max="100"
              value={pForm.discount || ''} 
              onChange={(e) => {
                const discountVal = e.target.value;
                const originalPrice = parseFloat(pForm.price) || 0;
                const discountPercent = parseFloat(discountVal) || 0;
                
                const calculatedOfferPrice = originalPrice 
                  ? Math.round(originalPrice - (originalPrice * discountPercent) / 100) 
                  : 0;

                setPForm({ 
                  ...pForm, 
                  discount: discountVal,
                  offerPrice: calculatedOfferPrice
                });
              }} 
              placeholder="e.g. 10" 
              className={`w-full border rounded-xl p-2.5 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
              }`} 
            />
          </div>

          {/* Offer Price */}
          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Offer Price 
            </label>
            <input 
              type="number" 
              readOnly
              value={pForm.offerPrice || ''} 
              placeholder="Calculated price" 
              className={`w-full border rounded-xl p-2.5 font-semibold ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-emerald-400' 
                  : 'bg-emerald-50/50 border-emerald-200 text-emerald-700'
              }`} 
            />
          </div>
        </div>

        {/* Offer Validity Date Input */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Offer Valid Until
          </label>
          <input 
            type="date" 
            required
            min={new Date().toISOString().split('T')[0]} 
            value={pForm.validUntil || ''} 
            onChange={(e) => setPForm({ ...pForm, validUntil: e.target.value })} 
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white scheme-dark' : 'bg-orange-50/50 border-orange-200 text-slate-900'
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
            {saving ? 'Saving...' : isEditingProduct ? 'Update Offer' : 'Apply Offer'}
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