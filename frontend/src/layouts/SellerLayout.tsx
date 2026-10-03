import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, ArrowLeft, Leaf } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';

export const SellerLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Overview', path: '/seller', icon: LayoutDashboard },
    { label: 'My Products', path: '/seller/products', icon: Package },
    { label: 'Add New Product', path: '/seller/products/new', icon: PlusCircle },
    { label: 'Orders Received', path: '/seller/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Seller Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Seller Management Dashboard</h1>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Store
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm h-fit space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </aside>

          {/* Main Seller Content View */}
          <main className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm min-h-[500px]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
