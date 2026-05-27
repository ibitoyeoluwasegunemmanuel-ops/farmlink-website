'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useAuth } from '../../../contexts/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

interface Listing { id: string; cropType: string; quantity: number; unit: string; pricePerUnit: number; status: string; createdAt: string; }

const MOCK_LISTINGS: Listing[] = [
  { id: '1', cropType: 'White Maize', quantity: 200, unit: 'bag', pricePerUnit: 55000, status: 'available', createdAt: '2025-11-06' },
  { id: '9', cropType: 'Paddy Rice', quantity: 800, unit: 'bag', pricePerUnit: 38000, status: 'available', createdAt: '2025-11-02' },
  { id: '3', cropType: 'Roma Tomatoes', quantity: 80, unit: 'crate', pricePerUnit: 12000, status: 'sold', createdAt: '2025-10-28' },
];

const NAV = [
  { key: 'overview', label: 'Overview', icon: '📊' },
  { key: 'listings', label: 'My Listings', icon: '🌾' },
  { key: 'orders', label: 'Orders', icon: '📦' },
  { key: 'post', label: 'Post Listing', icon: '➕' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

export default function FarmerDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState({ totalEarnings: 0, pendingPayments: 0, activeHarvests: 0, totalOrders: 0 });

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/auth');
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      fetch(`${API}/farmers/dashboard/${user.id}`).then(r => r.json()).catch(() => ({})),
      fetch(`${API}/harvests/farmer/${user.id}`).then(r => r.json()).catch(() => ({})),
    ]).then(([dashData, listData]) => {
      if (dashData.stats) setStats(dashData.stats);
      setListings(listData.data?.length ? listData.data : MOCK_LISTINGS);
    });
  }, [user]);

  // Post listing state
  const [form, setForm] = useState({ cropType: '', quantity: '', unit: 'bag', pricePerUnit: '', quality: 'Grade A', description: '', state: '', town: '' });
  const [posting, setPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState('');

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true); setPostError('');
    try {
      const res = await fetch(`${API}/harvests/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity), pricePerUnit: Number(form.pricePerUnit), farmerId: user?.id, location: { state: form.state, town: form.town } }),
      });
      if (res.ok) { setPostSuccess(true); setForm({ cropType: '', quantity: '', unit: 'bag', pricePerUnit: '', quality: 'Grade A', description: '', state: '', town: '' }); setTab('listings'); }
      else setPostError('Failed to post listing. Try again.');
    } catch { setPostError('Network error. Try again.'); }
    setPosting(false);
  };

  if (loading || !user) return <div className="min-h-screen bg-canvas flex items-center justify-center"><div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-56 bg-brand-950 flex flex-col z-30">
        <div className="p-5 border-b border-brand-800/50">
          <Link href="/" className="flex items-center gap-2 mb-0">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center"><span className="text-white font-black text-xs">FL</span></div>
            <span className="text-white font-bold">FarmLink</span>
          </Link>
        </div>
        <div className="px-3 py-4">
          <div className="flex items-center gap-2.5 px-3 py-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user.fullName || 'F').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-xs truncate">{user.fullName || 'Farmer'}</p>
              <p className="text-brand-400 text-xs">Farmer · {user.state || 'Nigeria'}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {NAV.map(n => (
              <button key={n.key} onClick={() => setTab(n.key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === n.key ? 'bg-brand-600 text-white' : 'text-brand-200/60 hover:bg-brand-800/60 hover:text-white'}`}>
                <span>{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-brand-800/50">
          <button onClick={() => { logout(); router.push('/'); }} className="w-full text-brand-400/60 hover:text-brand-300 text-xs font-medium py-2 transition-colors">Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 min-h-screen">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-base font-black text-ink capitalize">{tab === 'post' ? 'Post New Listing' : tab}</h1>
            <p className="text-gray-400 text-xs">Farmer Dashboard · {user.farmName || user.fullName}</p>
          </div>
          <Link href="/dashboard/farmer/listings/new" className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5">
            <span>+</span> New Listing
          </Link>
        </header>

        <div className="p-6">
          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: 'Total Earned', value: stats.totalEarnings > 0 ? `₦${stats.totalEarnings.toLocaleString()}` : '₦0', icon: '💰', sub: 'all time' },
                  { label: 'Active Listings', value: String(stats.activeHarvests || listings.filter(l => l.status === 'available').length), icon: '🌾', sub: 'on marketplace' },
                  { label: 'Pending Payment', value: stats.pendingPayments > 0 ? `₦${stats.pendingPayments.toLocaleString()}` : '₦0', icon: '⏳', sub: 'in escrow' },
                  { label: 'Total Orders', value: String(stats.totalOrders || 0), icon: '📦', sub: 'received' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="text-2xl mb-3">{s.icon}</div>
                    <p className="text-2xl font-black text-ink">{s.value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-ink">Recent Listings</h2>
                    <button onClick={() => setTab('listings')} className="text-brand-600 text-xs font-semibold">View all</button>
                  </div>
                  <div className="space-y-3">
                    {listings.slice(0, 3).map(l => (
                      <div key={l.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-ink text-sm truncate">{l.cropType}</p>
                          <p className="text-gray-400 text-xs">{l.quantity} {l.unit}s · ₦{l.pricePerUnit.toLocaleString()}/{l.unit}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${l.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {l.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
                  <h2 className="font-bold text-ink mb-3">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: '➕', label: 'Post Listing', action: () => setTab('post') },
                      { icon: '📦', label: 'View Orders', action: () => setTab('orders') },
                      { icon: '🌾', label: 'My Listings', action: () => setTab('listings') },
                      { icon: '👤', label: 'Edit Profile', action: () => setTab('profile') },
                    ].map(a => (
                      <button key={a.label} onClick={a.action} className="bg-white hover:bg-brand-50 border border-brand-200 rounded-xl p-4 text-left transition-colors">
                        <span className="text-2xl block mb-1.5">{a.icon}</span>
                        <span className="text-sm font-semibold text-ink">{a.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Payments & Withdrawal */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-black text-ink text-lg">Payments & Wallet</h2>
                  <Link href="/wallet" className="text-sm text-brand-600 font-semibold">Full Wallet →</Link>
                </div>
                {/* Balance */}
                <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 text-white mb-4">
                  <p className="text-white/70 text-sm">Available Balance</p>
                  <p className="text-3xl font-black mt-1">₦87,500</p>
                  <p className="text-white/50 text-xs mt-1">Updated just now</p>
                </div>
                {/* Quick withdraw */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Link href="/wallet" className="flex flex-col items-center gap-1.5 bg-green-50 rounded-2xl p-4 hover:bg-green-100 transition-colors">
                    <span className="text-2xl">💸</span>
                    <span className="text-xs font-bold text-green-800">Withdraw</span>
                  </Link>
                  <Link href="/wallet#history" className="flex flex-col items-center gap-1.5 bg-blue-50 rounded-2xl p-4 hover:bg-blue-100 transition-colors">
                    <span className="text-2xl">📋</span>
                    <span className="text-xs font-bold text-blue-800">History</span>
                  </Link>
                </div>
                {/* Recent transactions */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Recent</p>
                  {[
                    { label: 'Produce sale — White Maize', amount: '+₦45,000', date: 'Today', color: 'text-green-600' },
                    { label: 'Withdrawal to GTBank', amount: '-₦30,000', date: 'Yesterday', color: 'text-red-500' },
                    { label: 'Produce sale — Paddy Rice', amount: '+₦28,000', date: '2 days ago', color: 'text-green-600' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-ink">{t.label}</p>
                        <p className="text-xs text-gray-400">{t.date}</p>
                      </div>
                      <span className={`font-black text-sm ${t.color}`}>{t.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LISTINGS */}
          {tab === 'listings' && (
            <div className="space-y-4">
              {postSuccess && <div className="bg-brand-50 border border-brand-200 text-brand-700 rounded-xl px-4 py-3 text-sm">✅ Listing posted successfully!</div>}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-100">{['Crop', 'Qty', 'Price', 'Status', 'Date'].map(h => <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">{h}</th>)}</tr></thead>
                  <tbody>
                    {listings.map(l => (
                      <tr key={l.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3 font-semibold text-ink text-sm">{l.cropType}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">{l.quantity} {l.unit}s</td>
                        <td className="px-5 py-3 text-sm font-bold text-ink">₦{l.pricePerUnit.toLocaleString()}</td>
                        <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${l.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{l.status}</span></td>
                        <td className="px-5 py-3 text-xs text-gray-400">{new Date(l.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* POST LISTING */}
          {tab === 'post' && (
            <div className="max-w-2xl">
              <form onSubmit={handlePost} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="font-black text-ink text-xl">Post a New Harvest Listing</h2>
                {postError && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{postError}</div>}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Crop / Produce Name *</label>
                    <input value={form.cropType} onChange={e => setForm(f => ({ ...f, cropType: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. White Maize, Roma Tomatoes, Yam Tubers" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Quantity *</label>
                    <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. 500" required min={1} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Unit *</label>
                    <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                      {['bag', 'kg', 'tonne', 'crate', 'tuber', 'drum', 'jerry', 'bundle', 'piece'].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Price per Unit (₦) *</label>
                    <input type="number" value={form.pricePerUnit} onChange={e => setForm(f => ({ ...f, pricePerUnit: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. 55000" required min={1} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Quality Grade</label>
                    <select value={form.quality} onChange={e => setForm(f => ({ ...f, quality: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                      {['Grade A', 'Grade B', 'Grade C', 'Organic', 'Premium'].map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">State</label>
                    <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder={user.state || 'e.g. Kaduna'} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Town / LGA</label>
                    <input value={form.town} onChange={e => setForm(f => ({ ...f, town: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Zaria" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Describe your produce: moisture content, packaging, harvest date, storage condition..." />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="submit" disabled={posting} className="flex-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {posting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🌾 Post Listing'}
                  </button>
                  <button type="button" onClick={() => setTab('listings')} className="px-6 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold rounded-xl transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <p className="text-4xl mb-3">📦</p>
              <p className="font-bold text-ink text-lg mb-2">Orders from buyers</p>
              <p className="text-gray-400 text-sm">When buyers purchase your listings, their orders appear here.</p>
            </div>
          )}

          {/* PROFILE */}
          {tab === 'profile' && (
            <div className="max-w-lg bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-black text-ink text-xl">My Profile</h2>
              <div className="flex items-center gap-4 p-4 bg-brand-50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-brand-700 flex items-center justify-center text-white font-black text-xl">{(user.fullName || 'F').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                <div>
                  <p className="font-black text-ink">{user.fullName || 'Farmer'}</p>
                  <p className="text-gray-500 text-sm">{user.phoneNumber} · {user.state}</p>
                  <p className="text-brand-600 text-xs font-semibold mt-0.5">Verified Farmer ✅</p>
                </div>
              </div>
              {user.farmName && <div><p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Farm Name</p><p className="text-ink font-medium">{user.farmName}</p></div>}
              <Link href="/auth" className="block w-full text-center border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-xl transition-colors text-sm">Edit Profile</Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
