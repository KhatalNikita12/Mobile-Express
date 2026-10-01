import { readToken, saveToken } from './AuthToken';

const API_BASE_URL = process.env.REACT_APP_API_URL;

// fetch() that automatically sends the admin token. If the server says the
// token is invalid/expired (401), it is cleared and the app returns to the login screen.
const authFetch = async (url, options = {}) => {
  const token = readToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401 && token) {
    saveToken(null);
    window.dispatchEvent(new Event('mx-auth-expired'));
  }
  return res;
};

export const api = {
  // ---- Products ----
  getProducts: async () => {
    const res = await authFetch(`${API_BASE_URL}/products`);
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

    const res = await authFetch(`${API_BASE_URL}/products`, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to create product');
    }
    return res.json();
  },

  updateProduct: async (id, productData) => {
    if (!id) {
      throw new Error("updateProduct requires a valid product ID");
    }

    const isFormData = productData instanceof FormData;
    const options = {
      method: 'PUT',
      body: isFormData ? productData : JSON.stringify(productData),
    };

    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }

    // Encode URI component to prevent syntax errors in the URL
    const res = await authFetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, options);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || `Failed to update product (HTTP ${res.status})`);
    }

    // Handle HTTP 204 (No Content) responses
    if (res.status === 204) {
      return { id, success: true };
    }

    return res.json();
  },

  deleteProduct: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Fetch a single product along with its currently active offer (if any).
  // The backend (/api/products/:id/with-offer) only returns an offer whose
  // valid_until is today or later, so once an offer's end date has passed
  // `activeOffer` naturally comes back null and callers fall back to the
  // product's own price.
  getProductWithOffer: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}/with-offer`);
    if (!res.ok) throw new Error('Failed to fetch product offer');
    return res.json();
  },

  // ---- Services ----
  getServices: async () => {
    const res = await authFetch(`${API_BASE_URL}/services`);
    if (!res.ok) throw new Error('Failed to fetch services');
    return res.json();
  },

  createService: async (serviceData) => {
    const res = await authFetch(`${API_BASE_URL}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error('Failed to create service');
    return res.json();
  },

  updateService: async (id, serviceData) => {
    const res = await authFetch(`${API_BASE_URL}/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    if (!res.ok) throw new Error('Failed to update service');
    return res.json();
  },

  deleteService: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/services/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return res.json();
  },

  // ---- Categories ----
  getCategories: async () => {
    const res = await authFetch(`${API_BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },
  
  createCategory: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json();
  },
  
  deleteCategory: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json();
  },

  // ---- Brands ----
  getBrands: async () => {
    const res = await authFetch(`${API_BASE_URL}/brands`);
    if (!res.ok) throw new Error('Failed to fetch brands');
    return res.json();
  },
  
  createBrand: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create brand');
    return res.json();
  },
  
  deleteBrand: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/brands/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete brand');
    return res.json();
  },

  // ---- About Us / Gallery ----
  getAboutGallery: async () => {
    const res = await authFetch(`${API_BASE_URL}/about-gallery`);
    if (!res.ok) throw new Error('Failed to fetch gallery items');
    return res.json();
  },

  createAboutGallery: async (galleryData) => {
    const isFormData = galleryData instanceof FormData;
    const options = {
      method: 'POST',
      body: isFormData ? galleryData : JSON.stringify(galleryData),
    };

    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }

    const res = await authFetch(`${API_BASE_URL}/about-gallery`, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to create gallery item');
    }
    return res.json();
  },

  updateAboutGallery: async (id, galleryData) => {
    const isFormData = galleryData instanceof FormData;
    const options = {
      method: 'PUT',
      body: isFormData ? galleryData : JSON.stringify(galleryData),
    };

    if (!isFormData) {
      options.headers = { 'Content-Type': 'application/json' };
    }

    const res = await authFetch(`${API_BASE_URL}/about-gallery/${id}`, options);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update gallery item');
    }
    return res.json();
  },

  deleteAboutGallery: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/about-gallery/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete gallery item');
    return res.json();
  },

  // ---- Offers ----
  getOffers: async () => {
    const res = await authFetch(`${API_BASE_URL}/offers`);
    if (!res.ok) throw new Error('Failed to fetch offers');
    return res.json();
  },

  createoffer: async (data) => {
    const res = await authFetch(`${API_BASE_URL}/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to apply offer');
    return res.json();
  },

  updateOffers: async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/offers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update offer');
    return res.json();
  },

  deleteOffers: async (id) => {
    const res = await authFetch(`${API_BASE_URL}/offers/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete offer');
    return res.json();
  },
};