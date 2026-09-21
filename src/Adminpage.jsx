import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { api } from './api';
import AdminHeader from './components/AdminHeader';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';
import ServiceForm from './components/ServiceForm';
import ServiceTable from './components/ServiceTable';
import CategoryBrandManager from './components/CategoryBrandManager';
import OffersForm from './components/OffersForm';
import OffersTable from './components/OffersTable';
import Toast from './components/Toast';

const EMPTY_PRODUCT = { id: null, category: '', name: '', brand: '', price: '', specs: '' };
const EMPTY_SERVICE = { id: null, category: 'mobile', name: '', description: '', price: '' };

export default function AdminPage({ theme = 'dark' }) {
  const [activeSubTab, setActiveSubTab] = useState('products');

  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]); // <--- Categories state
  const [brands, setBrands] = useState([]);         // <--- Brands state

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [pForm, setPForm] = useState(EMPTY_PRODUCT);
  const [isEditingProduct, setIsEditingProduct] = useState(false);

  const [sForm, setSForm] = useState(EMPTY_SERVICE);
  const [isEditingService, setIsEditingService] = useState(false);

  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch products, services, categories, and brands from their separate tables
      const [productData, serviceData, categoryData, brandData] = await Promise.all([
        api.getProducts(),
        api.getServices(),
        api.getCategories(),
        api.getBrands(),
      ]);
      setProducts(Array.isArray(productData) ? productData : []);
      setServices(Array.isArray(serviceData) ? serviceData : []);
      setCategories(Array.isArray(categoryData) ? categoryData : []);
      setBrands(Array.isArray(brandData) ? brandData : []);
    } catch (err) {
      console.error('Failed to load admin data', err);
      setProducts([]);
      setServices([]);
      setCategories([]);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadData(); 
  }, [loadData]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2500);
  };

  // ---- Products Submission Handler ----
  const handleProductSubmit = async (e, customFormData = null) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    setSaving(true);
    try {
      const payload = customFormData || pForm;

      if (isEditingProduct) {
        const updated = await api.updateProduct(pForm.id, payload);
        setProducts(products.map(p => (p.id === updated.id ? updated : p)));
        showToast('success', 'Product updated');
      } else {
        const created = await api.createProduct(payload);
        setProducts([created, ...products]);
        showToast('success', 'Product added');
      }
      resetProductForm();
    } catch (err) {
      showToast('error', err.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  const handleOfferSubmit = async (e, customFormData = null) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setSaving(true);
    try {
      const payload = customFormData || pForm;

      if (isEditingProduct) {
        const updated = await api.updateProduct(pForm.id, payload);
        setOffers(products.map(p => (p.id === updated.id ? updated : p)));
        showToast('success', 'Offers Apply');
      } else {
        const created = await api.create(payload);
        setOffers([created, ...products]);
        showToast('success', 'Offers Apply');
      }
      resetProductForm();
    } catch (err) {
      showToast('error', err.message || 'Could not save product');
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setPForm(product);
    setIsEditingProduct(true);
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showToast('success', 'Product deleted');
    } catch (err) {
      showToast('error', err.message || 'Could not delete product');
    }
  };

  const resetProductForm = () => {
    setPForm(EMPTY_PRODUCT);
    setIsEditingProduct(false);
  };

  // ---- Services Submission Handler ----
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditingService) {
        const updated = await api.updateService(sForm.id, sForm);
        setServices(services.map(s => (s.id === updated.id ? updated : s)));
        showToast('success', 'Service updated');
      } else {
        const created = await api.createService(sForm);
        setServices([created, ...services]);
        showToast('success', 'Service added');
      }
      resetServiceForm();
    } catch (err) {
      showToast('error', err.message || 'Could not save service');
    } finally {
      setSaving(false);
    }
  };

  const editService = (service) => {
    setSForm(service);
    setIsEditingService(true);
  };

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.deleteService(id);
      setServices(services.filter(s => s.id !== id));
      showToast('success', 'Service deleted');
    } catch (err) {
      showToast('error', err.message || 'Could not delete service');
    }
  };

  const resetServiceForm = () => {
    setSForm(EMPTY_SERVICE);
    setIsEditingService(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`max-w-7xl mx-auto px-4 py-10 space-y-8 transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-slate-900'
    }`}>
      <AdminHeader 
        activeSubTab={activeSubTab} 
        setActiveSubTab={setActiveSubTab} 
        theme={theme} 
      />

      {activeSubTab === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ProductForm
            pForm={pForm}
            setPForm={setPForm}
            isEditingProduct={isEditingProduct}
            handleProductSubmit={handleProductSubmit}
            resetProductForm={resetProductForm}
            saving={saving}
            categories={categories} // <--- Passed down here
            brands={brands}             // <--- Passed down here
            theme={theme}
          />
          <ProductTable
            products={products}
            loading={loading}
            editProduct={editProduct}
            deleteProduct={deleteProduct}
            theme={theme}
          />
        </div>
      ) : activeSubTab === 'services' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ServiceForm
            sForm={sForm}
            setSForm={setSForm}
            isEditingService={isEditingService}
            handleServiceSubmit={handleServiceSubmit}
            resetServiceForm={resetServiceForm}
            saving={saving}
            theme={theme}
          />
          <ServiceTable
            services={services}
            loading={loading}
            editService={editService}
            deleteService={deleteService}
            theme={theme}
          />
        </div>
      ) : activeSubTab==='offers' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <OffersForm 
            pForm={pForm}
            setPForm={setPForm}
            isEditingProduct={isEditingProduct}
            handleOfferSubmit={handleOfferSubmit}
            resetProductForm={resetProductForm}
            saving={saving}
            categories={categories} // <--- Passed down here
            brands={brands}  
            product={products}         
            theme={theme}></OffersForm>
           <OffersTable></OffersTable>
        </div>
      ):(
        <CategoryBrandManager theme={theme} showToast={showToast} />
      ) }

      <AnimatePresence>
        <Toast toast={toast} />
      </AnimatePresence>
    </div>
  );
}