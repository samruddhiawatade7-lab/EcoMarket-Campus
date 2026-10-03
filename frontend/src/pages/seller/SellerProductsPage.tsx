import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, CheckCircle2, Clock, XCircle, Leaf } from 'lucide-react';
import { Product } from '../../types';
import { sellerService } from '../../services/sellerService';
import { productService } from '../../services/productService';
import { SustainabilityScoreBadge } from '../../components/common/SustainabilityScoreBadge';

export const SellerProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await sellerService.getSellerProducts();
      setProducts(res.content);
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product listing?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> Pending Approval</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center gap-1 w-fit"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-bold w-fit">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-xs font-bold text-slate-500">Loading Products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">My Product Listings</h2>
          <p className="text-xs text-slate-500">Manage stock, prices, and status</p>
        </div>
        <Link
          to="/seller/products/new"
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <Leaf className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Products Listed Yet</h3>
          <p className="text-xs text-slate-500">Start listing your refurbished or upcycled products for sale.</p>
          <Link to="/seller/products/new" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
            List First Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase tracking-wider font-bold text-[10px] text-slate-500 border-b">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Condition</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Eco Score</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="p-3 flex items-center gap-3">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                    <div>
                      <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                      <span className="text-[10px] text-slate-400">{p.category.name}</span>
                    </div>
                  </td>
                  <td className="p-3 font-semibold">{p.condition.replace('_', ' ')}</td>
                  <td className="p-3 font-black text-slate-900">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="p-3 font-bold">{p.quantity} units</td>
                  <td className="p-3"><SustainabilityScoreBadge score={p.sustainabilityScore} size="sm" /></td>
                  <td className="p-3">{getStatusBadge(p.status)}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/seller/products/${p.id}/edit`} className="p-1.5 text-slate-600 hover:text-emerald-600 rounded-lg hover:bg-slate-100">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
