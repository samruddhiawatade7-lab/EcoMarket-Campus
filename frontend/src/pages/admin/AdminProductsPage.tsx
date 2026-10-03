import React, { useEffect, useState } from 'react';
import { Trash2, Edit, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Product } from '../../types';
import { productService } from '../../services/productService';
import { SustainabilityScoreBadge } from '../../components/common/SustainabilityScoreBadge';
import { Link } from 'react-router-dom';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    try {
      const res = await productService.getProducts({ size: 50 });
      setProducts(res.content);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-2 text-xs font-bold text-slate-500">Loading All Marketplace Products...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-black text-slate-900">All Marketplace Products ({products.length})</h2>
        <p className="text-xs text-slate-500">Manage all listed products across sellers</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 uppercase tracking-wider font-bold text-[10px] text-slate-500 border-b">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">Seller</th>
              <th className="p-3">Condition</th>
              <th className="p-3">Price</th>
              <th className="p-3">Eco Score</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/80">
                <td className="p-3 flex items-center gap-3">
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'} alt="" className="w-9 h-9 rounded-lg object-cover bg-slate-100" />
                  <div>
                    <span className="font-bold text-slate-900 block line-clamp-1">{p.name}</span>
                    <span className="text-[10px] text-slate-400">{p.category.name}</span>
                  </div>
                </td>
                <td className="p-3 font-semibold">{p.seller.name}</td>
                <td className="p-3 font-semibold">{p.condition.replace('_', ' ')}</td>
                <td className="p-3 font-black text-slate-900">₹{p.price.toLocaleString('en-IN')}</td>
                <td className="p-3"><SustainabilityScoreBadge score={p.sustainabilityScore} size="sm" /></td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">{p.status}</span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/products/${p.id}`} className="p-1.5 text-slate-600 hover:text-purple-600 rounded-lg hover:bg-slate-100">
                      View
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
    </div>
  );
};
