import React, { useEffect, useState } from 'react';
import { User, Lock, Save, Leaf, ShieldCheck, Wind, Droplets, Recycle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { impactService } from '../services/impactService';
import { SustainabilityImpact } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [pincode, setPincode] = useState(user?.pincode || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [personalImpact, setPersonalImpact] = useState<SustainabilityImpact | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileData, userImp] = await Promise.all([
          userService.getProfile(),
          impactService.getUserImpact()
        ]);
        setName(profileData.name || '');
        setPhone(profileData.phone || '');
        setAddress(profileData.address || '');
        setCity(profileData.city || '');
        setState(profileData.state || '');
        setPincode(profileData.pincode || '');
        setPersonalImpact(userImp);
      } catch (e) {}
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErrMsg('');
    try {
      setLoading(true);
      await userService.updateProfile({ name, phone, address, city, state, pincode });
      await refreshUser();
      setMsg('Profile updated successfully!');
    } catch (err: any) {
      setErrMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErrMsg('');
    try {
      setLoading(true);
      await userService.changePassword(currentPassword, newPassword);
      setMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setErrMsg(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Profile</h1>
        <p className="text-xs text-slate-500 font-medium">Manage your personal information & password</p>
      </div>

      {/* Personal Sustainability Contribution Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-400 fill-current" />
            <h3 className="font-extrabold text-lg">Your Personal Eco Impact</h3>
          </div>
          <span className="text-xs font-bold bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full">
            Calculated from Completed Orders
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center pt-2">
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <Wind className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
            <span className="text-xl font-black text-white">{personalImpact?.co2Saved || 0} kg</span>
            <span className="text-[10px] text-emerald-100/80 block">CO₂ Avoided</span>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <Droplets className="w-5 h-5 text-sky-300 mx-auto mb-1" />
            <span className="text-xl font-black text-white">{personalImpact?.waterSaved || 0} L</span>
            <span className="text-[10px] text-emerald-100/80 block">Water Saved</span>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <Recycle className="w-5 h-5 text-amber-300 mx-auto mb-1" />
            <span className="text-xl font-black text-white">{personalImpact?.wasteReduced || 0} kg</span>
            <span className="text-[10px] text-emerald-100/80 block">Waste Reduced</span>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-teal-300 mx-auto mb-1" />
            <span className="text-xl font-black text-white">{personalImpact?.productsReused || 0}</span>
            <span className="text-[10px] text-emerald-100/80 block">Items Reused</span>
          </div>
        </div>
      </div>

      {msg && <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">{msg}</div>}
      {errMsg && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">{errMsg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Details Form */}
        <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs font-semibold">
          <h3 className="text-sm font-black text-slate-900 border-b pb-3">Personal Details</h3>

          <div className="space-y-1">
            <label className="text-slate-700">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">Email Address (Read-only)</label>
            <input type="email" value={user?.email || ''} disabled className="w-full p-2.5 bg-slate-100 border rounded-xl text-slate-500" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">Phone</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">Address</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-slate-700">City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label className="text-slate-700">State</label>
              <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
            </div>
            <div>
              <label className="text-slate-700">Pincode</label>
              <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md">
            <Save className="w-4 h-4" /> Save Profile Changes
          </button>
        </form>

        {/* Change Password Form */}
        <form onSubmit={handleChangePassword} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs font-semibold h-fit">
          <h3 className="text-sm font-black text-slate-900 border-b pb-3">Security & Password</h3>

          <div className="space-y-1">
            <label className="text-slate-700">Current Password</label>
            <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <div className="space-y-1">
            <label className="text-slate-700">New Password (Min 6 chars)</label>
            <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2.5 bg-slate-50 border rounded-xl" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md">
            <Lock className="w-4 h-4" /> Change Password
          </button>
        </form>

      </div>
    </div>
  );
};
