import React, { useState } from 'react';
import { api } from '../api';

export default function AboutGalleryAdmin({ theme = 'dark', galleryItems = [], setGalleryItems, showToast }) {
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null,
  });

  const isDark = theme === 'dark';

 const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    if (formData.imageFile) {
      data.append('image', formData.imageFile); // 👈 Changed 'imageFile' to 'image'
    }

    const res = await api.createAboutGallery(data); 
    if (res.success) {
      setGalleryItems(res.data);
      setFormData({ title: '', description: '', imageFile: null });
      document.getElementById('imageFileInput').value = '';
      showToast('success', 'Gallery item added successfully!');
    }
  } catch (err) {
    showToast('error', err.message || 'Failed to save gallery item');
  } finally {
    setSaving(false);
  }
};
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;

    try {
      const res = await api.deleteAboutGallery(id);
      if (res.success) {
        setGalleryItems((prev) => prev.filter((item) => item.id !== id));
        showToast('success', 'Gallery item deleted successfully.');
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to delete item');
    }
  };

  return (
    <div id='about' className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Manage About Us Gallery
        </h2>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          isDark ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' : 'bg-orange-100 text-orange-600 border border-orange-200'
        }`}>
          {galleryItems.length} {galleryItems.length === 1 ? 'image' : 'images'} live
        </span>
      </div>

      {/* Add Gallery Form */}
      <div className={`p-6 rounded-2xl border shadow-sm ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
      }`}>
        <h3 className="text-lg font-bold mb-4">Add New Store Snapshot</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Title
            </label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              placeholder="e.g. Advanced Repair Hub" 
              className={`w-full border rounded-xl p-2.5 outline-none transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
              }`} 
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Description
            </label>
            <textarea 
              rows="2" 
              required 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Short description of the photo..." 
              className={`w-full border rounded-xl p-2.5 outline-none transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900'
              }`}
            ></textarea>
          </div>

          <div>
            <label className={`block font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Upload Image from Laptop
            </label>
            <input 
              id="imageFileInput"
              type="file" 
              accept="image/*"
              required 
              onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })} 
              className={`w-full border rounded-xl p-2.5 outline-none transition-colors file:mr-4 file:py-1 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold ${
                isDark ? 'bg-slate-950 border-slate-800 text-white file:bg-indigo-600 file:text-white' : 'bg-orange-50/50 border-orange-200 text-slate-900 file:bg-orange-500 file:text-white'
              }`} 
            />
          </div>

          <button 
            type="submit" 
            disabled={saving} 
            className={`w-full font-medium py-2.5 rounded-xl transition text-white shadow ${
              isDark ? 'bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50' : 'bg-orange-500 hover:bg-orange-600 disabled:opacity-50'
            }`}
          >
            {saving ? 'Uploading to Supabase...' : 'Upload & Add Image'}
          </button>
        </form>
      </div>

      {/* Existing Gallery List */}
      <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-orange-200 text-slate-900'
      }`}>
        <h3 className="text-lg font-bold">Existing Gallery Items</h3>

        {galleryItems.length === 0 ? (
          <p className="text-sm text-slate-400">No gallery items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryItems.map((item) => {
              // images is stored as a Postgres text[] array of public URLs
              let imageUrl = item.image || item.src;
              if (!imageUrl && item.images) {
                if (Array.isArray(item.images)) {
                  imageUrl = item.images[0];
                } else if (typeof item.images === 'string') {
                  try {
                    const parsed = JSON.parse(item.images);
                    imageUrl = Array.isArray(parsed) ? parsed[0] : item.images;
                  } catch {
                    imageUrl = item.images;
                  }
                }
              }

              return (
                <div key={item.id} className={`flex items-center justify-between p-3 rounded-xl border transition-shadow hover:shadow-md ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-orange-50/30 border-orange-100'
                }`}>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={imageUrl} 
                      alt={item.title} 
                      className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1556742049-0a67d55362a5?auto=format&fit=crop&w=200&q=80'; }}
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition text-xs font-bold"
                    title="Delete item"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}