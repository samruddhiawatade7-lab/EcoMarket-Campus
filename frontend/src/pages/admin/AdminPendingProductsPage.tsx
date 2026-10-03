import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Clock, ShieldCheck, Eye } from 'lucide-react';
import { Product } from '../../types';
import { adminService } from '../../services/adminService';
import { SustainabilityScoreBadge } from '../../components/common/SustainabilityScoreBadge';
import { Link } from 'react-router-dom';

export const AdminPendingProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await adminService.getPendingProducts();
      setProducts(res.content);
    } catch (err) {
      console.error('Failed to load pending products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await adminService.approveProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to approve product.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await adminService.rejectProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to reject product.');
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-xs font-bold text-slate-500">Loading Product Moderation Queue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" /> Pending Product Moderation Queue ({products.length})
        </h2>
        <p className="text-xs text-slate-500">Review seller product submissions before public publication</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed text-xs text-slate-500 space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <p className="font-bold text-slate-800 text-sm">Moderation Queue is Clear!</p>
          <p>No pending product submissions requiring approval right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4">
                <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{p.name}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">{p.condition.replace('_', ' ')}</span>
                  </div>
                  <p className="text-slate-500">Category: {p.category.name} • Price: <strong>₹{p.price.toLocaleString('en-IN')}</strong></p>
                  <p className="text-slate-500">Seller: <strong>{p.seller.name}</strong> ({p.seller.email})</p>
                  <div className="pt-1">
                    <SustainabilityScoreBadge score={p.sustainabilityScore} size="sm" />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link to={`/products/${p.id}`} className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200" title="View Preview">
                  <Eye className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleApprove(p.id)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>

                <button
                  onClick={() => handleReject(p.id)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
