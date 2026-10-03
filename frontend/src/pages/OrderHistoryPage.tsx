import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Clock, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Order } from '../types';
import { orderService } from '../services/orderService';

export const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.getUserOrders();
        setOrders(res.content);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> In Transit</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Processing ({status})</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-3 text-xs font-bold text-slate-500">Loading Order History...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto text-3xl">
          📦
        </div>
        <h2 className="text-2xl font-black text-slate-900">No Orders Placed Yet</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You haven't placed any sustainable orders yet. Start exploring eco-friendly products today!
        </p>
        <Link to="/products" className="inline-block px-6 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Order History</h1>
        <p className="text-xs text-slate-500 font-medium">Track and manage your sustainable purchases</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            
            {/* Header bar */}
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-extrabold text-slate-900 text-sm">Order #{order.orderNumber}</span>
                <span className="text-slate-400 block">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(order.orderStatus)}
                <span className="font-black text-slate-900 text-base">₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Items list */}
            <div className="p-4 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.productImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                    <div>
                      <p className="font-bold text-slate-900">{item.productName}</p>
                      <p className="text-slate-500">Qty: {item.quantity} • Sold by {item.sellerName}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800">₹{item.subtotal.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Footer action */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end">
              <Link
                to={`/orders/${order.id}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1"
              >
                Track & Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
