import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, MapPin, XCircle, KeyRound, Clock, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id || '0');
  const { user } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');

  // Handover Verification State
  const [inputHandoverCode, setInputHandoverCode] = useState<string>('');
  const [verifying, setVerifying] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(orderId);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleVerifyHandover = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg('');
    setMsg('');

    if (!inputHandoverCode || inputHandoverCode.length !== 6) {
      setErrMsg('Please enter a valid 6-digit Handover PIN code.');
      return;
    }

    try {
      setVerifying(true);
      const updated = await orderService.verifyHandoverCode(orderId, inputHandoverCode);
      setOrder(updated);
      setMsg('🎉 Handover Code verified successfully! Order is now marked as DELIVERED.');
      setInputHandoverCode('');
    } catch (err: any) {
      setErrMsg(err.response?.data?.message || 'Invalid Handover Code. Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? Item inventory will be restored.')) return;
    try {
      setCancelling(true);
      const updated = await orderService.cancelOrder(orderId);
      setOrder(updated);
      setMsg('Order has been cancelled successfully.');
    } catch (err: any) {
      setErrMsg(err.response?.data?.message || 'Failed to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-3 text-xs font-bold text-slate-500">Loading Order Tracking Details...</p>
      </div>
    );
  }

  const trackingSteps: { status: OrderStatus; label: string }[] = [
    { status: 'PLACED', label: 'Placed & Paid' },
    { status: 'CONFIRMED', label: 'Confirmed' },
    { status: 'READY_FOR_HANDOVER', label: 'Ready for Pickup' },
    { status: 'DELIVERED', label: 'Delivered' }
  ];

  const getStepIndex = (st: OrderStatus) => {
    return trackingSteps.findIndex(s => s.status === st);
  };

  const currentStepIdx = getStepIndex(order.orderStatus);
  const isBuyer = user?.id === order.buyerId;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <Link to="/orders" className="text-xs font-bold text-slate-600 hover:text-emerald-600 flex items-center gap-1 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to My Orders
      </Link>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        
        {/* Order Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Student Order Details
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">Order #{order.orderNumber}</h1>
            <p className="text-xs text-slate-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            <span className="block text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
              Payment: {order.paymentStatus} ({order.paymentMethod})
            </span>
          </div>
        </div>

        {msg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {errMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>{errMsg}</span>
          </div>
        )}

        {/* Visual Order Tracking Timeline */}
        {order.orderStatus !== 'CANCELLED' ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Handover Status Sequence</h3>
            <div className="flex items-center justify-between relative px-4">
              <div className="absolute left-6 right-6 top-1/2 h-1 bg-slate-200 -z-0"></div>
              {trackingSteps.map((stepItem, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={stepItem.status} className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPassed ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-md' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-[11px] max-w-[90px] font-bold leading-tight ${isCurrent ? 'text-emerald-700 font-black' : isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                      {stepItem.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold">
            <XCircle className="w-5 h-5" /> Order has been cancelled. Inventory was restored.
          </div>
        )}

        {/* 🔐 ONE-TIME HANDOVER CODE (PIN) SECURITY CARD */}
        {order.orderStatus !== 'CANCELLED' && order.handoverCode && (
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl shadow-xl space-y-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <ShieldCheck className="w-64 h-64 text-emerald-400" />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-emerald-800/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl text-emerald-400">
                  <KeyRound className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg">One-Time Handover Code</h3>
                    <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 font-black text-[9px] rounded-full uppercase">Secure Student OTP</span>
                  </div>
                  <p className="text-xs text-emerald-200/80">Required to mark order as DELIVERED upon physical meeting on campus</p>
                </div>
              </div>

              {/* Display Code for Buyer / Seller */}
              <div className="bg-emerald-950/80 border border-emerald-500/40 px-6 py-3 rounded-2xl text-center shadow-inner">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono block">6-Digit Handover PIN</span>
                <span className="text-3xl font-mono font-black tracking-widest text-white">{order.handoverCode}</span>
              </div>
            </div>

            <div className="text-xs text-emerald-200/90 leading-relaxed bg-emerald-950/40 p-4 rounded-2xl border border-emerald-800/40 flex items-start gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Physical Verification Protection:</strong> The seller cannot mark this order as <em>DELIVERED</em> alone. During handover at <strong>{order.pickupLocation}</strong>, share or enter this PIN code to confirm physical receipt of your item!
              </span>
            </div>

            {/* Handover Verification Form */}
            {order.orderStatus !== 'DELIVERED' && (
              <form onSubmit={handleVerifyHandover} className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  maxLength={6}
                  value={inputHandoverCode}
                  onChange={(e) => setInputHandoverCode(e.target.value)}
                  placeholder="Enter 6-digit PIN"
                  className="w-full sm:w-48 p-3 bg-slate-900 border border-emerald-500/50 rounded-xl text-center font-mono font-bold text-white text-base focus:ring-2 focus:ring-emerald-400 uppercase"
                />
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {verifying ? 'Verifying PIN...' : 'Confirm Physical Handover'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Detailed Tracking History Timeline Table */}
        {order.trackingHistory && order.trackingHistory.length > 0 && (
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Separate Order Tracking History</h3>
            <div className="space-y-3">
              {order.trackingHistory.map((track) => (
                <div key={track.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3.5 text-xs">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-slate-900">{track.title}</h4>
                      <span className="text-[10px] font-mono text-slate-500">{new Date(track.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-600">{track.description}</p>
                    {track.location && (
                      <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Location: {track.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Campus Pickup Details & Product List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-xs">
          
          <div className="md:col-span-1 space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
            <h4 className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-700">
              <MapPin className="w-4 h-4" /> Handover Details
            </h4>
            <div className="space-y-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Method</span>
                <span className="font-bold text-slate-900 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[11px]">
                  {order.handoverMethod === 'CAMPUS_DELIVERY' ? 'Campus Delivery' : 'Campus Pickup (Primary)'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Pickup Location</span>
                <span className="font-bold text-slate-900">{order.pickupLocation}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Preferred Time Slot</span>
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> {order.preferredTimeSlot}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Contact Phone</span>
                <span className="font-medium text-slate-700">{order.phone}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider">Ordered Products</h4>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200/80 rounded-2xl bg-white shadow-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.productImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-100" />
                    <div>
                      <Link to={`/products/${item.productId}`} className="font-bold text-slate-900 hover:text-emerald-600">
                        {item.productName}
                      </Link>
                      <p className="text-slate-500">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-slate-900 block">₹{item.subtotal.toLocaleString('en-IN')}</span>
                    {order.orderStatus === 'DELIVERED' && (
                      <Link to={`/products/${item.productId}`} className="text-[10px] text-emerald-600 font-bold hover:underline">
                        Write Review
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Order Cancellation Option */}
        {(order.orderStatus === 'PLACED' || order.orderStatus === 'CONFIRMED') && (
          <div className="pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
