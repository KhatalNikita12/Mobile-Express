import React from 'react';

export default function OffersTable({
  offers = [],
  loading = false,
  editOffers,
  deleteOffers,
  categories = [],
  brands = [],
  products = [],
  theme = 'dark'
}) {
  const isDark = theme === 'dark';

  // Normalize product list input
  const productList = Array.isArray(products) 
    ? products 
    : (products?.products || products?.data || []);

  // Helper function to resolve human-readable names for Category, Brand, and Product
  const getEntityName = (id, type) => {
    if (!id) return 'N/A';
    
    if (type === 'category') {
      const match = categories.find((c) => String(c.id) === String(id));
      return match?.name || 'N/A';
    }
    
    if (type === 'brand') {
      const match = brands.find((b) => String(b.id) === String(id));
      return match?.name || 'N/A';
    }
    
    if (type === 'product') {
      const match = productList.find((p) => String(p.id) === String(id));
      return match?.name || match?.title || match?.product_name || 'N/A';
    }

    return 'N/A';
  };

  // Format currency helpers
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || amount === '') return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? dateString
      : date.toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  };

  return (
    <div
      className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
      }`}
      style={{ width: '211%' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr
              className={`border-b text-xs uppercase tracking-wider ${
                isDark
                  ? 'bg-slate-950/50 border-slate-800 text-slate-400'
                  : 'bg-orange-50/50 border-orange-100 text-slate-500'
              }`}
            >
              <th className="py-3.5 px-4 font-semibold">Product</th>
              <th className="py-3.5 px-4 font-semibold">Brand</th>
              <th className="py-3.5 px-4 font-semibold">Category</th>
              <th className="py-3.5 px-4 font-semibold">Orig. Price</th>
              <th className="py-3.5 px-4 font-semibold">Discount</th>
              <th className="py-3.5 px-4 font-semibold">Offer Price</th>
              <th className="py-3.5 px-4 font-semibold">Valid Until</th>
              <th className="py-3.5 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-orange-100'}`}>
            {loading ? (
              /* Loading Skeletons */
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-4"><div className={`h-4 rounded w-28 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                  <td className="py-4 px-4"><div className={`h-4 rounded w-20 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                  <td className="py-4 px-4"><div className={`h-4 rounded w-20 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                  <td className="py-4 px-4"><div className={`h-4 rounded w-16 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                  <td className="py-4 px-4"><div className={`h-4 rounded w-12 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                  <td className="py-4 px-4"><div className={`h-4 rounded w-16 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                  <td className="py-4 px-4"><div className={`h-4 rounded w-24 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                  <td className="py-4 px-4"><div className={`h-4 rounded w-12 mx-auto ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} /></td>
                </tr>
              ))
            ) : offers.length === 0 ? (
              /* Empty State */
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-500 font-medium">
                  No active offers found.
                </td>
              </tr>
            ) : (
              /* Data Rows */
              offers.map((offer) => {
                const productName =
                  offer.products?.name ||
                  offer.product_name ||
                  getEntityName(offer.product_id, 'product');

                const brandName =
                  offer.brands?.name ||
                  offer.brand_name ||
                  getEntityName(offer.brand_id, 'brand');

                const categoryName =
                  offer.categories?.name ||
                  offer.category_name ||
                  getEntityName(offer.category_id, 'category');

                return (
                  <tr
                    key={offer.id}
                    className={`transition-colors hover:${
                      isDark ? 'bg-slate-800/40' : 'bg-orange-50/30'
                    }`}
                  >
                    {/* Product */}
                    <td className="py-3.5 px-4 font-medium">{productName}</td>

                    {/* Brand */}
                    <td className={`py-3.5 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {brandName}
                    </td>

                    {/* Category */}
                    <td className={`py-3.5 px-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {categoryName}
                    </td>

                    {/* Original Price */}
                    <td className={`py-3.5 px-4 line-through ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {formatCurrency(offer.original_price)}
                    </td>

                    {/* Discount % */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${
                          isDark
                            ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}
                      >
                        {offer.discount_percentage ? `${offer.discount_percentage}% OFF` : '0%'}
                      </span>
                    </td>

                    {/* Offer Price */}
                    <td className="py-3.5 px-4 font-semibold text-emerald-500">
                      {formatCurrency(offer.offer_price)}
                    </td>

                    {/* Validity Date */}
                    <td className={`py-3.5 px-4 whitespace-nowrap ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {formatDate(offer.valid_until)}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => editOffers(offer)}
                          title="Edit Offer"
                          className={`p-1.5 rounded-lg border transition ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-indigo-400 hover:bg-slate-700 hover:text-indigo-300'
                              : 'bg-slate-50 border-slate-200 text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => deleteOffers(offer.id)}
                          title="Delete Offer"
                          className={`p-1.5 rounded-lg border transition ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 text-rose-400 hover:bg-slate-700 hover:text-rose-300'
                              : 'bg-slate-50 border-slate-200 text-rose-600 hover:bg-rose-50'
                          }`}
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}