import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Gift, HeartHandshake, PlusCircle } from 'lucide-react';
import { Product } from '../types';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';

export const FreeCornerPage: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts({ maxPrice: 0, size: 20 })
      .then(res => setItems(res.content || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-full uppercase mb-2">
            <Gift className="w-3.5 h-3.5" /> 100% Free Items
          </div>
          <h1 className="text-3xl font-black">Free & Donation Corner</h1>
          <p className="text-xs text-emerald-200 mt-1 max-w-xl">
            Products, notes, drawing boards, and hostel gear given away by graduating seniors and students for ₹0.
          </p>
        </div>

        <Link
          to="/products/new?listingType=DONATE"
          className="px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 w-fit shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Donate Useful Item
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
          <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No Free Items Currently Listed</h3>
          <p className="text-xs text-slate-500 mt-1">Be generous and donate usable items to your campus community!</p>
          <Link to="/products/new?listingType=DONATE" className="inline-block mt-4 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
            Donate an Item Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FreeCornerPage;
