import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from './api';
import Hero from './components/Hero';
import CategoriesSection from './components/CategoriesSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import BrandProductsModal from './components/BrandProductsModal';
import ProductModal from './components/ProductModal';

export default function UserPage({ shopInfo, theme = 'dark' }) {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]); // <--- Dynamic categories state
  const [brands, setBrands] = useState([]);         // <--- Dynamic brands state
  
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrandModal, setSelectedBrandModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Fetch products, services, categories, and brands in parallel
        const [productData, serviceData, categoryData, brandData] = await Promise.all([
          api.getProducts(),
          api.getServices(),
          api.getCategories(),
          api.getBrands()
        ]);
        setProducts(Array.isArray(productData) ? productData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
        setCategories(Array.isArray(categoryData) ? categoryData : []);
        setBrands(Array.isArray(brandData) ? brandData : []);
      } catch (err) {
        setLoadError('Could not load the catalog. Is the API server running?');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter products by selected category name
  const categoryProducts = selectedCategory ? products.filter(p => p.category?.toLowerCase() === selectedCategory?.toLowerCase()) : [];
  
  // Find category object to get its ID, then filter brands linked specifically to this category ID
  const activeCategoryObj = categories.find(c => c.name?.toLowerCase() === selectedCategory?.toLowerCase());
  const availableBrands = brands
    .filter(b => activeCategoryObj ? b.category_id === activeCategoryObj.id : false)
    .map(b => b.name);

  return (
    <div id="home" className={`space-y-16 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
    }`}>
      <Hero theme={theme} />

      {loadError && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl p-4">{loadError}</div>
        </div>
      )}

      <CategoriesSection
        loading={loading}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categoryProducts={categoryProducts}
        availableBrands={availableBrands}
        setSelectedBrandModal={setSelectedBrandModal}
        categories={categories} // <--- Pass dynamic categories down
        brands={brands}             // <--- Pass dynamic brands down
        theme={theme}
      />

      <ServicesSection
        loading={loading}
        services={services}
        shopInfo={shopInfo}
        theme={theme}
      />

      <ContactSection shopInfo={shopInfo} theme={theme} />

      <AnimatePresence>
        {selectedBrandModal && (
          <BrandProductsModal
            brandName={selectedBrandModal}
            category={selectedCategory}
            products={products}
            shopInfo={shopInfo}
            onClose={() => setSelectedBrandModal(null)}
            onSelectProduct={setSelectedProduct}
            theme={theme}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            shopInfo={shopInfo}
            onClose={() => setSelectedProduct(null)}
            theme={theme}
          />
        )}
      </AnimatePresence>
    </div>
  );
}