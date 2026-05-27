'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const COMMODITIES = [
  { id: 1, name: 'Tomatoes (1kg)', category: 'Vegetables', icon: '🍅', unit: '1kg', state: { Lagos: 1200, Kano: 800, Abuja: 1100, Rivers: 1300, Ogun: 1000 }, trend: 'up', change: 8.3, season: 'Peak: Nov–Feb' },
  { id: 2, name: 'Maize (1 bag)', category: 'Grains', icon: '🌽', unit: '100kg bag', state: { Lagos: 28000, Kano: 22000, Abuja: 25000, Rivers: 30000, Ogun: 26000 }, trend: 'down', change: -3.2, season: 'Peak: Jul–Sep' },
  { id: 3, name: 'Rice (1 bag)', category: 'Grains', icon: '🍚', unit: '50kg bag', state: { Lagos: 45000, Kano: 38000, Abuja: 42000, Rivers: 47000, Ogun: 43000 }, trend: 'up', change: 5.1, season: 'Peak: Nov–Dec' },
  { id: 4, name: 'Yam (1 tuber)', category: 'Tubers', icon: '🥔', unit: 'per tuber', state: { Lagos: 2500, Kano: 1800, Abuja: 2200, Rivers: 2800, Ogun: 2000 }, trend: 'stable', change: 0.5, season: 'Peak: May–Aug' },
  { id: 5, name: 'Garri (1 bag)', category: 'Processed', icon: '🫘', unit: '50kg bag', state: { Lagos: 18000, Kano: 15000, Abuja: 17000, Rivers: 19000, Ogun: 16000 }, trend: 'up', change: 4.7, season: 'Year-round' },
  { id: 6, name: 'Palm Oil (25L)', category: 'Oils', icon: '🫙', unit: '25 litres', state: { Lagos: 32000, Kano: 28000, Abuja: 30000, Rivers: 29000, Ogun: 31000 }, trend: 'down', change: -2.1, season: 'Peak: Mar–Jun' },
  { id: 7, name: 'Catfish (1kg)', category: 'Livestock', icon: '🐟', unit: '1kg live', state: { Lagos: 2800, Kano: 2200, Abuja: 2600, Rivers: 2400, Ogun: 2700 }, trend: 'up', change: 6.4, season: 'Year-round' },
  { id: 8, name: 'Chicken Eggs (crate)', category: 'Livestock', icon: '🥚', unit: '30 eggs', state: { Lagos: 4200, Kano: 3600, Abuja: 4000, Rivers: 4400, Ogun: 3900 }, trend: 'stable', change: 1.2, season: 'Year-round' },
  { id: 9, name: 'Pepper (1kg)', category: 'Vegetables', icon: '🫑', unit: '1kg', state: { Lagos: 2500, Kano: 1800, Abuja: 2200, Rivers: 2800, Ogun: 2000 }, trend: 'up', change: 12.5, season: 'Peak: Dec–Mar' },
  { id: 10, name: 'Groundnuts (1 bag)', category: 'Legumes', icon: '🥜', unit: '100kg bag', state: { Lagos: 62000, Kano: 45000, Abuja: 58000, Rivers: 65000, Ogun: 60000 }, trend: 'down', change: -1.8, season: 'Peak: Sep–Nov' },
  { id: 11, name: 'Cassava (1 bag)', category: 'Tubers', icon: '🌿', unit: '100kg bag', state: { Lagos: 12000, Kano: 9000, Abuja: 11000, Rivers: 13000, Ogun: 10000 }, trend: 'stable', change: 0.8, season: 'Year-round' },
  { id: 12, name: 'Broiler Chicken (kg)', category: 'Livestock', icon: '🐔', unit: '1kg dressed', state: { Lagos: 3500, Kano: 2800, Abuja: 3200, Rivers: 3700, Ogun: 3300 }, trend: 'up', change: 7.2, season: 'Year-round' },
  { id: 13, name: 'Onion (1 bag)', category: 'Vegetables', icon: '🧅', unit: '50kg bag', state: { Lagos: 22000, Kano: 14000, Abuja: 18000, Rivers: 24000, Ogun: 20000 }, trend: 'down', change: -5.3, season: 'Peak: Feb–May' },
  { id: 14, name: 'Beans (1 bag)', category: 'Legumes', icon: '🫛', unit: '100kg bag', state: { Lagos: 70000, Kano: 55000, Abuja: 65000, Rivers: 72000, Ogun: 68000 }, trend: 'up', change: 9.1, season: 'Peak: Oct–Jan' },
  { id: 15, name: 'Cocoa (1 bag)', category: 'Cash Crops', icon: '🍫', unit: '64kg bag', state: { Lagos: 290000, Kano: 260000, Abuja: 280000, Rivers: 300000, Ogun: 285000 }, trend: 'up', change: 15.2, season: 'Peak: Sep–Dec' },
  { id: 16, name: 'Soya Beans (bag)', category: 'Legumes', icon: '🌱', unit: '100kg bag', state: { Lagos: 75000, Kano: 58000, Abuja: 70000, Rivers: 78000, Ogun: 72000 }, trend: 'up', change: 11.4, season: 'Peak: Nov–Feb' },
];

const CATEGORIES = ['All', 'Grains', 'Vegetables', 'Tubers', 'Livestock', 'Legumes', 'Processed', 'Oils', 'Cash Crops'];
const STATES = ['Lagos', 'Kano', 'Abuja', 'Rivers', 'Ogun'];
const LAST_UPDATED = 'Today, 8:30 AM';

export default function MarketPricesPage() {
  const [selectedState, setSelectedState] = useState('Lagos');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [alertCommodity, setAlertCommodity] = useState('');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertDirection, setAlertDirection] = useState<'above' | 'below'>('below');
  const [alertSet, setAlertSet] = useState(false);

  const setAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertCommodity || !alertPrice) return;
    setAlertSet(true);
    setTimeout(() => setAlertSet(false), 3000);
    setAlertCommodity('');
    setAlertPrice('');
  };

  const filtered = COMMODITIES
    .filter(c => selectedCategory === 'All' || c.category === selectedCategory)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price') return b.state[selectedState as keyof typeof b.state] - a.state[selectedState as keyof typeof a.state];
      if (sortBy === 'change') return Math.abs(b.change) - Math.abs(a.change);
      return a.name.localeCompare(b.name);
    });

  const topMovers = [...COMMODITIES].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-900 via-indigo-800 to-violet-700 pt-24 pb-16 text-white">
          <div className="container-tight text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-6">
              📊 Live Market Prices
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Nigeria Agricultural<br />
              <span className="text-blue-300">Market Prices</span>
            </h1>
            <p className="text-white/75 max-w-lg mx-auto mb-3">
              Real-time commodity prices across major Nigerian markets. Buy and sell at the right price.
            </p>
            <p className="text-xs text-white/50">Last updated: {LAST_UPDATED} · Sources: State Ministry of Agriculture + Field Reports</p>
          </div>
        </section>

        {/* Live ticker */}
        <div className="bg-blue-900 text-white py-2 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...COMMODITIES, ...COMMODITIES].map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1 mr-8 text-sm">
                <span>{c.icon}</span>
                <span className="font-semibold">{c.name}</span>
                <span className="text-white/60 mx-1">Lagos</span>
                <span>₦{c.state.Lagos.toLocaleString()}</span>
                <span className={`ml-1 text-xs font-bold ${c.trend === 'up' ? 'text-green-400' : c.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                  {c.trend === 'up' ? '▲' : c.trend === 'down' ? '▼' : '–'}{Math.abs(c.change)}%
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Top movers */}
        <section className="container-tight py-8">
          <h2 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wide">Top Price Movers Today</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {topMovers.map(c => (
              <div key={c.id} className={`rounded-2xl p-4 ${c.trend === 'up' ? 'bg-green-50 border border-green-100' : c.trend === 'down' ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'}`}>
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="font-bold text-ink text-sm leading-snug mb-1">{c.name}</div>
                <div className="text-lg font-black text-ink">₦{c.state[selectedState as keyof typeof c.state].toLocaleString()}</div>
                <div className={`text-sm font-bold mt-1 ${c.trend === 'up' ? 'text-green-600' : c.trend === 'down' ? 'text-red-600' : 'text-gray-500'}`}>
                  {c.trend === 'up' ? '▲' : c.trend === 'down' ? '▼' : '–'} {Math.abs(c.change)}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="container-tight py-3">
            <div className="flex flex-wrap gap-3 items-center">
              {/* State select */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                {STATES.map(s => (
                  <button key={s} onClick={() => setSelectedState(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedState === s ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
                    {s}
                  </button>
                ))}
              </div>

              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search commodity..."
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm flex-1 min-w-[160px]" />

              <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white">
                <option value="name">Sort: Name</option>
                <option value="price">Sort: Highest Price</option>
                <option value="change">Sort: Biggest Move</option>
              </select>
            </div>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto scrollbar-none mt-3 pb-1">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Price table */}
        <section className="container-tight py-8">
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Commodity</th>
                    <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">{selectedState} Price</th>
                    <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Change</th>
                    <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Low (Kano)</th>
                    <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">High (Rivers)</th>
                    <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Season</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(c => {
                    const price = c.state[selectedState as keyof typeof c.state];
                    const low = Math.min(...Object.values(c.state));
                    const high = Math.max(...Object.values(c.state));
                    return (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.icon}</span>
                            <div>
                              <div className="font-bold text-ink text-sm">{c.name}</div>
                              <div className="text-xs text-gray-400">{c.unit} · {c.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-black text-ink">₦{price.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                            c.trend === 'up' ? 'bg-green-50 text-green-700' :
                            c.trend === 'down' ? 'bg-red-50 text-red-700' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {c.trend === 'up' ? '▲' : c.trend === 'down' ? '▼' : '–'} {Math.abs(c.change)}%
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right text-sm text-gray-500 hidden md:table-cell">₦{low.toLocaleString()}</td>
                        <td className="px-4 py-4 text-right text-sm text-gray-500 hidden md:table-cell">₦{high.toLocaleString()}</td>
                        <td className="px-4 py-4 hidden lg:table-cell">
                          <span className="text-xs text-gray-500">{c.season}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📊</div>
              <p className="text-gray-500">No commodities match your search</p>
            </div>
          )}
        </section>

        {/* State comparison */}
        <section className="container-tight pb-12">
          <h2 className="text-xl font-black text-ink mb-6">Price Comparison Across States</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {COMMODITIES.slice(0, 6).map(c => {
              const maxPrice = Math.max(...Object.values(c.state));
              return (
                <div key={c.id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="font-bold text-ink text-sm">{c.name}</div>
                      <div className="text-xs text-gray-400">{c.unit}</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(c.state).map(([state, price]) => (
                      <div key={state} className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 w-12">{state}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2">
                          <div className="bg-brand-500 h-2 rounded-full transition-all" style={{ width: `${(price / maxPrice) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold text-ink w-20 text-right">₦{price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Price Alert */}
        <section className="container-tight pb-12">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-6 text-white">
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-[220px]">
                <div className="text-2xl mb-2">🔔</div>
                <h2 className="text-xl font-black mb-1">Price Alerts</h2>
                <p className="text-white/70 text-sm">Get notified when a commodity hits your target price</p>
              </div>
              {alertSet ? (
                <div className="flex-1 flex items-center justify-center bg-white/20 rounded-2xl p-6 text-center">
                  <div>
                    <div className="text-3xl mb-2">✅</div>
                    <p className="font-black">Alert set!</p>
                    <p className="text-white/70 text-sm">We'll notify you when the price is reached.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={setAlert} className="flex-1 min-w-[280px] space-y-3">
                  <select value={alertCommodity} onChange={e => setAlertCommodity(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 bg-white outline-none">
                    <option value="">Select commodity...</option>
                    {COMMODITIES.map(c => <option key={c.id} value={c.name}>{c.icon} {c.name}</option>)}
                  </select>
                  <div className="flex gap-2">
                    <select value={alertDirection} onChange={e => setAlertDirection(e.target.value as 'above' | 'below')}
                      className="rounded-xl px-3 py-3 text-sm text-gray-900 bg-white outline-none flex-shrink-0">
                      <option value="below">Drops below</option>
                      <option value="above">Rises above</option>
                    </select>
                    <input value={alertPrice} onChange={e => setAlertPrice(e.target.value)} type="number" placeholder="₦ Target price"
                      className="flex-1 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white outline-none" />
                  </div>
                  <button type="submit" disabled={!alertCommodity || !alertPrice}
                    className="w-full bg-white text-indigo-700 font-black py-3 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-50">
                    Set Alert
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border-t border-yellow-100 py-4">
          <div className="container-tight text-center text-xs text-yellow-700">
            ⚠️ Prices are indicative and sourced from market reporters across states. Actual prices may vary. Last updated: {LAST_UPDATED}
          </div>
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
