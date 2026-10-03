import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Leaf, Wind, Droplets, Recycle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { SustainabilityScoreBadge } from '../components/common/SustainabilityScoreBadge';
import { AprioriRecommendations } from '../components/AprioriRecommendations';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeItem, clearCart, loading } = useCart();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-3 text-xs font-bold text-slate-500">Updating Cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl shadow-inner">
          🛒
        </div>
        <h2 className="text-3xl font-black text-slate-900">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Explore eco-verified refurbished electronics, upcycled fashion, and pre-owned items to build a sustainable cart!
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-200 transition-all"
        >
          Explore Sustainable Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Shopping Cart</h1>
          <p className="text-xs text-slate-500 font-medium">Review your items & sustainability impact</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-bold underline"
        >
          Clear Entire Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Image */}
              <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200">
                <img
                  src={item.productImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Seller */}
              <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                <Link to={`/products/${item.productId}`} className="font-bold text-slate-900 text-base hover:text-emerald-600 transition-colors line-clamp-1">
                  {item.productName}
                </Link>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {item.condition.replace('_', ' ')}
                  </span>
                  <span>Sold by {item.sellerName}</span>
                </div>
                <div className="pt-1">
                  <SustainabilityScoreBadge score={item.sustainabilityScore} condition={item.condition} size="sm" />
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  className="px-3 py-1 text-slate-600 font-bold hover:bg-slate-200"
                >
                  -
                </button>
                <span className="px-3 text-xs font-black text-slate-900">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, Math.min(item.availableStock, item.quantity + 1))}
                  className="px-3 py-1 text-slate-600 font-bold hover:bg-slate-200"
                >
                  +
                </button>
              </div>

              {/* Item Price & Delete */}
              <div className="text-right flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <div className="text-base font-black text-slate-900">
                  ₹{item.subtotal.toLocaleString('en-IN')}
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Cart Impact Sidebar */}
        <div className="space-y-6">
          
          {/* Cart Environmental Impact Box */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-emerald-400 fill-current" />
              <h3 className="font-extrabold text-base">Cart Impact Summary</h3>
            </div>
            <p className="text-xs text-emerald-100/80">
              By purchasing these reused/refurbished items instead of brand-new ones, your cart achieves:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-slate-900">
              <div className="bg-white/95 p-2.5 rounded-xl border border-white/20">
                <Wind className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
                <span className="text-xs font-black block">{cart.co2Saved} kg</span>
                <span className="text-[9px] text-slate-500 block">CO₂ Avoided</span>
              </div>

              <div className="bg-white/95 p-2.5 rounded-xl border border-white/20">
                <Droplets className="w-4 h-4 text-sky-600 mx-auto mb-0.5" />
                <span className="text-xs font-black block">{cart.waterSaved} L</span>
                <span className="text-[9px] text-slate-500 block">Water Saved</span>
              </div>

              <div className="bg-white/95 p-2.5 rounded-xl border border-white/20">
                <Recycle className="w-4 h-4 text-amber-600 mx-auto mb-0.5" />
                <span className="text-xs font-black block">{cart.wasteReduced} kg</span>
                <span className="text-[9px] text-slate-500 block">Waste Saved</span>
              </div>
            </div>
          </div>

          {/* Payment Invoice Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Order Summary</h3>

            <div className="space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length} items)</span>
                <span className="font-bold text-slate-900">₹{cart.subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold text-emerald-600">
                  {cart.deliveryFee > 0 ? `₹${cart.deliveryFee}` : 'FREE (Orders over ₹1,000)'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-sm font-black text-slate-900">Total</span>
              <span className="text-2xl font-black text-emerald-700">
                ₹{cart.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 text-sm transition-all"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Apriori Recommendation Engine Component */}
      <AprioriRecommendations
        productIds={cart.items.map(item => item.productId)}
        title="Customers Who Bought These Items Also Bought"
        subtitle="Powered by Apriori Market Basket Co-Purchase Mining"
        limit={4}
      />
    </div>
  );
};
