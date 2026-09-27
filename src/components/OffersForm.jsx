import React from 'react';

// Empty/default shape for the Offers form. Every relational field is an ID
// (category_id / brand_id / product_id) — never a plain text name — because
// that's what the `offers` table actually stores as foreign keys.
export const EMPTY_OFFER_FORM = {
  id: null,
  category_id: '',
  brand_id: '',
  product_id: '',
  original_price: '',
  discount_percentage: '',
  offer_price: '',
  valid_until: '',
  is_active: true,
};

export default function OffersForm({
  oForm,
  setOForm,
  isEditingOffer,
  handleOfferSubmit,
  resetOffersForm,
  saving,
  categories = [],
  brands = [],
  products = [],
  theme = 'dark',
}) {
  const isDark = theme === 'dark';

  const safeCategories = Array.isArray(categories) ? categories.filter(Boolean) : [];
  const safeBrands = Array.isArray(brands) ? brands.filter(Boolean) : [];
  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];

  const form = oForm || EMPTY_OFFER_FORM;

  // --- Resolve the currently selected rows (by ID) ---
  const selectedCategory = safeCategories.find(c => String(c.id) === String(form.category_id));
  const selectedBrand = safeBrands.find(b => String(b.id) === String(form.brand_id));
  const selectedProduct = safeProducts.find(p => String(p.id) === String(form.product_id));

  // Brands belonging to the selected category (brands table has a real category_id FK)
  const filteredBrands = safeBrands.filter(b =>
    form.category_id ? String(b.category_id) === String(form.category_id) : true
  );

  // Products only store `category` / `brand` as plain text (not ids), so we
  // filter the product list by matching those text fields against the
  // selected category/brand's *name* — but we still SAVE product_id (the id).
  const filteredProducts = safeProducts.filter(p => {
    const matchesCategory = selectedCategory
      ? (p.category || '').trim().toLowerCase() === (selectedCategory.name || '').trim().toLowerCase()
      : true;
    const matchesBrand = selectedBrand
      ? (p.brand || '').trim().toLowerCase() === (selectedBrand.name || '').trim().toLowerCase()
      : true;
    return matchesCategory && matchesBrand;
  });

  const recalcOfferPrice = (originalPrice, discountPercent) => {
    const price = parseFloat(originalPrice) || 0;
    const pct = parseFloat(discountPercent) || 0;
    if (!price) return '';
    return Math.round(price - (price * pct) / 100);
  };

  const handleCategoryChange = (e) => {
    setOForm({
      ...form,
      category_id: e.target.value,
      brand_id: '',
      product_id: '',
      original_price: '',
      offer_price: '',
    });
  };

  const handleBrandChange = (e) => {
    setOForm({
      ...form,
      brand_id: e.target.value,
      product_id: '',
      original_price: '',
      offer_price: '',
    });
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const productObj = safeProducts.find(p => String(p.id) === String(productId));
    const originalPrice = productObj ? productObj.price : '';
    const offerPrice = recalcOfferPrice(originalPrice, form.discount_percentage);

    setOForm({
      ...form,
      product_id: productId,
      original_price: originalPrice,
      offer_price: offerPrice,
    });
  };

  const handleDiscountChange = (e) => {
    const discountVal = e.target.value;
    setOForm({
      ...form,
      discount_percentage: discountVal,
      offer_price: recalcOfferPrice(form.original_price, discountVal),
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // Plain JSON payload. category_id/brand_id/product_id are UUIDs, so they
    // stay as strings — only the numeric price/discount fields are coerced.
    // No file upload is involved in an offer, so FormData isn't needed here.
    const payload = {
      id: form.id,
      category_id: form.category_id || null,
      brand_id: form.brand_id || null,
      product_id: form.product_id || null,
      original_price: Number(form.original_price) || 0,
      discount_percentage: Number(form.discount_percentage) || 0,
      offer_price: Number(form.offer_price) || 0,
      valid_until: form.valid_until,
      is_active: form.is_active !== false,
    };

    handleOfferSubmit(e, payload);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const isExpiredPreview = form.valid_until && form.valid_until < todayStr;
  const discountNum = Number(form.discount_percentage) || 0;
  const originalNum = Number(form.original_price) || 0;
  const offerNum = Number(form.offer_price) || 0;

  const inputCls = `w-full border rounded-xl p-2.5 outline-none transition-colors ${
    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
  }`;
  const labelCls = `block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`;

  return (
    <div className={`p-6 rounded-2xl border shadow-sm space-y-4 h-fit transition-colors duration-300 ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">{isEditingOffer ? 'Edit Offer' : 'Apply New Offer'}</h3>
        {isEditingOffer && (
          <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
            Editing
          </span>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-4 text-sm">

        {/* Category dropdown — stores category_id, not the name */}
        <div>
          <label className={labelCls}>Category</label>
          <select value={form.category_id || ''} onChange={handleCategoryChange} required className={inputCls}>
            <option value="">-- Select Category --</option>
            {safeCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Brand dropdown — stores brand_id, not the name */}
        <div>
          <label className={labelCls}>Brand</label>
          <select
            value={form.brand_id || ''}
            onChange={handleBrandChange}
            disabled={!form.category_id}
            required
            className={`${inputCls} ${!form.category_id ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">-- Select Brand --</option>
            {filteredBrands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        {/* Product dropdown — stores product_id, not the name */}
        <div>
          <label className={labelCls}>Product</label>
          <select
            value={form.product_id || ''}
            onChange={handleProductChange}
            disabled={!form.brand_id}
            required
            className={`${inputCls} ${!form.brand_id ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">-- Select Product --</option>
            {filteredProducts.map((prod) => (
              <option key={prod.id} value={prod.id}>{prod.name}</option>
            ))}
          </select>
        </div>

        {/* Pricing & Discount Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Original Price</label>
            <input
              type="number"
              readOnly
              value={form.original_price || ''}
              placeholder="Select a product"
              className={`w-full border rounded-xl p-2.5 opacity-80 cursor-not-allowed ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            />
          </div>

          <div>
            <label className={labelCls}>Discount (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.discount_percentage || ''}
              onChange={handleDiscountChange}
              placeholder="e.g. 10"
              className={inputCls}
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>Offer Price</label>
            <input
              type="number"
              readOnly
              value={form.offer_price || ''}
              placeholder="Calculated price"
              className={`w-full border rounded-xl p-2.5 font-semibold ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-emerald-400'
                  : 'bg-emerald-50/50 border-emerald-200 text-emerald-700'
              }`}
            />
          </div>
        </div>

        {/* Offer Validity Date */}
        <div>
          <label className={labelCls}>Offer Valid Until</label>
          <input
            type="date"
            required
            value={form.valid_until || ''}
            onChange={(e) => setOForm({ ...form, valid_until: e.target.value })}
            className={`${inputCls} ${isDark ? 'scheme-dark' : ''}`}
          />
          {isExpiredPreview && (
            <p className="text-xs text-rose-500 mt-1">
              This date is in the past — once saved, the storefront will automatically show the
              original price instead of the offer price.
            </p>
          )}
        </div>

        {/* Active toggle */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_active !== false}
            onChange={(e) => setOForm({ ...form, is_active: e.target.checked })}
            className="h-4 w-4 rounded accent-indigo-500"
          />
          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Offer is active</span>
        </label>

        {/* --- Attractive live preview of how this offer will look to customers --- */}
        {form.product_id && originalNum > 0 && (
          <div
            className={`relative overflow-hidden rounded-2xl border p-4 ${
              isDark ? 'border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900' : 'border-orange-200 bg-gradient-to-br from-orange-50 to-white'
            }`}
          >
            {discountNum > 0 && !isExpiredPreview && (
              <span className="absolute top-0 right-0 bg-rose-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-xl shadow">
                {discountNum}% OFF
              </span>
            )}
            <p className={`text-[11px] uppercase tracking-wider font-bold mb-1 ${isDark ? 'text-indigo-400' : 'text-orange-600'}`}>
              Customer Preview
            </p>
            <p className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedProduct?.name || 'Product'}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {isExpiredPreview ? (
                <>
                  <span className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    ₹{originalNum.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30">
                    Offer expired — showing original price
                  </span>
                </>
              ) : discountNum > 0 ? (
                <>
                  <span className="text-xl font-extrabold text-emerald-500">₹{offerNum.toLocaleString('en-IN')}</span>
                  <span className={`text-sm line-through ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    ₹{originalNum.toLocaleString('en-IN')}
                  </span>
                </>
              ) : (
                <span className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  ₹{originalNum.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {form.valid_until && !isExpiredPreview && (
              <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Valid until {new Date(form.valid_until).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={saving}
            className={`flex-1 font-medium py-2.5 rounded-xl transition text-white ${
              isDark ? 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50' : 'bg-orange-500 hover:bg-orange-600 disabled:opacity-50'
            }`}
          >
            {saving ? 'Saving...' : isEditingOffer ? 'Update Offer' : 'Apply Offer'}
          </button>
          {isEditingOffer && (
            <button
              type="button"
              onClick={resetOffersForm}
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
