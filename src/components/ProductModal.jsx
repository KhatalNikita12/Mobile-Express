import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle, Tag } from 'lucide-react';
import { api } from '../api'; // adjust path if this modal lives outside the same folder as api.js

export default function ProductModal({ product, shopInfo, onClose }) {
  const imageList = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://via.placeholder.com/300'];

  const [activeImage, setActiveImage] = useState(imageList[0]);
  const [offer, setOffer] = useState(null);
  const [offerLoading, setOfferLoading] = useState(true);

  // Fetch offers and find the one that matches this specific product.
 useEffect(() => {
  let cancelled = false;
  const loadOffer = async () => {
    try {
      setOfferLoading(true);
      const data = await api.getProductWithOffer(product.id); // new api method hitting /:id/with-offer
      if (!cancelled) setOffer(data.activeOffer);
    } catch (err) {
      console.error('Failed to load offer for product', err);
      if (!cancelled) setOffer(null);
    } finally {
      if (!cancelled) setOfferLoading(false);
    }
  };
  loadOffer();
  return () => { cancelled = true; };
}, [product.id]);

  const hasOffer = !!offer;

  // Single source of truth for price: use the OFFER table's offer_price
  // when an active offer exists for this product, otherwise fall back
  // to the PRODUCT table's own price. Every price shown below (badge,
  // header, WhatsApp message) reads from these two values only.
  const originalPrice = Number(product.price) || 0;
  const displayPrice = hasOffer ? Number(offer.offer_price) : originalPrice;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ''
      : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const whatsappMessage = hasOffer
    ? `Hi, I am interested in buying/enquiring about: ${product.brand} ${product.name} (Offer Price: ₹${displayPrice}, was ₹${originalPrice})`
    : `Hi, I am interested in buying/enquiring about: ${product.brand} ${product.name} (Price: ₹${displayPrice})`;
  const whatsappUrl = `https://wa.me/${shopInfo.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition z-10">
          <X className="h-5 w-5 text-slate-700" />
        </button>

        {/* Main Preview Image */}
        <div className="h-64 bg-slate-50 flex items-center justify-center p-6 border-b relative">
          {hasOffer && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
              <Tag className="h-3 w-3" /> {offer.discount_percentage}% OFF
            </span>
          )}
          <img src={activeImage} alt={product.name} className="max-h-full max-w-full object-contain" />
        </div>

        {/* Thumbnails Row */}
        {imageList.length > 1 && (
          <div className="flex gap-2 p-3 bg-slate-100 overflow-x-auto justify-center">
            {imageList.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                className={`w-14 h-14 rounded-lg border-2 overflow-hidden bg-white flex items-center justify-center transition ${activeImage === img ? 'border-indigo-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="" className="max-h-full max-w-full object-contain p-1" />
              </button>
            ))}
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-indigo-600 uppercase">{product.brand} • {product.category}</span>
              <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
            </div>

            <div className="text-right">
              {hasOffer ? (
                <>
                  <span className="block text-sm text-slate-400 line-through">
                    ₹{originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xl font-extrabold text-rose-600">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                </>
              ) : (
                <span className="text-xl font-extrabold text-indigo-600">
                  ₹{displayPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Offer banner */}
          {!offerLoading && hasOffer && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Special offer — {offer.discount_percentage}% off
              </div>
              {offer.valid_until && (
                <span className="text-xs text-rose-500 whitespace-nowrap">
                  Valid until {formatDate(offer.valid_until)}
                </span>
              )}
            </div>
          )}

          <div className="space-y-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Specifications</h4>
            <p className="text-slate-700 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100">{product.specs}</p>
          </div>

          <div className="pt-4 flex gap-3">
            <a
              href={whatsappUrl} target="_blank" rel="noreferrer"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-center py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-md"
            >
              <MessageCircle className="h-5 w-5" /> Enquire on WhatsApp
            </a>
            <button onClick={onClose} className="px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-3 rounded-xl transition">
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}