import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, SlidersHorizontal, GraduationCap, Gift, RefreshCw, Tag } from 'lucide-react';
import { Category, Product, ProductCondition, ListingType, College } from '../types';
import { productService, ProductFilterParams } from '../services/productService';
import { collegeService } from '../services/collegeService';
import { ProductCard } from '../components/product/ProductCard';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter States from URL or Defaults
  const queryParam = searchParams.get('query') || '';
  const categoryParam = searchParams.get('category') || '';
  const conditionParam = searchParams.get('condition') as ProductCondition | '';
  const listingTypeParam = searchParams.get('listingType') as ListingType | '';
  const collegeIdParam = searchParams.get('collegeId') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortByParam = searchParams.get('sortBy') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '0');

  useEffect(() => {
    Promise.all([productService.getCategories(), collegeService.getAllColleges()])
      .then(([catList, collegeList]) => {
        setCategories(catList);
        setColleges(collegeList);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const params: ProductFilterParams = {
          query: queryParam || undefined,
          category: categoryParam || undefined,
          condition: conditionParam || undefined,
          listingType: listingTypeParam || undefined,
          collegeId: collegeIdParam ? parseInt(collegeIdParam) : undefined,
          minPrice: minPriceParam ? parseFloat(minPriceParam) : undefined,
          maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : undefined,
          sortBy: sortByParam,
          page: pageParam,
          size: 12
        };

        const res = await productService.getProducts(params);
        setProducts(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } catch (err) {
        console.error('Failed to fetch campus products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  const updateFilters = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== null && val !== '') {
        next.set(key, val);
      } else {
        next.delete(key);
      }
    });
    if (!('page' in updates)) {
      next.set('page', '0');
    }
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search & Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Campus Marketplace</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Showing {totalElements} student items available for Buy, Exchange, or Donation
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search textbooks, calculators, hostel gear..."
            value={queryParam}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Listing Type Quick Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => updateFilters({ listingType: '' })}
          className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
            !listingTypeParam ? 'bg-slate-900 text-white border-slate-900 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Listings
        </button>

        <button
          onClick={() => updateFilters({ listingType: 'SELL' })}
          className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${
            listingTypeParam === 'SELL' ? 'bg-emerald-600 text-white border-emerald-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          For Sale
        </button>

        <button
          onClick={() => updateFilters({ listingType: 'EXCHANGE' })}
          className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap flex items-center gap-1.5 ${
            listingTypeParam === 'EXCHANGE' ? 'bg-blue-600 text-white border-blue-600 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" /> Exchange Only
        </button>

        <button
          onClick={() => updateFilters({ listingType: 'DONATE' })}
          className={`px-4 py-2 rounded-xl border transition-all whitespace-nowrap flex items-center gap-1.5 ${
            listingTypeParam === 'DONATE' ? 'bg-emerald-700 text-white border-emerald-700 shadow' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Gift className="w-3.5 h-3.5" /> Free & Donation
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-6 h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-600" /> Filters
            </span>
            <button
              onClick={handleReset}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* College Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> College Campus
            </label>
            <select
              value={collegeIdParam}
              onChange={(e) => updateFilters({ collegeId: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="">All Campuses</option>
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
            <select
              value={categoryParam}
              onChange={(e) => updateFilters({ category: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Student Budget Presets */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-600" /> Budget Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[99, 199, 299, 499].map((amt) => (
                <button
                  key={amt}
                  onClick={() => updateFilters({ maxPrice: maxPriceParam === String(amt) ? '' : String(amt) })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                    maxPriceParam === String(amt)
                      ? 'bg-amber-500 text-slate-950 border-amber-500'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Under ₹{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Condition</label>
            <div className="space-y-1.5">
              {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'REFURBISHED', 'UPCYCLED'].map((cond) => (
                <label key={cond} className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="condition"
                    checked={conditionParam === cond}
                    onChange={() => updateFilters({ condition: conditionParam === cond ? '' : cond })}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{cond.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid & Sort */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm text-xs font-semibold">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-lg"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-slate-500">Sort by:</span>
              <select
                value={sortByParam}
                onChange={(e) => updateFilters({ sortBy: e.target.value })}
                className="bg-slate-100 border-none font-bold text-slate-800 rounded-lg py-1 px-2 focus:ring-0"
              >
                <option value="newest">Newest Listings</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                🎓
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Campus Items Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No products matched your campus or category filter. Try clearing filters or searching for another college.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={pageParam === 0}
                onClick={() => updateFilters({ page: String(pageParam - 1) })}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => updateFilters({ page: String(idx) })}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    pageParam === idx
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={pageParam >= totalPages - 1}
                onClick={() => updateFilters({ page: String(pageParam + 1) })}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;
