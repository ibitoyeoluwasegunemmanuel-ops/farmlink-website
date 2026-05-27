'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';

export default function BuyerDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { count, total } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/auth');
  }, [loading, isAuthenticated, router]);

  if (loading || !user) return <div className="min-h-screen bg-canvas flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-brand-950 pt-16 pb-8">
        <div className="container-tight flex items-center justify-between">
          <div>
            <p className="text-brand-300 text-sm">Welcome back,</p>
            <h1 className="text-3xl font-black text-white">{user.fullName || 'Buyer'} 👋</h1>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="text-brand-400 hover:text-brand-200 text-sm font-medium transition-colors">Sign out</button>
        </div>
      </div>

      <div className="container-tight py-8 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Items in Cart', value: String(count), icon: '🛒', href: '/cart' },
            { label: 'Cart Value', value: `₦${total.toLocaleString()}`, icon: '💰', href: '/cart' },
            { label: 'My Orders', value: 'View →', icon: '📦', href: '/orders' },
            { label: 'Saved Items', value: 'View →', icon: '❤️', href: '/marketplace' },
          ].map(s => (
            <Link key={s.label} href={s.href} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover p-5 transition-all">
              <span className="text-2xl block mb-2">{s.icon}</span>
              <p className="font-black text-ink text-lg">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-black text-ink text-lg mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: '🛒', label: 'Browse Marketplace', desc: 'Find fresh produce from verified farmers', href: '/marketplace', color: 'bg-brand-50 border-brand-200' },
              { icon: '📦', label: 'My Orders', desc: 'Track and manage your orders', href: '/orders', color: 'bg-blue-50 border-blue-200' },
              { icon: '🛍️', label: 'View Cart', desc: `${count} items · ₦${total.toLocaleString()}`, href: '/cart', color: 'bg-amber-50 border-amber-200' },
              { icon: '👤', label: 'My Profile', desc: 'Update your delivery addresses', href: '/auth', color: 'bg-purple-50 border-purple-200' },
            ].map(a => (
              <Link key={a.label} href={a.href} className={`${a.color} border rounded-2xl p-4 hover:-translate-y-0.5 transition-all`}>
                <span className="text-3xl block mb-2">{a.icon}</span>
                <p className="font-bold text-ink text-sm">{a.label}</p>
                <p className="text-gray-500 text-xs mt-1">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured marketplace link */}
        <div className="bg-brand-950 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-black text-white text-xl mb-1">Fresh listings added today</h3>
            <p className="text-brand-200/60 text-sm">Discover new produce from 12,000+ verified farmers</p>
          </div>
          <Link href="/marketplace" className="btn-primary flex-shrink-0">Browse Now →</Link>
        </div>
      </div>
    </div>
  );
}
