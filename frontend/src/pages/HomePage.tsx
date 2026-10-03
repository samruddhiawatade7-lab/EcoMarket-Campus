import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Sparkles, BookOpen, Gift, Tag, Users, GraduationCap,
  Building2, CheckCircle, Search, RefreshCw, ChevronRight, HeartHandshake, ShieldCheck
} from 'lucide-react';
import { Category, Product, College } from '../types';
import { productService } from '../services/productService';
import { collegeService } from '../services/collegeService';
import { ProductCard } from '../components/product/ProductCard';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [semesterBooks, setSemesterBooks] = useState<Product[]>([]);
  const [hostelEssentials, setHostelEssentials] = useState<Product[]>([]);
  const [affordableFinds, setAffordableFinds] = useState<Product[]>([]);
  const [recentlyListed, setRecentlyListed] = useState<Product[]>([]);
  const [freeCornerItems, setFreeCornerItems] = useState<Product[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, featuredRes, booksRes, hostelRes, affordableRes, allRes, freeRes, collegeList] = await Promise.all([
          productService.getCategories(),
          productService.getProducts({ size: 8, sortBy: 'newest' }),
          productService.getProducts({ category: 'Books & Study Materials', size: 4 }),
          productService.getProducts({ category: 'Hostel Essentials', size: 4 }),
          productService.getProducts({ maxPrice: 299, size: 4 }),
          productService.getProducts({ size: 4, sortBy: 'newest' }),
          productService.getProducts({ maxPrice: 0, size: 4 }),
          collegeService.getAllColleges()
        ]);
        setCategories(cats);
        setTrendingProducts(featuredRes.content || []);
        setSemesterBooks(booksRes.content || []);
        setHostelEssentials(hostelRes.content || []);
        setAffordableFinds(affordableRes.content || []);
        setRecentlyListed(allRes.content || []);
        setFreeCornerItems(freeRes.content || []);
        setColleges(collegeList);
      } catch (err) {
        console.error('Error loading campus homepage:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('query', searchQuery);
    if (selectedCollegeId) params.set('collegeId', selectedCollegeId);
    if (selectedCategory) params.set('category', selectedCategory);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-20">

      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            Verified College Student Marketplace
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Your Campus Marketplace, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-200">
              Made Sustainable.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto font-medium leading-relaxed">
            Buy smarter, sell what you don't need, and give useful things a second life within your college community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-xl shadow-emerald-950/40 hover:scale-105 transition-all text-base flex items-center justify-center gap-2"
            >
              Explore Marketplace <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/products/new"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-all text-base flex items-center justify-center gap-2"
            >
              List an Item <Sparkles className="w-5 h-5 text-amber-300" />
            </Link>
          </div>

          {/* 2. INTERACTIVE HERO SEARCH BAR */}
          <div className="pt-8 max-w-4xl mx-auto">
            <form onSubmit={handleHeroSearch} className="bg-white p-3 rounded-3xl shadow-2xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-slate-800 text-left">
              
              {/* Product Query */}
              <div className="px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Search Product</label>
                <input
                  type="text"
                  placeholder="Textbook, Casio, Lamp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* College Filter */}
              <div className="px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase">College / Campus</label>
                <select
                  value={selectedCollegeId}
                  onChange={(e) => setSelectedCollegeId(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="">All Colleges</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div className="px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Submit Search Button */}
              <button
                type="submit"
                className="w-full h-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition-colors"
              >
                <Search className="w-4 h-4" />
                Find Deals
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. CAMPUS CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Campus Essentials</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Browse Student Categories</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-200 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex items-end p-4"
            >
              {cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent"></div>
              <div className="relative z-10 text-white">
                <h3 className="font-extrabold text-sm sm:text-base group-hover:text-emerald-300 transition-colors">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TRENDING ON CAMPUS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
              🔥 Student Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Trending on Campus</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            Explore All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. BOOKS FOR YOUR SEMESTER */}
      <section className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-extrabold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" /> Academic Books & Notes
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Books for Your Semester</h2>
            <p className="text-xs text-slate-400 mt-1">Affordable second-hand textbooks, reference books, and lab manuals from seniors.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/semester-books" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all">
              Browse Semester Books
            </Link>
            <Link to="/products/new?category=Books%20%26%20Study%20Materials" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20">
              Sell Semester Books
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {semesterBooks.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. HOSTEL ESSENTIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Room & Dorm Gear</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Hostel Essentials</h2>
          </div>
          <Link to="/products?category=Hostel%20Essentials" className="text-xs font-bold text-emerald-600">
            View All Hostel Gear →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hostelEssentials.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. AFFORDABLE FINDS UNDER ₹299 */}
      <section className="bg-amber-500/10 border border-amber-200/80 p-8 rounded-3xl max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full uppercase mb-2">
              <Tag className="w-3.5 h-3.5" /> Pocket Friendly
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Affordable Finds Under ₹299</h2>
            <p className="text-xs text-slate-600 mt-1">Calculators, stationery, lab coats, and hostel accessories at student budget prices.</p>
          </div>
          <Link to="/products?maxPrice=299" className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all">
            See All Under ₹299 →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {affordableFinds.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. RECENTLY LISTED BY STUDENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Fresh Listings</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Recently Listed by Students</h2>
          </div>
          <Link to="/products" className="text-xs font-bold text-emerald-600">
            View All Listings →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyListed.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. FREE & DONATION CORNER */}
      <section className="bg-emerald-900 text-white p-8 sm:p-12 rounded-3xl max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-emerald-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-400 text-slate-950 font-black text-xs rounded-full uppercase mb-2">
              <Gift className="w-3.5 h-3.5" /> 100% Free
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Free & Donation Corner</h2>
            <p className="text-xs text-emerald-200 mt-1">Useful items donated by graduating seniors and fellow students for ₹0.</p>
          </div>
          <Link to="/free-corner" className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all">
            Visit Free Corner →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {freeCornerItems.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 10. SUSTAINABILITY IMPACT SECTION */}
      <section className="bg-slate-900 text-white py-14 px-6 rounded-3xl max-w-7xl mx-auto text-center space-y-6">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Campus Environmental Impact</span>
        <h2 className="text-3xl font-black max-w-2xl mx-auto">Every Item Reused Keeps Waste Out of Landfills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-3xl font-black text-emerald-400">180+ kg</div>
            <div className="text-xs text-slate-400 mt-1">CO₂ Saved</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-3xl font-black text-blue-400">12,500 L</div>
            <div className="text-xs text-slate-400 mt-1">Water Conserved</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-3xl font-black text-amber-400">450 kg</div>
            <div className="text-xs text-slate-400 mt-1">Waste Reduced</div>
          </div>
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <div className="text-3xl font-black text-teal-400">120+</div>
            <div className="text-xs text-slate-400 mt-1">Student Handovers</div>
          </div>
        </div>
      </section>

      {/* 11. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Simple & Trusted</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">How EcoMarket Campus Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black mx-auto">1</div>
            <h3 className="font-bold text-slate-900 text-base">Verify College Email</h3>
            <p className="text-xs text-slate-500">Sign up using your college email address to unlock verified student badge.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black mx-auto">2</div>
            <h3 className="font-bold text-slate-900 text-base">List or Browse</h3>
            <p className="text-xs text-slate-500">List books, calculators, or hostel gear for Sale, Exchange, or Donation.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black mx-auto">3</div>
            <h3 className="font-bold text-slate-900 text-base">Connect & Meet</h3>
            <p className="text-xs text-slate-500">Coordinate a safe handover location on campus (Library, Canteen, Hostel gate).</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black mx-auto">4</div>
            <h3 className="font-bold text-slate-900 text-base">Save Money & Earth</h3>
            <p className="text-xs text-slate-500">Enjoy affordable student living while keeping usable products out of landfills.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
