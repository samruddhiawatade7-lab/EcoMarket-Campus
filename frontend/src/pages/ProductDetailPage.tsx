import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart, ShoppingBag, Star, ShieldCheck, MapPin, Tag, ArrowLeft,
  CheckCircle2, MessageSquare, Send, RefreshCw, Gift, GraduationCap, Building2, BookOpen
} from 'lucide-react';
import { Product, Review, ListingType } from '../types';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { marketplaceRequestService } from '../services/marketplaceRequestService';
import { EnvironmentalImpactCard } from '../components/common/EnvironmentalImpactCard';
import { ProductCard } from '../components/product/ProductCard';
import { AprioriRecommendations } from '../components/AprioriRecommendations';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const productId = parseInt(id || '0');

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Request Handover Modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [pickupSpot, setPickupSpot] = useState('Campus Library Fountain / Main Gate');
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string>('');

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();

  const isLiked = isInWishlist(productId);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const [prodData, revList, simList] = await Promise.all([
          productService.getProductById(productId),
          reviewService.getProductReviews(productId),
          productService.getSimilarProducts(productId)
        ]);
        setProduct(prodData);
        setReviews(revList);
        setSimilarProducts(simList);
        setSelectedImage(prodData.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60');
      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await addToCart(productId, quantity);
  };

  const handleSendHandoverRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setRequestSubmitting(true);
    try {
      await marketplaceRequestService.createRequest({
        productId,
        requestType: product?.listingType || 'SELL',
        message: requestMessage,
        pickupLocation: pickupSpot
      });
      setRequestSuccess(true);
      setTimeout(() => setShowRequestModal(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    if (!reviewComment.trim()) {
      setReviewError('Please write a review comment');
      return;
    }
    try {
      setReviewSubmitting(true);
      const newRev = await reviewService.createReview(productId, reviewRating, reviewComment.trim());
      setReviews(prev => [newRev, ...prev]);
      setReviewComment('');
    } catch (err: any) {
      setReviewError(err.response?.data?.message || 'Review failed.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-xs font-bold text-slate-500">Loading Product Details...</p>
      </div>
    );
  }

  const isFree = product.price === 0 || product.listingType === 'DONATE' || product.listingType === 'FREE_CORNER';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </button>

      {/* Main Product Card Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
              <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-black rounded-full shadow-md">
                {product.listingType}
              </span>
              <span className="px-3 py-1 bg-slate-900 text-white text-xs font-bold rounded-full shadow-md">
                {product.condition.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImage === img ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2">
              <span>{product.category?.name}</span>
              {product.collegeCode && <span>• {product.collegeCode} Campus</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>

            {/* Academic Info Badge */}
            {(product.course || product.semester) && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-xl border border-blue-200 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>{product.course || 'General'} {product.semester && `• ${product.semester}`}</span>
              </div>
            )}

            {/* Seller & Student Verification */}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs">
              <div className="flex items-center gap-1.5 font-bold bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                <span>Seller: <strong>{product.seller?.name}</strong></span>
                {product.seller?.collegeName && (
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-extrabold ml-1">
                    {product.seller.collegeCode || 'Verified'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Exchange Preference Details */}
          {product.listingType === 'EXCHANGE' && product.exchangePreference && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1">
              <div className="flex items-center gap-1.5 text-blue-900 font-extrabold text-xs">
                <RefreshCw className="w-4 h-4 text-blue-600" /> Seller's Exchange Preference
              </div>
              <p className="text-xs text-blue-800 italic">"{product.exchangePreference}"</p>
            </div>
          )}

          {/* Environmental Impact Breakdown Card */}
          <EnvironmentalImpactCard
            co2Saved={product.co2Saved}
            waterSaved={product.waterSaved}
            wasteReduced={product.wasteReduced}
          />

          {/* Price & Action */}
          <div className="flex items-baseline gap-3 pt-2">
            {isFree ? (
              <span className="text-3xl font-black text-emerald-700">FREE / DONATION</span>
            ) : (
              <span className="text-3xl font-black text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowRequestModal(true)}
                className="flex-1 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all"
              >
                <MessageSquare className="w-4 h-4" /> Request Campus Handover
              </button>

              {!isFree && product.listingType !== 'EXCHANGE' && (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              )}

              <button
                onClick={() => isAuthenticated ? toggleWishlist(productId) : navigate('/login')}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-center ${
                  isLiked ? 'bg-rose-50 border-rose-300 text-rose-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
            <h3 className="font-bold text-slate-900 text-sm">Listing Description</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

        </div>
      </div>

      {/* REQUEST HANDOVER MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-xl font-black text-slate-900">Request Campus Handover</h3>
            <p className="text-xs text-slate-500">
              Send a direct handover request to <strong>{product.seller?.name}</strong>. Coordinate meeting spot on campus.
            </p>

            {requestSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center text-xs font-bold">
                ✓ Handover request sent successfully! Check Student Dashboard for updates.
              </div>
            ) : (
              <form onSubmit={handleSendHandoverRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campus Pickup Location</label>
                  <input
                    type="text"
                    value={pickupSpot}
                    onChange={(e) => setPickupSpot(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message to Seller</label>
                  <textarea
                    rows={3}
                    placeholder="Hi, I am interested in this item. When are you available near the library/hostel?"
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="flex-1 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Frequently Bought Together - Apriori Recommendation Engine intact! */}
      <AprioriRecommendations
        productIds={[productId]}
        title="Frequently Bought Together with this Item"
        subtitle="Powered by Apriori Market Basket Co-Purchase Mining"
        limit={4}
      />

    </div>
  );
};

export default ProductDetailPage;
