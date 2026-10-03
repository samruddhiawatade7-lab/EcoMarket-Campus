import React, { useEffect, useState } from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, MapPin, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { sellerService } from '../../services/sellerService';
import { orderService } from '../../services/orderService';

export const SellerOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyPinOrderId, setVerifyPinOrderId] = useState<number | null>(null);
  const [handoverPin, setHandoverPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const fetchOrders = async () => {
    try {
      const res = await sellerService.getSellerOrders();
      setOrders(res.content);
    } catch (err) {
      console.error('Failed to load seller orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (newStatus === 'DELIVERED') {
      setVerifyPinOrderId(orderId);
      return;
    }

    try {
      const updated = await sellerService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      setSuccessMsg(`Order #${updated.orderNumber} status updated to ${newStatus}`);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleVerifyHandoverPin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!verifyPinOrderId || !handoverPin || handoverPin.length !== 6) {
      setErrorMsg('Please enter a valid 6-digit Handover PIN code given by the buyer.');
      return;
    }

    try {
      const updated = await orderService.verifyHandoverCode(verifyPinOrderId, handoverPin);
      setOrders(prev => prev.map(o => o.id === verifyPinOrderId ? updated : o));
      setSuccessMsg(`🎉 Handover PIN verified! Order #${updated.orderNumber} is marked as DELIVERED.`);
      setVerifyPinOrderId(null);
      setHandoverPin('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid Handover Code PIN.');
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-2 text-xs font-bold text-slate-500">Loading Orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Student Orders & Campus Handover Management</h2>
          <p className="text-xs text-slate-500">Track orders from PLACED → CONFIRMED → READY_FOR_HANDOVER → DELIVERED</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Verify Handover PIN Modal */}
      {verifyPinOrderId && (
        <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-4 border border-emerald-500/40 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-emerald-400" />
              <h3 className="font-black text-base text-white">Verify Handover PIN Code</h3>
            </div>
            <button onClick={() => setVerifyPinOrderId(null)} className="text-xs font-bold text-slate-400 hover:text-white">Cancel</button>
          </div>
          <p className="text-xs text-slate-300">
            Ask the buyer for their secret 6-digit Handover PIN upon physical meeting at the campus pickup spot.
          </p>
          <form onSubmit={handleVerifyHandoverPin} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              maxLength={6}
              value={handoverPin}
              onChange={(e) => setHandoverPin(e.target.value)}
              placeholder="Enter 6-digit PIN"
              className="p-3 bg-slate-800 border border-emerald-500/50 rounded-xl text-center font-mono font-bold text-white tracking-widest text-lg"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" /> Verify PIN & Complete Delivery
            </button>
          </form>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-xs bg-slate-50 rounded-2xl border">
          No orders received for your products yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-base">Order #{order.orderNumber}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase">
                      {order.handoverMethod === 'CAMPUS_DELIVERY' ? 'Campus Delivery' : 'Campus Pickup'}
                    </span>
                  </div>
                  <span className="text-slate-400 block text-[11px] mt-0.5">{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-600 font-bold">Status:</span>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    disabled={order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED'}
                    className="p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="PLACED">1. PLACED & PAID</option>
                    <option value="CONFIRMED">2. CONFIRMED</option>
                    <option value="READY_FOR_HANDOVER">3. READY FOR HANDOVER</option>
                    <option value="DELIVERED">4. DELIVERED (Requires PIN)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  {order.orderStatus === 'READY_FOR_HANDOVER' && (
                    <button
                      onClick={() => setVerifyPinOrderId(order.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" /> Enter Handover PIN
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-1">
                  <p className="font-bold text-slate-900">Buyer: {order.buyerName} ({order.phone})</p>
                  <p className="text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Pickup Spot: <strong>{order.pickupLocation}</strong></span>
                  </p>
                  <p className="text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Time Slot: {order.preferredTimeSlot}</span>
                  </p>
                </div>

                <div className="space-y-1.5">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      <span className="font-bold text-slate-900">{item.productName} (x{item.quantity})</span>
                      <span className="font-black text-slate-900">₹{item.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};
