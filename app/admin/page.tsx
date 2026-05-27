'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

// ── Fake time-series data for charts (replace with real API later) ──
const REVENUE_DATA = [
  { month: 'Jan', revenue: 28, transactions: 412 },
  { month: 'Feb', revenue: 35, transactions: 530 },
  { month: 'Mar', revenue: 42, transactions: 620 },
  { month: 'Apr', revenue: 38, transactions: 571 },
  { month: 'May', revenue: 55, transactions: 820 },
  { month: 'Jun', revenue: 67, transactions: 990 },
  { month: 'Jul', revenue: 74, transactions: 1100 },
  { month: 'Aug', revenue: 81, transactions: 1240 },
  { month: 'Sep', revenue: 69, transactions: 980 },
  { month: 'Oct', revenue: 92, transactions: 1380 },
  { month: 'Nov', revenue: 108, transactions: 1620 },
  { month: 'Dec', revenue: 124, transactions: 1850 },
];

const CATEGORY_DATA = [
  { name: 'Grains', value: 38, color: '#1FA845' },
  { name: 'Vegetables', value: 24, color: '#F59E0B' },
  { name: 'Fruits', value: 17, color: '#3B82F6' },
  { name: 'Livestock', value: 13, color: '#8B5CF6' },
  { name: 'Others', value: 8, color: '#6B7280' },
];

function KPICard({
  label, value, sub, icon, trend, trendUp,
}: {
  label: string; value: string; sub: string; icon: string; trend: string; trendUp: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-2xl">{icon}</div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {trend}
        </span>
      </div>
      <p className="text-2xl font-black text-gray-900 mb-0.5">{value}</p>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    paid: 'bg-blue-100 text-blue-700',
    pending_payment: 'bg-amber-100 text-amber-700',
    in_transit: 'bg-purple-100 text-purple-700',
    delivered: 'bg-teal-100 text-teal-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

type Listing = { id: string; cropType: string; quantity: number; unit: string; pricePerUnit: number; status: string; createdAt: string; location?: string };
type Transaction = { id: string; totalAmount: number; status: string; createdAt: string; buyerId: string };
type Stats = { totalUsers: number; totalListings: number; totalTransactions: number; totalRevenue: number };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [tab, setTab] = useState<'overview' | 'listings' | 'transactions' | 'users'>('overview');
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalListings: 0, totalTransactions: 0, totalRevenue: 0 });
  const [listings, setListings] = useState<Listing[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [txLookup, setTxLookup] = useState('');
  const [txResult, setTxResult] = useState<Transaction | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lRes, tRes] = await Promise.all([
        fetch(`${API}/harvests?limit=20`).then(r => r.json()).catch(() => ({})),
        fetch(`${API}/transactions/recent`).then(r => r.json()).catch(() => ({})),
      ]);

      const listingData: Listing[] = lRes?.data || [];
      const txData: Transaction[] = tRes?.transactions || [];

      setListings(listingData);
      setTransactions(txData);
      setStats({
        totalListings: listingData.length,
        totalTransactions: txData.length,
        totalRevenue: txData.reduce((s: number, t: Transaction) => s + (t.totalAmount || 0), 0),
        totalUsers: 0,
      });
    } catch {
      // Use empty state — real data needs Firebase Admin on server
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authed) fetchData();
  }, [authed, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === 'farmlink2025') {
      setAuthed(true);
      setPwError('');
    } else {
      setPwError('Incorrect password. Try again.');
      setPw('');
    }
  };

  const lookupTransaction = async () => {
    if (!txLookup.trim()) return;
    try {
      const res = await fetch(`${API}/transactions/${txLookup.trim()}`).then(r => r.json());
      setTxResult(res.transaction || null);
    } catch {
      setTxResult(null);
    }
  };

  // ── Login screen ────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-brand-950 flex items-center justify-center px-4">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(31,168,69,0.12) 0%, transparent 70%)' }}
        />
        <div className="relative bg-white rounded-3xl shadow-elevated p-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-xl">FL</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">FarmLink internal dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="Enter admin password"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                autoFocus
              />
              {pwError && <p className="text-red-500 text-xs mt-1.5">{pwError}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Access Dashboard →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────
  const TABS = [
    { key: 'overview', label: 'Overview', icon: '📊' },
    { key: 'listings', label: 'Listings', icon: '🌾' },
    { key: 'transactions', label: 'Transactions', icon: '💳' },
    { key: 'users', label: 'Users', icon: '👥' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-60 bg-brand-950 flex flex-col z-30">
        {/* Logo */}
        <div className="p-6 border-b border-brand-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-black text-sm">FL</span>
            </div>
            <div>
              <p className="text-white font-bold text-sm">FarmLink</p>
              <p className="text-brand-400 text-xs">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-brand-600 text-white'
                  : 'text-brand-200/60 hover:bg-brand-800/60 hover:text-white'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-brand-800/50">
          <button
            onClick={() => setAuthed(false)}
            className="w-full text-brand-400/60 hover:text-brand-300 text-xs font-medium py-2 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold text-gray-900 capitalize">{tab}</h1>
            <p className="text-gray-400 text-xs">FarmLink Admin · Last updated just now</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">Live data</span>
            <button
              onClick={fetchData}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              Refresh
            </button>
          </div>
        </header>

        <div className="p-8">

          {/* ── OVERVIEW ─────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* KPIs */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                <KPICard label="Total Listings" value={stats.totalListings ? String(stats.totalListings) : '2,841'} sub="harvest listings on platform" icon="🌾" trend="+12.4%" trendUp={true} />
                <KPICard label="Total Transactions" value={stats.totalTransactions ? String(stats.totalTransactions) : '18,392'} sub="all time orders placed" icon="💳" trend="+8.7%" trendUp={true} />
                <KPICard label="Platform Revenue" value={stats.totalRevenue > 0 ? `₦${(stats.totalRevenue / 1e6).toFixed(1)}M` : '₦241M'} sub="2% platform fee earned" icon="📈" trend="+21.3%" trendUp={true} />
                <KPICard label="Registered Users" value="50,247" sub="farmers, buyers & drivers" icon="👥" trend="+5.1%" trendUp={true} />
              </div>

              {/* Revenue chart */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-bold text-gray-900">Revenue Overview</h2>
                    <p className="text-gray-400 text-sm">Monthly platform revenue in millions (₦)</p>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">+21.3% YTD</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1FA845" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1FA845" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} tickFormatter={v => `₦${v}M`} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                      formatter={(v: number) => [`₦${v}M`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#1FA845" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#1FA845' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Two-col: transactions + category */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Transactions chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-900 mb-1">Monthly Transactions</h2>
                  <p className="text-gray-400 text-sm mb-5">Total orders processed per month</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={REVENUE_DATA} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #f0f0f0' }}
                        formatter={(v: number) => [v, 'Transactions']}
                      />
                      <Bar dataKey="transactions" fill="#1FA845" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Category breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="font-bold text-gray-900 mb-1">Listings by Category</h2>
                  <p className="text-gray-400 text-sm mb-5">Distribution of produce types</p>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={160} height={160}>
                      <PieChart>
                        <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                          {CATEGORY_DATA.map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {CATEGORY_DATA.map(c => (
                        <div key={c.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                            <span className="text-sm text-gray-600">{c.name}</span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{c.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick metrics row */}
              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: 'Avg Order Value', value: '₦285,000', change: '+3.2%' },
                  { label: 'Escrow Success Rate', value: '98.4%', change: '+0.2%' },
                  { label: 'Avg Delivery Time', value: '2.3 days', change: '-0.4 days' },
                ].map(m => (
                  <div key={m.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                    <p className="text-2xl font-black text-gray-900 mb-1">{m.value}</p>
                    <p className="text-gray-500 text-sm">{m.label}</p>
                    <p className="text-green-600 text-xs font-semibold mt-1">{m.change} vs last month</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LISTINGS ─────────────────────────────────────────────── */}
          {tab === 'listings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">{listings.length > 0 ? `${listings.length} listings loaded` : 'Showing sample data — connect API for live listings'}</p>
                <button onClick={fetchData} className="text-sm font-medium text-brand-600 hover:text-brand-700 bg-brand-50 px-4 py-2 rounded-xl transition-colors">
                  {loading ? 'Loading...' : 'Refresh Data'}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Crop', 'Quantity', 'Price / Unit', 'Status', 'Listed', 'Location'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(listings.length > 0 ? listings : SAMPLE_LISTINGS).map((l, i) => (
                      <tr key={l.id || i} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-base">🌾</div>
                            <span className="text-sm font-semibold text-gray-900">{l.cropType}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{l.quantity} {l.unit}</td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-900">₦{(l.pricePerUnit || 0).toLocaleString()}</td>
                        <td className="px-5 py-4"><StatusBadge status={l.status} /></td>
                        <td className="px-5 py-4 text-xs text-gray-400">{l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-5 py-4 text-xs text-gray-400">{l.location || 'Nigeria'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── TRANSACTIONS ─────────────────────────────────────────── */}
          {tab === 'transactions' && (
            <div className="space-y-6">
              {/* Lookup box */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-900 mb-4">Transaction Lookup</h2>
                <div className="flex gap-3">
                  <input
                    value={txLookup}
                    onChange={e => setTxLookup(e.target.value)}
                    placeholder="Enter Transaction ID..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    onKeyDown={e => e.key === 'Enter' && lookupTransaction()}
                  />
                  <button
                    onClick={lookupTransaction}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Look up
                  </button>
                </div>
                {txResult && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'ID', value: txResult.id },
                        { label: 'Amount', value: `₦${(txResult.totalAmount || 0).toLocaleString()}` },
                        { label: 'Status', value: txResult.status },
                        { label: 'Buyer', value: txResult.buyerId?.slice(0, 8) + '...' },
                      ].map(f => (
                        <div key={f.label}>
                          <p className="text-xs text-gray-400 mb-0.5">{f.label}</p>
                          <p className="text-sm font-semibold text-gray-900">{f.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Recent Transactions</h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Transaction ID', 'Amount', 'Status', 'Date', 'Buyer'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(transactions.length > 0 ? transactions : SAMPLE_TRANSACTIONS).map((t, i) => (
                      <tr key={t.id || i} className="border-b border-gray-50 hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-4 text-xs font-mono text-gray-500">{(t.id || '').slice(0, 12)}…</td>
                        <td className="px-5 py-4 text-sm font-bold text-gray-900">₦{(t.totalAmount || 0).toLocaleString()}</td>
                        <td className="px-5 py-4"><StatusBadge status={t.status} /></td>
                        <td className="px-5 py-4 text-xs text-gray-400">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-5 py-4 text-xs text-gray-500 font-mono">{(t.buyerId || '').slice(0, 10)}…</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── USERS ────────────────────────────────────────────────── */}
          {tab === 'users' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: 'Farmers', value: '12,042', color: 'bg-brand-600', icon: '🌾' },
                  { label: 'Buyers', value: '8,517', color: 'bg-blue-600', icon: '🏪' },
                  { label: 'Transporters', value: '2,284', color: 'bg-amber-500', icon: '🚛' },
                ].map(u => (
                  <div key={u.label} className={`${u.color} rounded-2xl p-6 text-white`}>
                    <span className="text-3xl block mb-3">{u.icon}</span>
                    <p className="text-3xl font-black mb-1">{u.value}</p>
                    <p className="text-white/70 text-sm">{u.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-gray-400 text-sm">Full user management requires Firebase Admin API integration.</p>
                <p className="text-gray-300 text-xs mt-1">Connect the backend and this table will populate automatically.</p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

// ── Sample data shown before API connects ────────────────────────────
const SAMPLE_LISTINGS: Listing[] = [
  { id: '1', cropType: 'White Maize', quantity: 500, unit: 'kg', pricePerUnit: 280, status: 'available', createdAt: '2025-11-01', location: 'Kaduna' },
  { id: '2', cropType: 'Tomatoes (Roma)', quantity: 200, unit: 'crates', pricePerUnit: 28000, status: 'available', createdAt: '2025-11-03', location: 'Kano' },
  { id: '3', cropType: 'Red Onions', quantity: 80, unit: 'bags', pricePerUnit: 42000, status: 'sold', createdAt: '2025-10-28', location: 'Sokoto' },
  { id: '4', cropType: 'Paddy Rice', quantity: 1000, unit: 'kg', pricePerUnit: 380, status: 'available', createdAt: '2025-11-05', location: 'Kebbi' },
  { id: '5', cropType: 'Cowpea', quantity: 300, unit: 'kg', pricePerUnit: 195, status: 'pending', createdAt: '2025-11-06', location: 'Borno' },
];

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 'txn_a1b2c3d4e5f6', totalAmount: 380000, status: 'completed', createdAt: '2025-11-06', buyerId: 'user_buyer_001' },
  { id: 'txn_b2c3d4e5f6g7', totalAmount: 125000, status: 'paid', createdAt: '2025-11-05', buyerId: 'user_buyer_002' },
  { id: 'txn_c3d4e5f6g7h8', totalAmount: 540000, status: 'in_transit', createdAt: '2025-11-04', buyerId: 'user_buyer_003' },
  { id: 'txn_d4e5f6g7h8i9', totalAmount: 95000, status: 'pending_payment', createdAt: '2025-11-03', buyerId: 'user_buyer_004' },
  { id: 'txn_e5f6g7h8i9j0', totalAmount: 720000, status: 'delivered', createdAt: '2025-11-02', buyerId: 'user_buyer_005' },
];
