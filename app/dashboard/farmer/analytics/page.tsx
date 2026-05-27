'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { useAuth } from '../../../../contexts/AuthContext';

const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
const REVENUE = [142000, 198000, 175000, 234000, 189000, 312000];
const ORDERS = [8, 12, 10, 15, 11, 19];
const MAX_REV = Math.max(...REVENUE);

const TOP_PRODUCTS = [
  { name: 'Roma Tomatoes', qty: '240 crates', revenue: 2880000, growth: 18, trend: '↑' },
  { name: 'White Maize', qty: '85 bags (50kg)', revenue: 4675000, growth: 12, trend: '↑' },
  { name: 'Red Onions', qty: '60 bags', revenue: 1440000, growth: -5, trend: '↓' },
  { name: 'Cassava Tubers', qty: '120 kg bags', revenue: 960000, growth: 31, trend: '↑' },
  { name: 'Bell Peppers', qty: '40 baskets', revenue: 680000, growth: 8, trend: '↑' },
];

const STATES_DATA = [
  { state: 'Lagos', orders: 32, revenue: 4280000 },
  { state: 'Abuja (FCT)', orders: 24, revenue: 3120000 },
  { state: 'Kano', orders: 18, revenue: 1980000 },
  { state: 'Ibadan', orders: 12, revenue: 1440000 },
  { state: 'Port Harcourt', orders: 8, revenue: 960000 },
  { state: 'Enugu', orders: 6, revenue: 720000 },
];
const MAX_ORDERS = Math.max(...STATES_DATA.map(s => s.orders));

const BUYERS = [
  { name: 'Freshlane Supermarket', location: 'Lagos', totalOrders: 14, totalSpent: 3840000, lastOrder: '2026-05-24', type: 'Retailer' },
  { name: 'Adaeze Nwosu', location: 'Abuja', totalOrders: 9, totalSpent: 1620000, lastOrder: '2026-05-22', type: 'Buyer' },
  { name: 'GoFresh Logistics', location: 'Lagos', totalOrders: 7, totalSpent: 1260000, lastOrder: '2026-05-20', type: 'Wholesaler' },
  { name: 'Kano Foodstuff Market', location: 'Kano', totalOrders: 6, totalSpent: 840000, lastOrder: '2026-05-18', type: 'Wholesaler' },
  { name: 'Emeka Catering Ltd', location: 'Enugu', totalOrders: 5, totalSpent: 720000, lastOrder: '2026-05-15', type: 'Restaurant' },
];

const PERIOD_OPTIONS = ['Last 6 Months', 'Last 3 Months', 'This Year', 'Last Year'];

export default function FarmerAnalyticsPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('Last 6 Months');
  const [activeTab, setActiveTab] = useState<'revenue' | 'orders'>('revenue');

  const totalRevenue = REVENUE.reduce((a, b) => a + b, 0);
  const totalOrders = ORDERS.reduce((a, b) => a + b, 0);
  const avgOrderValue = Math.round(totalRevenue / totalOrders);
  const growthPct = Math.round(((REVENUE[5] - REVENUE[4]) / REVENUE[4]) * 100);

  const chartData = activeTab === 'revenue' ? REVENUE : ORDERS;
  const maxChart = Math.max(...chartData);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-5xl">

          {/* Header */}
          <div className="flex items-center justify-between pt-4 mb-6 flex-wrap gap-3">
            <div>
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-brand-600">← Dashboard</Link>
              <h1 className="text-2xl font-black text-gray-900 mt-1">Farm Analytics</h1>
              <p className="text-gray-500 text-sm">Track your revenue, orders, and top buyers</p>
            </div>
            <select value={period} onChange={e => setPeriod(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white outline-none focus:ring-2 focus:ring-brand-400">
              {PERIOD_OPTIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Revenue', value: `₦${(totalRevenue / 1000000).toFixed(1)}M`, sub: `${growthPct > 0 ? '+' : ''}${growthPct}% vs last month`, color: 'text-brand-600' },
              { label: 'Total Orders', value: totalOrders.toString(), sub: `${ORDERS[5]} this month`, color: 'text-blue-600' },
              { label: 'Avg Order Value', value: `₦${avgOrderValue.toLocaleString()}`, sub: 'Per transaction', color: 'text-amber-600' },
              { label: 'Active Buyers', value: '5', sub: '2 new this month', color: 'text-green-600' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-4">
                <p className="text-xs text-gray-400 font-medium mb-1">{kpi.label}</p>
                <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-gray-900">Performance Over Time</h2>
              <div className="flex bg-gray-100 rounded-xl p-1">
                {(['revenue', 'orders'] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${activeTab === tab ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}>
                    {tab === 'revenue' ? 'Revenue' : 'Orders'}
                  </button>
                ))}
              </div>
            </div>

            {/* SVG Bar Chart */}
            <div className="flex items-end gap-3 h-48 mb-3">
              {chartData.map((val, i) => {
                const height = Math.max((val / maxChart) * 180, 8);
                const isLast = i === chartData.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-500 font-semibold">
                      {activeTab === 'revenue' ? `₦${(val / 1000).toFixed(0)}k` : val}
                    </span>
                    <div
                      className={`w-full rounded-t-xl transition-all ${isLast ? 'bg-brand-600' : 'bg-brand-200'}`}
                      style={{ height: `${height}px` }}
                    />
                    <span className="text-[10px] text-gray-400">{MONTHS[i]}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-600 inline-block" /> Current month</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-brand-200 inline-block" /> Previous months</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Top products */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
              <h2 className="font-black text-gray-900 mb-4">Top Products</h2>
              <div className="space-y-3">
                {TOP_PRODUCTS.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-brand-100 text-brand-700 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0">{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
                        <span className={`text-xs font-bold ${p.growth > 0 ? 'text-green-600' : 'text-red-500'}`}>{p.trend}{Math.abs(p.growth)}%</span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-gray-400">{p.qty}</span>
                        <span className="text-xs font-bold text-gray-700">₦{(p.revenue / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full mt-1.5">
                        <div className="h-1.5 bg-brand-400 rounded-full" style={{ width: `${(p.revenue / TOP_PRODUCTS[0].revenue) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders by state */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
              <h2 className="font-black text-gray-900 mb-4">Orders by State</h2>
              <div className="space-y-3">
                {STATES_DATA.map(s => (
                  <div key={s.state}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">{s.state}</span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-700">{s.orders} orders</span>
                        <span className="text-xs text-gray-400 ml-2">₦{(s.revenue / 1000).toFixed(0)}k</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div className="h-2 bg-gradient-to-r from-brand-500 to-emerald-400 rounded-full transition-all" style={{ width: `${(s.orders / MAX_ORDERS) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top buyers */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-black text-gray-900">Top Buyers</h2>
              <span className="text-xs text-gray-400 font-medium">By total spend</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Buyer', 'Type', 'Location', 'Orders', 'Total Spent', 'Last Order'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {BUYERS.map((b, i) => (
                    <tr key={b.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 font-black text-xs flex-shrink-0">{b.name.charAt(0)}</div>
                          <span className="font-semibold text-gray-900 text-sm">{b.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">{b.type}</span></td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{b.location}</td>
                      <td className="px-4 py-3.5 text-sm font-bold text-gray-900">{b.totalOrders}</td>
                      <td className="px-4 py-3.5 text-sm font-black text-brand-700">₦{(b.totalSpent / 1000000).toFixed(2)}M</td>
                      <td className="px-4 py-3.5 text-xs text-gray-400">{b.lastOrder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue breakdown */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
            <h2 className="font-black text-gray-900 mb-4">Revenue Breakdown</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: 'Gross Revenue', value: `₦${(totalRevenue / 1000000).toFixed(2)}M`, icon: '💰', color: 'bg-green-50 text-green-700', desc: 'Before fees' },
                { label: 'Platform Fee (2%)', value: `-₦${((totalRevenue * 0.02) / 1000).toFixed(0)}k`, icon: '🏦', color: 'bg-blue-50 text-blue-700', desc: 'Escrow + payment' },
                { label: 'Net Earnings', value: `₦${((totalRevenue * 0.93) / 1000000).toFixed(2)}M`, icon: '🎯', color: 'bg-brand-50 text-brand-700', desc: 'After all fees (93%)' },
              ].map(item => (
                <div key={item.label} className={`${item.color} rounded-2xl p-4`}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <p className="text-xs font-bold opacity-70 mb-0.5">{item.label}</p>
                  <p className="text-xl font-black">{item.value}</p>
                  <p className="text-xs opacity-60 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
              <span className="font-bold">Logistics fee (5%)</span> is included in the buyer's price and does not reduce your payout. You receive 93% of all sale prices.
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
