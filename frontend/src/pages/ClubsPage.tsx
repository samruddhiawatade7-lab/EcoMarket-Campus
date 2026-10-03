import React, { useEffect, useState } from 'react';
import { Users, CheckCircle, PlusCircle, Building2 } from 'lucide-react';
import { Club, Product } from '../types';
import clubService from '../services/clubService';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';

export const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [clubProducts, setClubProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cList, pList] = await Promise.all([
          clubService.getAllClubs(),
          productService.getProducts({ isClubListing: true, size: 12 })
        ]);
        setClubs(cList);
        setClubProducts(pList.content || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/20 text-purple-300 font-bold text-xs rounded-full uppercase mb-2 border border-purple-400/30">
            <Users className="w-3.5 h-3.5" /> Student Organizations
          </div>
          <h1 className="text-3xl font-black">Campus Clubs & Community Listings</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Reusable event banners, stage lights, fest decorations, and equipment shared by campus clubs.
          </p>
        </div>
      </div>

      {/* Clubs Showcase Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900">Verified College Clubs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubs.map((club) => (
            <div key={club.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
              <img
                src={club.logoUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60'}
                alt={club.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-base">{club.name}</h3>
                  <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                </div>
                <p className="text-xs text-slate-500">{club.description}</p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                  <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {club.category}
                  </span>
                  {club.collegeName && (
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Building2 className="w-3 h-3 text-emerald-600" /> {club.collegeName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Club Reusable Equipment */}
      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900">Reusable Club Event Equipment</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clubProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClubsPage;
