import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { SustainabilityScoreBadge } from '../components/common/SustainabilityScoreBadge';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-3 text-xs font-bold text-slate-500">Loading Wishlist...</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto text-3xl">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Save your favorite refurbished laptops, upcycled fashion, and eco items to buy later.
        </p>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
          Browse Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Saved Wishlist ({wishlist.length})</h1>
        <p className="text-xs text-slate-500 font-medium">Your saved sustainable items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col justify-between p-4 space-y-3">
            <Link to={`/products/${product.id}`} className="block aspect-square w-full rounded-xl overflow-hidden bg-slate-100 relative">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                {product.condition.replace('_', ' ')}
              </span>
            </Link>

            <div className="space-y-1">
              <Link to={`/products/${product.id}`} className="font-bold text-slate-900 text-sm hover:text-emerald-600 line-clamp-1">
                {product.name}
              </Link>
              <div className="text-base font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</div>
              <SustainabilityScoreBadge score={product.sustainabilityScore} size="sm" />
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => addToCart(product.id, 1)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
