import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, ShoppingBag, ChevronRight, ArrowLeft } from 'lucide-react';

export const CATEGORIES = [
  { id: 'mobile', name: 'Smartphones', icon: <Smartphone className="h-8 w-8 text-indigo-600" />, desc: 'Latest 5G smartphones & flagships', bg: 'bg-indigo-50' },
  { id: 'laptop', name: 'Laptops & PCs', icon: <Laptop className="h-8 w-8 text-blue-600" />, desc: 'High-performance work & gaming laptops', bg: 'bg-blue-50' },
  { id: 'washing machine', name: 'Washing Machines', icon: <ShoppingBag className="h-8 w-8 text-teal-600" />, desc: 'Front & top load smart washing machines', bg: 'bg-teal-50' }
];

const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const cardEnter = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

export default function CategoriesSection({
  loading,
  selectedCategory,
  setSelectedCategory,
  categoryProducts,
  availableBrands,
  setSelectedBrandModal
}) {
  return (
    <section id="categories" className="max-w-7xl mx-auto px-4 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-4">
        <div>
          <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">Catalog</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Shop By Category</h2>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Categories
          </button>
        )}
      </div>

      {loading ? (
        <CatalogSkeleton />
      ) : !selectedCategory ? (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={gridStagger}
          initial="hidden"
          animate="show"
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              variants={cardEnter}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCategory(cat.id)}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 cursor-pointer transition-shadow duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center`}>
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{cat.name}</h3>
                  <p className="text-slate-500 text-sm mt-1">{cat.desc}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-indigo-600 font-semibold text-sm">
                <span>Explore Brands</span>
                <ChevronRight className="h-5 w-5" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-indigo-300 text-xs uppercase tracking-wider font-semibold">Active Category</span>
              <h3 className="text-2xl font-bold capitalize">{selectedCategory}s Selection</h3>
            </div>
            <span className="bg-indigo-800 text-indigo-200 px-3 py-1 rounded-lg text-xs font-medium">
              {availableBrands.length} Brands Available
            </span>
          </div>

          {availableBrands.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed">
              <p className="text-slate-500">No products found in this category yet. Check back soon!</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={gridStagger}
              initial="hidden"
              animate="show"
            >
              {availableBrands.map(brand => {
                const brandProducts = categoryProducts.filter(p => p.brand === brand);
                const firstProduct = brandProducts[0];
                
                // FIXED: Check images array first, then fallback to single image or placeholder
                const previewImage = (firstProduct?.images && firstProduct.images.length > 0) 
                  ? firstProduct.images[0] 
                  : (firstProduct?.image || 'https://via.placeholder.com/300');

                return (
                  <motion.div
                    key={brand}
                    variants={cardEnter}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBrandModal(brand)}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 cursor-pointer transition-shadow duration-300 flex flex-col justify-between"
                  >
                    <div className="h-48 bg-slate-50 overflow-hidden relative flex items-center justify-center p-6 border-b">
                      <img src={previewImage} alt={brand} className="max-h-full max-w-full object-contain" />
                      <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {brandProducts.length} items
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest">Brand Collection</span>
                        <h4 className="text-xl font-extrabold text-slate-900">{brand}</h4>
                      </div>
                      <button className="w-full bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1">
                        View All Models <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6 animate-pulse">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-5 bg-slate-100 rounded w-2/3" />
            <div className="h-3 bg-slate-100 rounded w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}