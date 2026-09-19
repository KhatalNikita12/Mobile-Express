import React from 'react';
import { User, Phone, MapPin } from 'lucide-react';

export default function ContactSection({ shopInfo }) {
  return (
    <section id="contact" className="max-w-7xl mx-auto px-4">
      <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-10 shadow-xl">
        <div className="space-y-6">
          <div>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-widest">Get In Touch</span>
            <h2 className="text-3xl font-extrabold mt-1">Visit Our Store</h2>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">
            Have questions about products or need urgent device repairs? Drop by our store or call our primary desk anytime.
          </p>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div><p className="font-semibold">Owner</p><p className="text-slate-300">{shopInfo.owner}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div><p className="font-semibold">Mobile Number</p><p className="text-slate-300">{shopInfo.phone}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-indigo-400 mt-0.5" />
              <div><p className="font-semibold">Address</p><p className="text-slate-300">{shopInfo.address}</p></div>
            </div>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden bg-slate-800 min-h-[300px] border border-slate-700 flex items-center justify-center">
          <div className="text-center p-6 space-y-2">
            <MapPin className="h-10 w-10 text-indigo-400 mx-auto" />
            <p className="font-semibold text-slate-200">Interactive Map Location</p>
            <p className="text-xs text-slate-400">({shopInfo.address})</p>
          </div>
        </div>
      </div>
    </section>
  );
}