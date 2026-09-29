import React, { useState } from 'react';

export default function AboutUs({ galleryItems = [], theme = 'dark' }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const isDark = theme === 'dark';

  return (
    <div id="about" className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-900'
    }`}>
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header / Hero Section */}
        <div className="text-center space-y-4">
          <span className={`inline-block text-xs font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full ${
            isDark ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30' : 'bg-orange-100 text-orange-600 border border-orange-200'
          }`}>
            Our Story
          </span>
          <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r ${
            isDark ? 'from-white via-indigo-200 to-white' : 'from-slate-900 via-orange-600 to-slate-900'
          }`}>
            About Us
          </h1>
          <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Your ultimate destination for lightning-fast mobile repairs, latest smartphones, and premium accessories.
          </p>
          <div className={`mx-auto h-1 w-20 rounded-full bg-gradient-to-r ${isDark ? 'from-indigo-500 to-fuchsia-500' : 'from-orange-500 to-amber-400'}`} />
        </div>

        {/* Our Story / Mission */}
        {/* <div className={`shadow-sm rounded-2xl p-6 sm:p-10 border grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100'
        }`}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Who We Are</h2>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Founded with a passion for connectivity and technology, <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Mobile Express</span> has grown into a trusted local hub for all mobile communication needs. We combine top-tier customer service with expert technical knowledge to ensure you stay connected without interruption.
            </p>
            <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Whether you need a quick screen replacement, authentic accessories, or advice on upgrading your device, our friendly and skilled team is here to assist you every step of the way.
            </p>
          </div>
          <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-md bg-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1556742049-0a67d55362a5?auto=format&fit=crop&w=800&q=80" 
              alt="Mobile Express Store" 
              className="w-full h-full object-cover"
            />
          </div>
        </div> */}

        {/* Dynamic Gallery Section (Displaying Backend Images) */}
        <div className="space-y-6">
          {/* <div className="text-center">
            <h2 className="text-2xl font-bold">Store & Workspace Gallery</h2>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Take a virtual tour inside Mobile Express</p>
            <div className={`mx-auto mt-3 h-0.5 w-12 rounded-full ${isDark ? 'bg-indigo-500' : 'bg-orange-500'}`} />
          </div> */}

          {galleryItems.length === 0 ? (
            <div className={`text-center py-10 rounded-2xl border border-dashed ${isDark ? 'border-slate-800 text-slate-500' : 'border-gray-200 text-gray-400'}`}>
              No gallery images added yet. Add some from your admin panel!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {galleryItems.map((item, index) => {
                // Robust Image Source Resolution (handles arrays, stringified arrays, or direct URLs)
                let imgSource = item.image || item.src;

                if (!imgSource && item.images) {
                  if (Array.isArray(item.images)) {
                    imgSource = item.images[0];
                  } else if (typeof item.images === 'string') {
                    if (item.images.startsWith('[')) {
                      try {
                        const parsed = JSON.parse(item.images);
                        imgSource = Array.isArray(parsed) ? parsed[0] : parsed;
                      } catch (e) {
                        imgSource = item.images;
                      }
                    } else {
                      imgSource = item.images;
                    }
                  }
                }

                const imageUrl = imgSource;

                return (
                  <div 
                    key={item.id || index} 
                    className={`rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border flex flex-col cursor-pointer group ${
                      isDark ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' : 'bg-white border-gray-100 hover:border-orange-300'
                    }`}
                    onClick={() => setSelectedImage({ ...item, imageUrl })}
                  >
                    <div className="relative h-48 overflow-hidden bg-slate-800">
                      <img 
                        src={imageUrl} 
                        alt={item.title || 'Store Snapshot'} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1556742049-0a67d55362a5?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 bg-black bg-opacity-60 px-3 py-1 rounded-full text-xs font-medium transition-opacity">
                          Click to expand
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{item.title || 'Store Snapshot'}</h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.description || ''}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className={`relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`} onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-colors"
              >
                ✕
              </button>
              <img src={selectedImage.imageUrl} alt={selectedImage.title} className="w-full max-h-[70vh] object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p className={`mt-1 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{selectedImage.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Business & Legal Credentials */}
        {/* <div className={`shadow-xl rounded-2xl p-6 sm:p-10 relative overflow-hidden border ${
          isDark ? 'bg-indigo-950/40 border-indigo-900/50 text-white' : 'bg-indigo-900 border-indigo-900 text-white'
        }`}>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-800 rounded-full opacity-30 pointer-events-none"></div>
          
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Business & Legal Information</h2>
              <p className="text-indigo-200 text-sm mt-1">Transparent compliance and official store credentials</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Legal Entity</span>
                <p className="text-lg font-bold mt-1">Mobile Express</p>
              </div>

              <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Store Proprietor / Owner</span>
                <p className="text-lg font-bold mt-1">[Insert Owner Name]</p>
              </div>

              <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">GSTIN</span>
                <p className="text-lg font-bold mt-1 font-mono tracking-wide">[Insert 15-Digit GSTIN]</p>
              </div>

              <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Established Year</span>
                <p className="text-lg font-bold mt-1">[Insert Year]</p>
              </div>

              <div className="bg-indigo-900/60 p-4 rounded-xl border border-indigo-700/50 sm:col-span-2">
                <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Core Services</span>
                <p className="text-sm font-medium mt-1">Retail Smartphones, Certified Repairs, Mobile Accessories & Gadgets</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Contact & Location Details */}
     
      </div>
    </div>
  );
}