import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ChevronRight, ArrowLeft } from 'lucide-react';

const gridStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } }
};

const cardEnter = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
};

const headingEnter = {
  hidden: { opacity: 0, y: -12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export default function CategoriesSection({
  loading,
  selectedCategory,
  setSelectedCategory,
  categoryProducts,
  availableBrands,
  setSelectedBrandModal,
  categories = [],
  theme = 'dark'
}) {
  const isDark = theme === 'dark';

  return (
    <section id="categories" className="max-w-7xl mx-auto pb-4 px-3 space-y-8">
      <div className={`relative flex flex-col items-center gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-orange-100'
      }`}>
        <motion.div
          initial="hidden"
          animate="show"
          variants={headingEnter}
          className="text-center space-y-2"
        >
          <span className={`text-xs font-bold uppercase tracking-[0.2em] ${
            isDark ? 'text-indigo-400' : 'text-orange-600'
          }`}>
            Browse the store
          </span>
          <h2 className={`text-3xl md:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Shop By Category
          </h2>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 56 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className={`h-1 rounded-full mx-auto ${isDark ? 'bg-indigo-500' : 'bg-orange-500'}`}
          />
        </motion.div>

        {selectedCategory && (
          <motion.button
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedCategory(null)}
            className={`md:absolute md:right-0 md:top-0 flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition ${
              isDark
                ? 'text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20'
                : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
            }`}
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Categories
          </motion.button>
        )}
      </div>

      {loading ? (
        <CatalogSkeleton theme={theme} />
      ) : !selectedCategory ? (
        categories.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border border-dashed ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-orange-200 text-slate-500'
          }`}>
            <p>No categories added yet. Add some from the Admin Panel!</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={gridStagger}
            initial="hidden"
            animate="show"
          >
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                variants={cardEnter}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-8 rounded-2xl border cursor-pointer transition-shadow duration-300 flex flex-col justify-between space-y-6 shadow-sm ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:shadow-indigo-500/10'
                    : 'bg-white border-orange-200 hover:border-orange-400 hover:shadow-orange-100'
                }`}
              >
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-orange-50 text-orange-600'
                  }`}>
                    <Smartphone className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{cat.name}</h3>
                    <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Explore brand collections & models</p>
                  </div>
                </div>
                <div className={`flex items-center justify-between pt-4 border-t font-semibold text-sm ${
                  isDark ? 'border-slate-800 text-indigo-400' : 'border-orange-100 text-orange-600'
                }`}>
                  <span>Explore Brands</span>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )
      ) : (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl flex items-center justify-between ${
            isDark ? 'bg-indigo-950 text-white border border-indigo-900' : 'bg-orange-500 text-white shadow-md'
          }`}>
            <div>
              <span className={`text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-indigo-300' : 'text-orange-100'}`}>Active Category</span>
              <h3 className="text-2xl font-bold capitalize">{selectedCategory} Selection</h3>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
              isDark ? 'bg-indigo-900 text-indigo-200' : 'bg-orange-600 text-orange-100'
            }`}>
              {availableBrands.length} Brands Available
            </span>
          </div>

          {availableBrands.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border border-dashed ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-orange-200 text-slate-500'
            }`}>
              <p>No brands found in this category yet. Check back soon!</p>
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

                const previewImage = (firstProduct?.images && firstProduct.images.length > 0)
                  ? firstProduct.images[0]
                  : (firstProduct?.image || 'https://via.placeholder.com/300');

                return (
                  <motion.div
                    key={brand}
                    variants={cardEnter}
                    whileHover={{ y: -4 }}
                    onClick={() => setSelectedBrandModal(brand)}
                    className={`rounded-2xl overflow-hidden border cursor-pointer transition-shadow duration-300 flex flex-col justify-between shadow-sm ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:shadow-indigo-500/10'
                        : 'bg-white border-orange-200 hover:border-orange-400 hover:shadow-orange-100'
                    }`}
                  >
                    <div className={`h-48 overflow-hidden relative flex items-center justify-center p-6 border-b ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-orange-50/50 border-orange-100'
                    }`}>
                      <img src={previewImage} alt={brand} className="max-h-full max-w-full object-contain" />
                      <span className="absolute top-3 right-3 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {brandProducts.length} items
                      </span>
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <span className={`text-[11px] font-bold uppercase tracking-widest ${
                          isDark ? 'text-indigo-400' : 'text-orange-600'
                        }`}>Brand Collection</span>
                        <h4 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{brand}</h4>
                      </div>
                      <button className={`w-full font-semibold py-2.5 rounded-xl text-sm transition flex items-center justify-center gap-1 ${
                        isDark
                          ? 'bg-indigo-500/10 hover:bg-indigo-600 text-indigo-400 hover:text-white'
                          : 'bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white'
                      }`}>
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

function CatalogSkeleton({ theme = 'dark' }) {
  const isDark = theme === 'dark';
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map(i => (
        <div key={i} className={`p-8 rounded-2xl border space-y-6 animate-pulse ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-orange-200'
        }`}>
          <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-orange-100'}`} />
          <div className="space-y-2">
            <div className={`h-5 rounded w-2/3 ${isDark ? 'bg-slate-800' : 'bg-orange-100'}`} />
            <div className={`h-3 rounded w-full ${isDark ? 'bg-slate-800' : 'bg-orange-100'}`} />
          </div>
        </div>
      ))}
    </div>
  );
}