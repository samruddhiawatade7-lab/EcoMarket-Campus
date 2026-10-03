import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { User, Role } from '../../types';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers(query || undefined, roleFilter || undefined);
      setUsers(res.content);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [query, roleFilter]);

  const handleToggleStatus = async (userId: number) => {
    if (currentUser?.id === userId) {
      alert('You cannot deactivate your own admin account!');
      return;
    }
    try {
      const updatedUser = await adminService.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to toggle user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">User Account Management</h2>
          <p className="text-xs text-slate-500">Manage Buyers, Sellers, and Admins across EcoMarket</p>
        </div>

        {/* Filter / Search Inputs */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search user name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold"
          >
            <option value="">All Roles</option>
            <option value="BUYER">BUYER</option>
            <option value="SELLER">SELLER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500 font-bold">
          Loading Users...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 uppercase tracking-wider font-bold text-[10px] text-slate-500 border-b">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Role</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Location</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="p-3">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[10px] text-slate-400">{u.email}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : u.role === 'SELLER' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{u.phone || 'N/A'}</td>
                  <td className="p-3 text-slate-600">{u.city ? `${u.city}, ${u.state}` : 'N/A'}</td>
                  <td className="p-3">
                    {u.active ? (
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold text-[10px]">Active</span>
                    ) : (
                      <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full font-bold text-[10px]">Deactivated</span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id)}
                      disabled={currentUser?.id === u.id}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors ${
                        currentUser?.id === u.id
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : u.active
                          ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                          : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      }`}
                    >
                      {u.active ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
