'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

const MOCK: Record<string, any> = {
  'txn_a1b2c3': { id: 'txn_a1b2c3', status: 'completed', totalAmount: 385000, platformFee: 7700, logisticsFee: 19250, farmerAmount: 358050, createdAt: '2025-11-06', escrowStatus: 'released', timeline: [{ status: 'created', timestamp: '2025-11-06T08:00:00', note: 'Order placed and transaction created' }, { status: 'paid', timestamp: '2025-11-06T08:05:00', note: 'Payment of ₦385,000 secured in escrow' }, { status: 'in_transit', timestamp: '2025-11-07T09:00:00', note: 'Driver assigned — Musa Ibrahim (Kano)' }, { status: 'delivered', timestamp: '2025-11-08T14:30:00', note: 'Delivery confirmed by buyer' }, { status: 'completed', timestamp: '2025-11-08T14:32:00', note: '₦358,050 released to farmer' }] },
  'txn_b2c3d4': { id: 'txn_b2c3d4', status: 'in_transit', totalAmount: 130875, platformFee: 2617, logisticsFee: 6543, farmerAmount: 121715, createdAt: '2025-11-05', escrowStatus: 'held', timeline: [{ status: 'created', timestamp: '2025-11-05T10:00:00', note: 'Order placed' }, { status: 'paid', timestamp: '2025-11-05T10:10:00', note: 'Payment secured in escrow' }, { status: 'in_transit', timestamp: '2025-11-06T08:30:00', note: 'Driver Adamu picked up goods — ETA 4hrs' }] },
};

const STATUS_STEPS = ['pending_payment', 'paid', 'in_transit', 'delivered', 'completed'];
const STATUS_LABELS: Record<string, string> = { pending_payment: 'Awaiting Payment', paid: 'Payment Secured', in_transit: 'In Transit', delivered: 'Delivered', completed: 'Completed' };
const STATUS_ICONS: Record<string, string> = { pending_payment: '💳', paid: '🔒', in_transit: '🚛', delivered: '📦', completed: '✅' };

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    fetch(`${API}/transactions/${id}`)
      .then(r => r.json())
      .then(d => setOrder(d.transaction || MOCK[id]))
      .catch(() => setOrder(MOCK[id] || null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleConfirmDelivery = async () => {
    setConfirming(true);
    try {
      await fetch(`${API}/transactions/confirm-delivery/${order.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: user?.id }),
      });
      setOrder((prev: any) => ({ ...prev, status: 'delivered' }));
    } catch { /* ignore */ }
    setConfirming(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-20 flex justify-center"><div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-20 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h1 className="text-2xl font-black text-ink mb-2">Order not found</h1>
        <Link href="/orders" className="btn-primary inline-flex mt-4">Back to Orders →</Link>
      </div>
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-8">
        {/* Back */}
        <Link href="/orders" className="inline-flex items-center gap-2 text-brand-600 text-sm font-semibold mb-6 hover:text-brand-700">
          ← Back to Orders
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: tracking */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-mono text-gray-400 mb-1">Order #{order.id}</p>
                  <h1 className="text-2xl font-black text-ink">₦{order.totalAmount.toLocaleString()}</h1>
                </div>
                <span className={`text-sm font-bold px-4 py-1.5 rounded-full ${order.status === 'completed' ? 'bg-green-100 text-green-700' : order.status === 'in_transit' ? 'bg-purple-100 text-purple-700' : order.status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm">Placed {new Date(order.createdAt).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            {/* Progress tracker */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-ink mb-6">Order Progress</h2>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-6 bottom-6 w-0.5 bg-gray-100" />
                <div className="absolute left-5 top-6 w-0.5 bg-brand-500 transition-all" style={{ height: `${Math.max(0, currentStep / (STATUS_STEPS.length - 1)) * 100}%` }} />

                <div className="space-y-6">
                  {STATUS_STEPS.map((s, i) => {
                    const done = i <= currentStep;
                    const tl = order.timeline?.find((t: any) => t.status === s);
                    return (
                      <div key={s} className="flex items-start gap-4 pl-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 z-10 transition-all ${done ? 'bg-brand-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-300'}`}>
                          {STATUS_ICONS[s]}
                        </div>
                        <div className="pt-1.5">
                          <p className={`font-semibold text-sm ${done ? 'text-ink' : 'text-gray-400'}`}>{STATUS_LABELS[s]}</p>
                          {tl && <p className="text-gray-400 text-xs mt-0.5">{tl.note} · {new Date(tl.timestamp).toLocaleString()}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Confirm delivery CTA */}
            {order.status === 'in_transit' && (
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6">
                <h3 className="font-bold text-brand-800 mb-2">📦 Have you received your goods?</h3>
                <p className="text-brand-600 text-sm mb-4">Confirm delivery to release payment from escrow to the farmer.</p>
                <button onClick={handleConfirmDelivery} disabled={confirming} className="bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
                  {confirming ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '✅ Confirm Delivery & Release Payment'}
                </button>
              </div>
            )}
          </div>

          {/* Right: payment details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-ink mb-4">Payment Details</h2>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Total paid', value: `₦${order.totalAmount?.toLocaleString()}`, bold: true },
                  { label: 'Platform fee (2%)', value: `₦${order.platformFee?.toLocaleString() || '—'}` },
                  { label: 'Logistics fee (5%)', value: `₦${order.logisticsFee?.toLocaleString() || '—'}` },
                  { label: 'Farmer receives', value: `₦${order.farmerAmount?.toLocaleString() || '—'}` },
                  { label: 'Escrow status', value: order.escrowStatus || 'holding' },
                ].map(r => (
                  <div key={r.label} className={`flex justify-between ${r.bold ? 'font-bold text-ink' : 'text-gray-600'}`}>
                    <span>{r.label}</span>
                    <span className="capitalize">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-brand-600 bg-brand-50 px-3 py-2 rounded-lg">
                  <span>🔒</span> Funds secured by FarmLink Escrow
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
