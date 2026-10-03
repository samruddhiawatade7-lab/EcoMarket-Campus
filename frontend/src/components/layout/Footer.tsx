import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Heart, Recycle, Droplets, Wind } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Leaf className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Eco<span className="text-emerald-500">Market</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              EcoMarket is a dedicated sustainability marketplace designed to extend product lifespans, reduce landfill waste, and empower conscious consumers.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4" /> Verified Sustainable Standards
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products?category=Electronics" className="hover:text-emerald-400 transition-colors">Refurbished Electronics</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-emerald-400 transition-colors">Upcycled Fashion</Link></li>
              <li><Link to="/products?category=Furniture" className="hover:text-emerald-400 transition-colors">Restored Furniture</Link></li>
              <li><Link to="/products?category=Books" className="hover:text-emerald-400 transition-colors">Pre-Owned Books</Link></li>
              <li><Link to="/products?condition=REFURBISHED" className="hover:text-emerald-400 transition-colors">Certified Refurbished</Link></li>
            </ul>
          </div>

          {/* Sustainability Mission */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Our Impact Goals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2"><Wind className="w-4 h-4 text-emerald-400" /> 100,000+ kg CO₂ Avoided</li>
              <li className="flex items-center gap-2"><Droplets className="w-4 h-4 text-sky-400" /> 500,000+ Liters Water Saved</li>
              <li className="flex items-center gap-2"><Recycle className="w-4 h-4 text-amber-400" /> Zero Single-Use Plastics</li>
              <li className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-400" /> Fair Trade Seller Network</li>
            </ul>
          </div>

          {/* Account & Seller */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Become a Seller</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have refurbished, upcycled, or pre-owned products? Join our sustainable seller network today.
            </p>
            <Link
              to="/register"
              className="inline-block px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all"
            >
              Start Selling on EcoMarket
            </Link>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 EcoMarket Marketplace. Built for Sustainability & Protection of Planet Earth.</p>
          <div className="flex gap-4">
            <Link to="/impact" className="hover:text-slate-300">Sustainability Transparency</Link>
            <Link to="/products" className="hover:text-slate-300">Browse Products</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
