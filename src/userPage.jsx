import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from './api';
import Hero from './components/Hero';
import CategoriesSection from './components/CategoriesSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import BrandProductsModal from './components/BrandProductsModal';
import ProductModal from './components/ProductModal';

export default function UserPage({ shopInfo }) {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedBrandModal, setSelectedBrandModal] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [productData, serviceData] = await Promise.all([api.getProducts(), api.getServices()]);
        setProducts(Array.isArray(productData) ? productData : []);
        setServices(Array.isArray(serviceData) ? serviceData : []);
      } catch (err) {
        setLoadError('Could not load the catalog. Is the API server running?');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categoryProducts = selectedCategory ? products.filter(p => p.category === selectedCategory) : [];
  const availableBrands = [...new Set(categoryProducts.map(p => p.brand))];

  return (
    <div id="home" className="space-y-16 pb-16">
      <Hero />

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
      />

      <ServicesSection
        loading={loading}
        services={services}
        shopInfo={shopInfo}
      />

      <ContactSection shopInfo={shopInfo} />

      <AnimatePresence>
        {selectedBrandModal && (
          <BrandProductsModal
            brandName={selectedBrandModal}
            category={selectedCategory}
            products={products}
            shopInfo={shopInfo}
            onClose={() => setSelectedBrandModal(null)}
            onSelectProduct={setSelectedProduct}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            shopInfo={shopInfo}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}