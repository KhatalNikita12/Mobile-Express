import React from 'react';

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

  const productList = Array.isArray(product) 
    ? product 
    : (product?.products || product?.data || []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formElement = e.target;
    
    // Extract raw string values from state or direct form DOM elements
    const rawCat = pForm.category_id || pForm.category || formElement.querySelector('[name="category_id"]')?.value;
    const rawProd = pForm.product_id || pForm.product || formElement.querySelector('[name="product_id"]')?.value;
    const rawBrand = pForm.brand_id || pForm.brand || formElement.querySelector('[name="brand_id"]')?.value;

    // Helper to keep clean UUID strings without forcing Number() conversion
    const cleanUuid = (val) => {
      if (!val || val === 'undefined' || val === 'null' || val === '') return null;
      return String(val).trim();
    };

    const payload = {
      category_id: cleanUuid(rawCat),
      brand_id: cleanUuid(rawBrand),
      product_id: cleanUuid(rawProd),
      original_price: pForm.original_price !== '' && pForm.original_price !== null ? Number(pForm.original_price) : null,
      discount_percentage: pForm.discount_percentage !== '' ? Number(pForm.discount_percentage) : 0,
      offer_price: pForm.offer_price !== '' && pForm.offer_price !== null ? Number(pForm.offer_price) : null,
      valid_until: pForm.valid_until || null,
      is_active: true
    };

    console.log("✅ FIXED UUID PAYLOAD SENT TO SUPABASE:", payload);

    handleOfferSubmit(e, payload); 
  };

  // Keep dropdown string state variables synced
  const selectedCatId = String(pForm.category_id || pForm.category || '');
  const selectedBrandId = String(pForm.brand_id || pForm.brand || '');
  const selectedProdId = String(pForm.product_id || pForm.product || '');

  const selectedCategoryObj = categories.find(
    (c) => String(c.id) === selectedCatId
  );

  const filteredBrands = brands.filter((b) => 
    selectedCategoryObj 
      ? String(b.category_id || b.categoryId) === selectedCatId 
      : true
  );

  const selectedBrandObj = brands.find(
    (b) => String(b.id) === selectedBrandId
  );

  const filteredProducts = productList.filter((p) => {
    if (!selectedBrandId) return true;

    const productBrandId = p.brand_id || p.brandId;
    if (productBrandId && String(productBrandId) === selectedBrandId) {
      return true;
    }

    const selectedBrandName = selectedBrandObj ? String(selectedBrandObj.name || '').trim().toLowerCase() : '';
    const productBrandName = String(p.brand_name || p.brand || p.brandName || '').trim().toLowerCase();

    if (selectedBrandName && productBrandName) {
      return productBrandName === selectedBrandName;
    }

    return false;
  });

  return (
    <div className={`p-6 rounded-2xl border shadow-sm space-y-4 h-fit transition-colors duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
    }`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        
        {/* Category Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Category
          </label>
          <select
            name="category_id"
            value={selectedCatId}
            onChange={(e) => setPForm({ 
              ...pForm, 
              category_id: e.target.value,
              category: e.target.value,
              brand_id: '', 
              brand: '',
              product_id: '',
              product: '',
              original_price: '',
              offer_price: ''
            })}
            required
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            }`}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Brand
          </label>
          <select
            name="brand_id"
            value={selectedBrandId}
            onChange={(e) => {
              setPForm({ 
                ...pForm, 
                brand_id: e.target.value,
                brand: e.target.value, 
                product_id: '',
                product: '',
                original_price: '',
                offer_price: ''
              });
            }}
            required
            disabled={!selectedCatId}
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            } ${!selectedCatId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">-- Select Brand --</option>
            {filteredBrands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product Dropdown */}
        <div>
          <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Product
          </label>
          <select
            name="product_id"
            value={selectedProdId}
            onChange={(e) => {
              const selectedProductId = e.target.value;
              const selectedProductObj = productList.find(p => String(p.id) === String(selectedProductId));
              
              const rawPrice = selectedProductObj 
                ? (selectedProductObj.original_price ?? selectedProductObj.price) 
                : '';
              const originalPrice = rawPrice !== '' && rawPrice !== null ? Number(rawPrice) : '';

              const discountPercent = parseFloat(pForm.discount_percentage) || 0;
              const calculatedOfferPrice = originalPrice !== '' 
                ? Math.round(originalPrice - (originalPrice * discountPercent) / 100) 
                : '';

              setPForm({ 
                ...pForm, 
                product_id: selectedProductId,
                product: selectedProductId,
                original_price: originalPrice,
                offer_price: calculatedOfferPrice
              });
            }}
            disabled={!selectedBrandId}
            required
            className={`w-full border rounded-xl p-2.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
            } ${!selectedBrandId ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">-- Select Product --</option>
            {filteredProducts.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name || prod.title || prod.product_name}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing & Discount Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Original Price 
            </label>
            <input 
              type="number" 
              name="original_price"
              readOnly
              value={pForm.original_price ?? ''} 
              placeholder="Select a product" 
              className={`w-full border rounded-xl p-2.5 opacity-80 cursor-not-allowed ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`} 
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Discount (%)
            </label>
            <input 
              type="number" 
              name="discount_percentage"
              min="0"
              max="100"
              value={pForm.discount_percentage ?? ''} 
              onChange={(e) => {
                const discountVal = e.target.value;
                const originalPrice = parseFloat(pForm.original_price) || 0;
                const discountPercent = parseFloat(discountVal) || 0;
                
                const calculatedOfferPrice = originalPrice 
                  ? Math.round(originalPrice - (originalPrice * discountPercent) / 100) 
                  : '';

                setPForm({ 
                  ...pForm, 
                  discount_percentage: discountVal,
                  offer_price: calculatedOfferPrice
                });
              }} 
              placeholder="e.g. 10" 
              className={`w-full border rounded-xl p-2.5 ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
              }`} 
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Offer Price 
            </label>
            <input 
              type="number" 
              name="offer_price"
              readOnly
              value={pForm.offer_price ?? ''} 
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
            name="valid_until"
            required
            min={new Date().toISOString().split('T')[0]} 
            value={pForm.valid_until || ''} 
            onChange={(e) => setPForm({ ...pForm, valid_until: e.target.value })} 
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