import React, { useEffect, useState } from 'react';
import { Order, OrderStatus } from '../../types';
import { adminService } from '../../services/adminService';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const res = await adminService.getAllOrders();
      setOrders(res.content);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-bold text-slate-500">
        Loading All Platform Orders...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-black text-slate-900">All Platform Orders ({orders.length})</h2>
        <p className="text-xs text-slate-500">Admin oversight & global status updates</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
              <div>
                <span className="font-extrabold text-slate-900 text-sm">Order #{order.orderNumber}</span>
                <span className="text-slate-400 block">{new Date(order.createdAt).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Status:</span>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  className="p-1.5 bg-white border rounded-lg font-bold text-purple-900"
                >
                  <option value="PLACED">PLACED</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PACKED">PACKED</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-slate-900">Buyer: {order.buyerName} ({order.buyerEmail})</p>
                <p className="text-slate-600">{order.shippingAddress}, {order.city}, {order.state} - {order.pincode}</p>
              </div>

              <div className="text-right">
                <p className="text-base font-black text-slate-900">Total: ₹{order.totalAmount.toLocaleString('en-IN')}</p>
                <p className="text-emerald-700 font-bold">Payment: {order.paymentStatus}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
