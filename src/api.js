const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // ---- Products ----
  getProducts: async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  createProduct: async (productData) => {
    const isFormData = productData instanceof FormData;
    const options = {
      method: 'POST',
      body: isFormData ? productData : JSON.stringify(productData),
    };

    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }

    const res = await fetch(`${API_BASE_URL}/products`, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to create product');
    }
    return res.json();
  },

  updateProduct: async (id, productData) => {
    const isFormData = productData instanceof FormData;
    const options = {
      method: 'PUT',
      body: isFormData ? productData : JSON.stringify(productData),
    };

    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }

    const res = await fetch(`${API_BASE_URL}/products/${id}`, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to update product');
    }
    return res.json();
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // ---- Services ----
  getServices: async () => {
    const res = await fetch(`${API_BASE_URL}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  createService: async (serviceData) => {
    const res = await fetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },

  updateService: async (id, serviceData) => {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },

  deleteService: async (id) => {
    const res = await fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },


// Add these inside your api object in frontend api.js
// Add inside your api object in api.js:

// Categories
getCategories: async () => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
},
createCategory: async (data) => {
  const res = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
},
deleteCategory: async (id) => {
  const res = await fetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.json();
},

// Brands
getBrands: async () => {
  const res = await fetch(`${API_BASE_URL}/brands`);
  if (!res.ok) throw new Error('Failed to fetch brands');
  return res.json();
},
createBrand: async (data) => {
  const res = await fetch(`${API_BASE_URL}/brands`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Failed to create brand');
  return res.json();
},
deleteBrand: async (id) => {
  const res = await fetch(`${API_BASE_URL}/brands/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete brand');
  return res.json();
}
};