'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

const RECENT_ORDERS = [
  { id: 'txn_a1b2c3', product: 'Premium Tomatoes (50kg)', amount: 385000, status: 'completed', date: '2026-05-20', icon: '🍅' },
  { id: 'txn_b2c3d4', product: 'White Maize (100kg bag)', amount: 130875, status: 'in_transit', date: '2026-05-24', icon: '🌽' },
  { id: 'txn_c3d4e5', product: 'Catfish — Fresh (1kg)', amount: 576750, status: 'paid', date: '2026-05-25', icon: '🐟' },
];

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  in_transit: 'bg-purple-100 text-purple-700',
  paid: 'bg-blue-100 text-blue-700',
  pending_payment: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-600',
};

const SUGGESTED = [
  { name: 'Fresh Tomatoes', price: '₦35,000/bag', icon: '🍅', href: '/marketplace' },
  { name: 'Catfish (1kg)', price: '₦2,800/kg', icon: '🐟', href: '/marketplace' },
  { name: 'White Maize', price: '₦28,000/bag', icon: '🌽', href: '/marketplace' },
  { name: 'Plantain (bunch)', price: '₦4,500', icon: '🍌', href: '/marketplace' },
];

export default function BuyerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const { count, total } = useCart();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/auth');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  if (loading || !user) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-800 via-brand-700 to-emerald-600 pt-24 pb-10 px-4">
        <div className="container-tight">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-brand-200 text-sm font-medium">{greeting},</p>
              <h1 className="text-3xl font-black text-white mt-0.5">{user.fullName || 'Buyer'} 👋</h1>
              <p className="text-white/60 text-sm mt-1">
                {user.state ? `📍 ${user.state}` : 'Complete your profile to get better recommendations'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/notifications" className="relative bg-white/15 hover:bg-white/25 transition-colors w-11 h-11 rounded-2xl flex items-center justify-center text-white">
                🔔
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">3</span>
              </Link>
              <Link href="/profile" className="bg-white/15 hover:bg-white/25 transition-colors px-4 py-2.5 rounded-2xl text-white text-sm font-semibold">
                My Profile
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
            {[
              { label: 'Total Orders', value: '3', icon: '📦', sub: 'All time', href: '/orders' },
              { label: 'Cart Items', value: String(count), icon: '🛒', sub: `₦${total.toLocaleString()}`, href: '/cart' },
              { label: 'Wallet Balance', value: '₦87,500', icon: '💳', sub: 'Available', href: '/wallet' },
              { label: 'Saved Farmers', value: '5', icon: '❤️', sub: 'Following', href: '/marketplace' },
            ].map(s => (
              <Link key={s.label} href={s.href}
                className="bg-white/10 hover:bg-white/20 transition-all rounded-2xl p-4 text-white backdrop-blur-sm">
                <div className="text-2xl mb-2">{s.icon}</div>
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container-tight py-8 space-y-6">

        {/* Active order alert */}
        <div className="bg-purple-50 border border-purple-200 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">🚛</div>
            <div>
              <p className="font-black text-purple-900">Order in Transit</p>
              <p className="text-sm text-purple-600">White Maize (100kg) is on its way — ETA: Today 2:30 PM</p>
            </div>
          </div>
          <Link href="/orders/txn_b2c3d4" className="bg-purple-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors flex-shrink-0">
            Track →
          </Link>
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="text-base font-black text-ink mb-3">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '🛒', label: 'Shop Marketplace', desc: 'Buy fresh produce', href: '/marketplace', color: 'from-green-500 to-emerald-600' },
              { icon: '🚛', label: 'Book Transport', desc: 'Move your goods', href: '/transport', color: 'from-blue-500 to-blue-600' },
              { icon: '⚙️', label: 'Hire Equipment', desc: 'Tractors & more', href: '/equipment', color: 'from-orange-500 to-amber-600' },
              { icon: '💼', label: 'Invest in Farms', desc: '15–28% returns', href: '/invest', color: 'from-purple-500 to-violet-600' },
            ].map(a => (
              <Link key={a.label} href={a.href}
                className={`bg-gradient-to-br ${a.color} rounded-2xl p-4 text-white hover:scale-[1.02] transition-transform`}>
                <div className="text-3xl mb-2">{a.icon}</div>
                <p className="font-bold text-sm">{a.label}</p>
                <p className="text-white/70 text-xs mt-0.5">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent orders */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-ink">Recent Orders</h2>
              <Link href="/orders" className="text-sm text-brand-600 font-semibold">See all →</Link>
            </div>
            <div className="space-y-3">
              {RECENT_ORDERS.map(order => (
                <Link key={order.id} href={`/orders/${order.id}`}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {order.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink text-sm truncate">{order.product}</p>
                    <p className="text-xs text-gray-400">{order.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-sm text-ink">₦{order.amount.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Suggested products */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-ink">Based on Your Orders</h2>
              <Link href="/marketplace" className="text-sm text-brand-600 font-semibold">Browse all →</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {SUGGESTED.map(item => (
                <Link key={item.name} href={item.href}
                  className="bg-gray-50 hover:bg-brand-50 transition-colors rounded-2xl p-3 text-center">
                  <div className="text-3xl mb-1.5">{item.icon}</div>
                  <p className="font-semibold text-ink text-xs leading-snug">{item.name}</p>
                  <p className="text-brand-600 text-xs font-bold mt-0.5">{item.price}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Market prices banner */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-800 rounded-3xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Live Market Prices</p>
            <h3 className="text-white font-black text-lg">Today: Tomatoes ▲8% · Maize ▼3% · Cocoa ▲15%</h3>
            <p className="text-white/50 text-xs mt-1">Prices across 5 Nigerian states — updated every hour</p>
          </div>
          <Link href="/market-prices" className="bg-white text-blue-900 px-5 py-2.5 rounded-xl font-black text-sm hover:bg-blue-50 transition-colors flex-shrink-0">
            See Prices →
          </Link>
        </div>

        {/* Verification prompt (if not verified) */}
        {!user.isVerified && (
          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-center gap-4">
            <div className="text-3xl flex-shrink-0">🪪</div>
            <div className="flex-1">
              <p className="font-black text-amber-900">Verify your identity to unlock all features</p>
              <p className="text-sm text-amber-700 mt-0.5">Upload your National ID (NIN / Voter's Card) to get a Verified badge and access higher transaction limits.</p>
            </div>
            <Link href="/profile" className="bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors flex-shrink-0">
              Verify →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
