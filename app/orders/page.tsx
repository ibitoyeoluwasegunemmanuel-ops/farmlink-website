'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

interface Order {
  id: string; status: string; totalAmount: number; createdAt: string;
  buyerId: string; farmerId?: string; quantity?: number; productId?: string;
  escrowStatus?: string; timeline?: { status: string; timestamp: string; note: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered: 'bg-teal-100 text-teal-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const MOCK_ORDERS: Order[] = [
  { id: 'txn_a1b2c3', status: 'completed', totalAmount: 385000, createdAt: '2025-11-06', buyerId: 'me', escrowStatus: 'released', timeline: [{ status: 'created', timestamp: '2025-11-06T08:00:00', note: 'Order placed' }, { status: 'paid', timestamp: '2025-11-06T08:05:00', note: 'Payment secured in escrow' }, { status: 'in_transit', timestamp: '2025-11-07T09:00:00', note: 'Driver assigned, in transit' }, { status: 'delivered', timestamp: '2025-11-08T14:30:00', note: 'Delivered and confirmed' }, { status: 'completed', timestamp: '2025-11-08T14:32:00', note: 'Payment released to farmer' }] },
  { id: 'txn_b2c3d4', status: 'in_transit', totalAmount: 130875, createdAt: '2025-11-05', buyerId: 'me', escrowStatus: 'held' },
  { id: 'txn_c3d4e5', status: 'paid', totalAmount: 576750, createdAt: '2025-11-04', buyerId: 'me', escrowStatus: 'held' },
  { id: 'txn_d4e5f6', status: 'pending_payment', totalAmount: 97125, createdAt: '2025-11-03', buyerId: 'me', escrowStatus: 'holding' },
];

function OrderCard({ order }: { order: Order }) {
  return (
    <Link href={`/orders/${order.id}`} className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300 p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-mono text-xs text-gray-400 mb-1">#{order.id.slice(0, 12)}…</p>
          <p className="font-black text-ink text-lg">₦{order.totalAmount.toLocaleString()}</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {order.status.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Placed {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        <span className="text-brand-600 font-semibold">View details →</span>
      </div>
    </Link>
  );
}

function OrdersContent() {
  const { user, isAuthenticated } = useAuth();
  const params = useSearchParams();
  const success = params.get('success');
  const ref = params.get('ref');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated || !user) { setOrders(MOCK_ORDERS); setLoading(false); return; }
    fetch(`${API}/transactions/user/${user.id}`)
      .then(r => r.json())
      .then(d => setOrders(d.transactions?.length ? d.transactions : MOCK_ORDERS))
      .catch(() => setOrders(MOCK_ORDERS))
      .finally(() => setLoading(false));
  }, [user, isAuthenticated]);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="container-tight py-8">
        {/* Success banner */}
        {success && (
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
            <span className="text-4xl">🎉</span>
            <div>
              <p className="font-black text-brand-800 text-lg">Order placed successfully!</p>
              <p className="text-brand-600 text-sm">Ref: {ref} · Your payment is secured in escrow.</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-ink">My Orders</h1>
          <Link href="/marketplace" className="btn-primary text-sm py-2.5 px-5">Shop More →</Link>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'pending_payment', label: 'Pending' },
            { key: 'paid', label: 'Paid' },
            { key: 'in_transit', label: 'In Transit' },
            { key: 'completed', label: 'Completed' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors flex-shrink-0 ${filter === f.key ? 'bg-brand-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400'}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">📦</p>
            <p className="font-bold text-ink text-xl mb-2">No orders found</p>
            <p className="text-gray-400 mb-6">You have no {filter !== 'all' ? filter.replace(/_/g, ' ') + ' ' : ''}orders yet.</p>
            <Link href="/marketplace" className="btn-primary inline-flex">Browse Marketplace →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
