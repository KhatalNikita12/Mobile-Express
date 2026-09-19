import React from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

const getProductImageUrl = (product) => {
  if (!product) return 'https://via.placeholder.com/300';

  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  if (typeof product.images === 'string' && product.images.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch (e) {}
  }

  if (typeof product.images === 'string' && product.images.trim().length > 0) {
    return product.images;
  }

  return product.image || 'https://via.placeholder.com/300';
};

export default function BrandProductsModal({ brandName, category, products, shopInfo, onClose, onSelectProduct, theme = 'dark' }) {
  const isDark = theme === 'dark';

  const brandItems = products.filter(p => 
    p.brand?.toLowerCase() === brandName?.toLowerCase() && 
    p.category?.toLowerCase() === category?.toLowerCase()
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={`rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative border transition-colors duration-300 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
        }`}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className={`sticky top-0 border-b px-6 py-4 flex justify-between items-center z-10 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-orange-100'
        }`}>
          <div>
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-400' : 'text-orange-600'}`}>
              {category} Collection
            </span>
            <h3 className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{brandName} Models</h3>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-full transition ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-orange-50 hover:bg-orange-100 text-slate-700'}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Container with Custom Scrollbar */}
        <div className="p-6 overflow-y-auto max-h-[65vh] pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {brandItems.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  No products found for {brandName} under {category}. Try adding some from the Admin Panel!
                </p>
              </div>
            ) : (
              brandItems.map(product => {
                const productImg = getProductImageUrl(product);

                return (
                  <div 
                    key={product.id} 
                    className={`rounded-2xl p-4 border flex flex-col justify-between space-y-4 shadow-sm ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-orange-50/30 border-orange-100'
                    }`}
                  >
                    <div className={`h-40 rounded-xl flex items-center justify-center p-4 relative overflow-hidden border ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-orange-100'
                    }`}>
                      <img src={productImg} alt={product.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="space-y-1">
                      <h4 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>{product.name}</h4>
                      <p className={`font-extrabold text-lg ${isDark ? 'text-indigo-400' : 'text-orange-600'}`}>
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="space-y-2 pt-2 border-t border-slate-800/10">
                      <button
                        onClick={() => { onClose(); onSelectProduct(product); }}
                        className={`w-full text-xs font-semibold py-2.5 rounded-xl transition shadow-sm ${
                          isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        View Full Specs
                      </button>
                      <a
                        href={`https://wa.me/${shopInfo.whatsappNumber}?text=Hi,%20I%20want%20to%20enquire%20about%20${product.brand}%20${product.name}%20priced%20at%20₹${product.price}`}
                        target="_blank" rel="noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}