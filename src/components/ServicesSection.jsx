import React from 'react';
import { Wrench, MessageCircle } from 'lucide-react';

export default function ServicesSection({ loading, services, shopInfo }) {
  return (
    <section id="services" className="bg-slate-100  px-4">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          {/* <span className="text-indigo-600 font-semibold text-xs uppercase tracking-wider">Expert Care</span> */}
          <h2 className="text-3xl font-bold text-slate-900">Our Repair Services</h2>
          <p className="text-slate-500 text-sm">Professional care and hardware diagnostics for your daily gear</p>
        </div>

        {loading ? (
          <ServicesSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map(service => (
              <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                  <Wrench className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold uppercase text-indigo-500 tracking-wider">{service.category} Service</span>
                <h3 className="text-xl font-bold text-slate-900">{service.name}</h3>
                <p className="text-slate-600 text-sm">{service.description}</p>
                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <span className="font-bold text-indigo-600">{service.price}</span>
                  <a
                    href={`https://wa.me/${shopInfo.whatsappNumber}?text=Hi,%20I%20want%20to%20enquire%20about%20repair%20service:%20${service.name}`}
                    target="_blank" rel="noreferrer"
                    className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition shadow"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> Book Service
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function ServicesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[0, 1, 2].map(i => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 animate-pulse">
          <div className="w-12 h-12 bg-slate-100 rounded-xl" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="h-5 bg-slate-100 rounded w-2/3" />
          <div className="h-10 bg-slate-100 rounded w-full" />
        </div>
      ))}
    </div>
  );
}