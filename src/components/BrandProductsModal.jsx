import React from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';

// Robust helper to safely extract the first valid image URL
const getProductImageUrl = (product) => {
  if (!product) return 'https://via.placeholder.com/300';

  // DEBUG LOG: Open your browser console (F12) to see what this outputs for the failing product
  console.log("Checking product image data for:", product.name, "Images field:", product.images);

  // 1. If images is already a proper array with items
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }

  // 2. If images is stored as a JSON string
  if (typeof product.images === 'string' && product.images.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch (e) {
      // fallback
    }
  }

  // 3. If images is a standard URL string
  if (typeof product.images === 'string' && product.images.trim().length > 0) {
    return product.images;
  }

  // 4. Fallback placeholder or single image property
  return product.image || 'https://via.placeholder.com/300';
};

export default function BrandProductsModal({ brandName, category, products, shopInfo, onClose, onSelectProduct }) {
  const brandItems = products.filter(p => p.brand === brandName && p.category === category);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{category} Collection</span>
            <h3 className="text-2xl font-extrabold text-slate-900">{brandName} Models</h3>
          </div>
          <button onClick={onClose} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition">
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {brandItems.map(product => {
            const productImg = getProductImageUrl(product);

            return (
              <div key={product.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-4">
                <div className="h-40 bg-white rounded-xl flex items-center justify-center p-4 relative overflow-hidden">
                  <img src={productImg} alt={product.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-base">{product.name}</h4>
                  <p className="text-slate-900 font-extrabold text-lg">₹{Number(product.price).toLocaleString('en-IN')}</p>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => { onClose(); onSelectProduct(product); }}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow-sm"
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
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}