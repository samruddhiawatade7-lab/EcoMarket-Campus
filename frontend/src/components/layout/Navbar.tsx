import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap, Search, ShoppingBag, Heart, User as UserIcon, LogOut,
  LayoutDashboard, ShieldCheck, Menu, X, Sparkles, Building2, CheckCircle,
  BookOpen, Gift, Tag, Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import collegeService from '../../services/collegeService';
import { College } from '../../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, isSeller, logout, login } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollegeId, setSelectedCollegeId] = useState<string>(
    localStorage.getItem('ecomarket_campus_college') || ''
  );

  useEffect(() => {
    collegeService.getAllColleges()
      .then(setColleges)
      .catch(() => {});
  }, []);

  const handleCollegeChange = (id: string) => {
    setSelectedCollegeId(id);
    if (id) {
      localStorage.setItem('ecomarket_campus_college', id);
    } else {
      localStorage.removeItem('ecomarket_campus_college');
    }
    navigate(`/products${id ? `?collegeId=${id}` : ''}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('query', searchQuery.trim());
      if (selectedCollegeId) params.set('collegeId', selectedCollegeId);
      navigate(`/products?${params.toString()}`);
      setMobileMenuOpen(false);
    }
  };

  const handleQuickLogin = async (role: 'STUDENT' | 'SELLER' | 'ADMIN') => {
    let email = 'aarav@coep.ac.in';
    let pass = 'Student@123';
    if (role === 'SELLER') {
      email = 'ananya@iitb.ac.in';
      pass = 'Student@123';
    } else if (role === 'ADMIN') {
      email = 'admin@ecomarket.com';
      pass = 'Admin@123';
    }
    await login(email, pass);
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-sm">
      {/* Top Banner for Campus Community */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span><strong className="text-white">EcoMarket Campus:</strong> Reuse More. Spend Less. Live Sustainably.</span>
        </div>
        
        {/* Campus / College Switcher */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <Building2 className="w-3.5 h-3.5 text-emerald-300" />
          <span className="text-[11px] text-emerald-200">Selected Campus:</span>
          <select
            value={selectedCollegeId}
            onChange={(e) => handleCollegeChange(e.target.value)}
            className="bg-emerald-800 text-white text-[11px] font-bold py-0.5 px-2 rounded-lg border border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
          >
            <option value="">🏫 All Campuses</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:bg-emerald-700 transition-all">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  EcoMarket<span className="text-emerald-600"> Campus</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-200">
                  STUDENT MARKETPLACE
                </span>
              </div>
              <span className="block text-[10px] font-semibold text-emerald-700 tracking-wider -mt-0.5">
                Reuse More. Spend Less. Live Sustainably.
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search textbooks, calculators, hostel gear, lab coats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-24 py-2.5 bg-slate-100/90 border border-slate-200 rounded-full text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          {/* Navigation Shortcuts */}
          <div className="hidden md:flex items-center gap-4 text-xs font-bold text-slate-700">
            <Link to="/products" className={`hover:text-emerald-600 ${location.pathname === '/products' ? 'text-emerald-600' : ''}`}>
              Marketplace
            </Link>

            <Link to="/semester-books" className={`flex items-center gap-1 hover:text-emerald-600 ${location.pathname === '/semester-books' ? 'text-emerald-600 font-bold' : ''}`}>
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Semester Books
            </Link>

            <Link to="/free-corner" className={`flex items-center gap-1 hover:text-emerald-600 ${location.pathname === '/free-corner' ? 'text-emerald-600 font-bold' : ''}`}>
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              Free Corner
            </Link>

            <Link to="/products?maxPrice=299" className="flex items-center gap-1 text-amber-700 hover:text-amber-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              Under ₹299
            </Link>

            <Link to="/clubs" className={`flex items-center gap-1 hover:text-emerald-600 ${location.pathname === '/clubs' ? 'text-emerald-600 font-bold' : ''}`}>
              <Users className="w-3.5 h-3.5 text-purple-600" />
              Clubs
            </Link>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/wishlist"
              className="p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full relative transition-all"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-full relative transition-all"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-emerald-600 text-white text-[11px] font-extrabold rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* List an Item Button */}
            <Link
              to="/products/new"
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>List an Item</span>
            </Link>

            {/* User Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-slate-200 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">{user?.name}</span>
                      {user?.verifiedStudent && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      )}
                    </div>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      {user?.collegeName && (
                        <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> {user.collegeName}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/student-dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100/60"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                      Student Dashboard
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      Profile & Verification
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <ShoppingBag className="w-4 h-4 text-slate-400" />
                      Purchases & Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-purple-700 bg-purple-50/50 hover:bg-purple-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors"
                >
                  Log In
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-sm transition-all"
                >
                  Register
                </Link>

                {/* Quick Student Login Switcher */}
                <div className="hidden lg:flex items-center gap-1 border-l pl-2 border-slate-200">
                  <button
                    onClick={() => handleQuickLogin('STUDENT')}
                    className="text-[10px] bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2 py-1 rounded font-bold"
                    title="Login as Verified Student (COEP)"
                  >
                    ⚡ Student
                  </button>
                  <button
                    onClick={() => handleQuickLogin('SELLER')}
                    className="text-[10px] bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded font-bold"
                    title="Login as Student Seller (IITB)"
                  >
                    ⚡ Seller
                  </button>
                  <button
                    onClick={() => handleQuickLogin('ADMIN')}
                    className="text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-800 px-2 py-1 rounded font-bold"
                    title="Login as Campus Admin"
                  >
                    ⚡ Admin
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-4 shadow-lg animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search textbooks, hostel gear..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-semibold">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-700">Marketplace</Link>
            <Link to="/semester-books" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-700">Semester Books</Link>
            <Link to="/free-corner" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-700">Free & Donation Corner</Link>
            <Link to="/products?maxPrice=299" onClick={() => setMobileMenuOpen(false)} className="py-2 text-amber-700">Under ₹299 Deals</Link>
            <Link to="/clubs" onClick={() => setMobileMenuOpen(false)} className="py-2 text-purple-700">Campus Clubs</Link>
            <Link to="/products/new" onClick={() => setMobileMenuOpen(false)} className="py-2 text-emerald-700 font-bold">List an Item</Link>

            {isAuthenticated ? (
              <>
                <Link to="/student-dashboard" onClick={() => setMobileMenuOpen(false)} className="py-2 text-emerald-700 font-bold">Student Dashboard</Link>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="py-2 text-slate-700">Profile & Verification</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="py-2 text-left text-rose-600 font-bold">Logout</button>
              </>
            ) : (
              <div className="pt-2 border-t flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 text-center bg-slate-100 font-bold rounded-xl text-slate-800">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-2.5 text-center bg-emerald-600 text-white font-bold rounded-xl">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
