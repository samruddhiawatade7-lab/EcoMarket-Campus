import React, { useEffect, useState } from 'react';
import { Sparkles, ShoppingCart, Leaf } from 'lucide-react';
import { Product } from '../types';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';

interface AprioriRecommendationsProps {
  productIds: number[];
  title?: string;
  subtitle?: string;
  limit?: number;
}

export const AprioriRecommendations: React.FC<AprioriRecommendationsProps> = ({
  productIds,
  title = "Frequently Bought Together",
  subtitle = "Apriori Market Basket Analysis Engine",
  limit = 4
}) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const fetchApriori = async () => {
      try {
        setLoading(true);
        let items: Product[] = [];
        if (productIds.length === 1) {
          items = await productService.getFrequentlyBoughtTogether(productIds[0], limit);
        } else {
          items = await productService.getAprioriRecommendations(productIds, limit);
        }
        if (isMounted) {
          setRecommendations(items);
        }
      } catch (err) {
        console.error('Failed to fetch Apriori recommendations', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApriori();
    return () => { isMounted = false; };
  }, [productIds.join(','), limit]);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      setAddedMap((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedMap((prev) => ({ ...prev, [product.id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Add to cart failed', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100 animate-pulse space-y-4">
        <div className="h-6 bg-emerald-200/60 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-emerald-100/50 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/30 to-white p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-md shadow-emerald-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">{title}</h3>
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> {subtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
          Apriori Co-Purchase Mining
        </span>
      </div>

      {/* Grid of Apriori Recommendations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">{product.category?.name || 'Featured'}</span>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-black text-sm text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-slate-400 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAddToCart(product)}
              className={`mt-4 w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                addedMap[product.id]
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{addedMap[product.id] ? 'Added to Cart ✓' : 'Add to Order'}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
