import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'SELLER') navigate('/seller');
      else if (user.role === 'ADMIN') navigate('/admin');
      else navigate(from);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type: 'buyer' | 'seller' | 'admin') => {
    if (type === 'buyer') {
      setEmail('buyer@ecomarket.com');
      setPassword('Buyer@123');
    } else if (type === 'seller') {
      setEmail('seller@ecomarket.com');
      setPassword('Seller@123');
    } else {
      setEmail('admin@ecomarket.com');
      setPassword('Admin@123');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <Leaf className="w-7 h-7 fill-current" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">Sign in to your EcoMarket sustainable account</p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Quick Dev Login Buttons */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center">
            ⚡ Quick Test Account Login
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('buyer')}
              className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] rounded-lg border shadow-xs"
            >
              Buyer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('seller')}
              className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-lg border border-emerald-200"
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-[11px] rounded-lg border border-purple-200"
            >
              Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
          <div className="space-y-1">
            <label className="text-slate-700">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {loading ? 'Authenticating...' : 'Sign In to EcoMarket'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-emerald-600 hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
};
