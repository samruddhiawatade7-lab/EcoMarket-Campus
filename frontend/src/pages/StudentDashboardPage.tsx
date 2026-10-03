import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingBag, Heart, ShieldCheck, PlusCircle, CheckCircle,
  Clock, MapPin, RefreshCw, Trash2, Edit, AlertCircle, Building2, Sparkles, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Product, MarketplaceRequest } from '../types';
import productService from '../services/productService';
import marketplaceRequestService from '../services/marketplaceRequestService';
import authService from '../services/authService';

export const StudentDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'listings' | 'incoming_requests' | 'my_requests' | 'verification'>('listings');
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<MarketplaceRequest[]>([]);
  const [myRequests, setMyRequests] = useState<MarketplaceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Verification state
  const [collegeEmailInput, setCollegeEmailInput] = useState(user?.collegeEmail || '');
  const [otpCode, setOtpCode] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [prodPage, incReqs, outReqs] = await Promise.all([
        productService.getProducts({ size: 50 }),
        marketplaceRequestService.getSellerRequests(),
        marketplaceRequestService.getUserRequests()
      ]);
      // Filter products owned by current user
      const owned = prodPage.content?.filter(p => p.seller?.id === user?.id) || [];
      setMyProducts(owned);
      setIncomingRequests(incReqs);
      setMyRequests(outReqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (id: number, status: 'ACCEPTED' | 'COMPLETED' | 'CANCELLED', location?: string) => {
    try {
      await marketplaceRequestService.updateRequestStatus(id, status, location);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteListing = async (id: number) => {
    if (window.confirm('Are you sure you want to remove this product listing?')) {
      try {
        await productService.deleteProduct(id);
        fetchDashboardData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError('');
    try {
      await authService.verifyCollegeEmail({
        collegeEmail: collegeEmailInput,
        code: otpCode || '123456'
      });
      setVerificationSuccess(true);
      if (refreshUser) refreshUser();
    } catch (err: any) {
      setVerificationError(err.response?.data?.message || 'Invalid OTP code. Use 123456.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-black text-2xl flex items-center justify-center border-2 border-emerald-400">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{user?.name}</h1>
              {user?.verifiedStudent ? (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Verified Student
                </span>
              ) : (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Unverified
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              {user?.collegeName ? `${user.collegeName} (${user.collegeCode || 'Campus'})` : 'No Campus Selected'}
              {user?.course && ` • ${user.course}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products/new"
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-2xl flex items-center gap-2 shadow-md transition-all"
          >
            <PlusCircle className="w-4 h-4" /> List New Item
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-4">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'listings' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Listings ({myProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('incoming_requests')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'incoming_requests' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Buyer Handovers Inbox
          {incomingRequests.filter(r => r.status === 'REQUESTED').length > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
              {incomingRequests.filter(r => r.status === 'REQUESTED').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('my_requests')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'my_requests' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          My Requested Items ({myRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1 ${
            activeTab === 'verification' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          College Email Verification
        </button>
      </div>

      {/* TAB CONTENT: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {myProducts.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">No Listings Yet</h3>
              <p className="text-xs text-slate-500 mt-1">Have textbooks, hostel gear, or electronics you no longer need?</p>
              <Link to="/products/new" className="inline-block mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                List an Item Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myProducts.map((p) => (
                <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex gap-4">
                  <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'} alt={p.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {p.listingType}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h4>
                    <p className="text-xs font-black text-slate-900">₹{p.price}</p>
                    <div className="flex items-center gap-2 pt-2">
                      <Link to={`/products/${p.id}/edit`} className="text-[11px] font-bold text-blue-600 flex items-center gap-0.5">
                        <Edit className="w-3 h-3" /> Edit
                      </Link>
                      <button onClick={() => handleDeleteListing(p.id)} className="text-[11px] font-bold text-rose-600 flex items-center gap-0.5">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: INCOMING HANDOVER REQUESTS */}
      {activeTab === 'incoming_requests' && (
        <div className="space-y-4">
          {incomingRequests.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">No Handover Requests Yet</h3>
              <p className="text-xs text-slate-500 mt-1">When students request your listed items, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((req) => (
                <div key={req.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-white">{req.requestType}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {req.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{req.productName}</h4>
                    <p className="text-xs text-slate-600">
                      Requested by <strong>{req.buyerName}</strong> ({req.buyerCollege || 'Campus Student'})
                    </p>
                    {req.message && <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg">"{req.message}"</p>}
                    <p className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> Handover Spot: {req.pickupLocation || 'Campus Library / Main Gate'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'REQUESTED' && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, 'ACCEPTED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                      >
                        Accept Handover
                      </button>
                    )}
                    {req.status === 'ACCEPTED' && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, 'COMPLETED')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl"
                      >
                        Mark Handed Over / Completed
                      </button>
                    )}
                    {req.status !== 'COMPLETED' && req.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleUpdateRequestStatus(req.id, 'CANCELLED')}
                        className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: MY OUTGOING REQUESTS */}
      {activeTab === 'my_requests' && (
        <div className="space-y-4">
          {myRequests.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
              <Send className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800">No Sent Requests</h3>
              <p className="text-xs text-slate-500 mt-1">Browse the marketplace and request items from other students!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div key={req.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-700">{req.requestType}</span>
                    <h4 className="font-bold text-slate-900 text-sm">{req.productName}</h4>
                    <p className="text-xs text-slate-500">Seller: {req.sellerName} ({req.sellerCollege || 'Campus'})</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${req.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: COLLEGE VERIFICATION */}
      {activeTab === 'verification' && (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900">Verify Your College Email Domain</h2>
            <p className="text-xs text-slate-500">
              Students registering with verified college emails (.ac.in, .edu, coep.ac.in, iitb.ac.in) receive a verified badge.
            </p>
          </div>

          {verificationSuccess ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900">College Student Verification Complete!</h3>
              <p className="text-xs text-emerald-700">You can now post student listings and perform verified campus handovers.</p>
            </div>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {verificationError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
                  {verificationError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your College Email Address</label>
                <input
                  type="email"
                  placeholder="student@coep.ac.in, iitb.ac.in..."
                  value={collegeEmailInput}
                  onChange={(e) => setCollegeEmailInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Enter Verification Code (OTP)</label>
                <input
                  type="text"
                  placeholder="Use default code: 123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1">Default test verification OTP is <strong>123456</strong>.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md transition-all"
              >
                Verify & Unlock Student Badge
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};

export default StudentDashboardPage;
