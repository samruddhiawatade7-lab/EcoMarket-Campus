import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, CheckCircle, GraduationCap, RefreshCw, Gift } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const isLiked = isInWishlist(product.id);
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60';

  const isFree = product.price === 0 || product.listingType === 'DONATE' || product.listingType === 'FREE_CORNER';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toggleWishlist(product.id);
  };

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isFree || product.listingType === 'EXCHANGE') {
      navigate(`/products/${product.id}`);
    } else {
      await addToCart(product.id, 1);
    }
  };

  const getListingTypeBadge = (type: string) => {
    switch (type) {
      case 'EXCHANGE':
        return <span className="bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-sm"><RefreshCw className="w-3 h-3" /> EXCHANGE</span>;
      case 'DONATE':
      case 'FREE_CORNER':
        return <span className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] flex items-center gap-1 shadow-sm"><Gift className="w-3 h-3" /> FREE / DONATION</span>;
      default:
        return <span className="bg-slate-900 text-white font-extrabold px-2 py-0.5 rounded text-[10px]">FOR SALE</span>;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Image & Badges Container */}
      <Link to={`/products/${product.id}`} className="relative aspect-square w-full bg-slate-100 overflow-hidden block">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {getListingTypeBadge(product.listingType || 'SELL')}
          <span className="bg-white/95 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px] border border-slate-200 shadow-sm backdrop-blur-sm">
            {product.condition?.replace('_', ' ')}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all duration-200 shadow-md ${
            isLiked
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
          }`}
          title={isLiked ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* College & Campus Badge */}
        {product.collegeCode && (
          <div className="absolute bottom-2.5 left-2.5 bg-emerald-950/80 text-emerald-100 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md">
            <GraduationCap className="w-3 h-3 text-emerald-400" />
            <span>{product.collegeCode}</span>
          </div>
        )}
      </Link>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold text-emerald-700 truncate">{product.category?.name}</span>
            {product.rating > 0 && (
              <span className="flex items-center gap-1 font-bold text-slate-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 flex-shrink-0">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                {product.rating}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Seller & Student Verification Badge */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 fill-emerald-50" />
            <span className="truncate">By <strong>{product.seller?.name}</strong></span>
            {product.seller?.collegeCode && (
              <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold border border-slate-200">
                {product.seller.collegeCode}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            {isFree ? (
              <div className="text-base font-black text-emerald-700 uppercase tracking-tight">
                FREE / DONATION
              </div>
            ) : (
              <div className="text-lg font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through font-normal ml-1.5">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleAction}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-sm ${
              isFree || product.listingType === 'EXCHANGE'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
            }`}
          >
            {isFree ? 'Request Item' : product.listingType === 'EXCHANGE' ? 'Request Exchange' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
