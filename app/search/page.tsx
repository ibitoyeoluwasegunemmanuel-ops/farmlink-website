'use client';
import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ALL_RESULTS = {
  produce: [
    { id: 'p1', title: 'Roma Tomatoes (crate)', price: '₦12,000/crate', location: 'Ogun State', farmer: 'Kola Fresh Farms', rating: 4.2, tags: ['tomato', 'vegetable', 'fresh'] },
    { id: 'p2', title: 'Cherry Tomatoes (kg)', price: '₦2,500/kg', location: 'Plateau State', farmer: 'Highland Farms', rating: 4.8, tags: ['tomato', 'cherry', 'fresh'] },
    { id: 'p3', title: 'Yellow Pepper (crate)', price: '₦9,500/crate', location: 'Kogi State', farmer: 'Okwori Agro', rating: 4.4, tags: ['pepper', 'vegetable'] },
    { id: 'p4', title: 'White Maize (100kg)', price: '₦28,000/bag', location: 'Kaduna', farmer: 'Emeka Farms', rating: 4.9, tags: ['maize', 'grain', 'corn'] },
    { id: 'p5', title: 'Catfish — Live (kg)', price: '₦2,800/kg', location: 'Delta State', farmer: 'Delta Aquafarm', rating: 4.9, tags: ['fish', 'catfish', 'livestock'] },
    { id: 'p6', title: 'Paddy Rice (50kg)', price: '₦38,000/bag', location: 'Kebbi', farmer: 'Kebbi Rice Co.', rating: 4.9, tags: ['rice', 'grain'] },
  ],
  transport: [
    { id: 't1', title: 'Lagos → Abuja Delivery', price: '₦85/km', vehicle: 'Toyota Hiace', driver: 'Musa Sule', rating: 4.9, tags: ['lagos', 'abuja', 'transport'] },
    { id: 't2', title: 'Ogun → Lagos (Produce)', price: '₦65/km', vehicle: 'Mitsubishi Canter', driver: 'Chukwu Emmanuel', rating: 4.7, tags: ['ogun', 'lagos', 'produce', 'tomato'] },
  ],
  equipment: [
    { id: 'eq1', title: 'John Deere Tractor (80HP)', price: '₦85,000/day', owner: 'Kola Adesanya', location: 'Ogun', rating: 4.9, tags: ['tractor', 'equipment'] },
    { id: 'eq2', title: 'Irrigation Pump Set', price: '₦18,000/day', owner: 'Taiwo Tech Farm', location: 'Oyo', rating: 4.6, tags: ['irrigation', 'pump', 'equipment'] },
  ],
  investments: [
    { id: 'inv1', title: 'Tomato Greenhouse (Plateau)', returns: '26% / 6 months', risk: 'Low', funded: 65, tags: ['tomato', 'greenhouse', 'investment'] },
  ],
  land: [
    { id: 'l1', title: 'Fertile Farmland — Benue Valley', price: '₦120,000/season', size: '5 Hectares', tags: ['land', 'benue', 'fertile'] },
  ],
  farmers: [
    { id: 'f3', name: 'Kola Fresh Farms', state: 'Ogun', specialty: 'Tomatoes & Peppers', rating: 4.2, orders: 670, tags: ['tomato', 'pepper', 'ogun'] },
    { id: 'f1', name: 'Emeka Okafor Farms', state: 'Kaduna', specialty: 'Maize & Grains', rating: 4.8, orders: 312, tags: ['maize', 'grain'] },
  ],
};

const POPULAR = ['Maize', 'Tomatoes', 'Catfish', 'Tractor', 'Lagos→Abuja', 'Rice', 'Cassava', 'Onion'];

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { addItem, hasItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [q, setQ] = useState(params.get('q') || '');
  const [input, setInput] = useState(params.get('q') || '');
  const [tab, setTab] = useState('all');

  const search = (query: string) => {
    setQ(query);
    setInput(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); search(input); };

  const qLow = q.toLowerCase();
  const match = (tags: string[]) => !q || tags.some(t => t.includes(qLow)) || qLow.split(' ').some(w => tags.some(t => t.includes(w)));

  const results = {
    produce: ALL_RESULTS.produce.filter(r => match(r.tags)),
    transport: ALL_RESULTS.transport.filter(r => match(r.tags)),
    equipment: ALL_RESULTS.equipment.filter(r => match(r.tags)),
    investments: ALL_RESULTS.investments.filter(r => match(r.tags)),
    land: ALL_RESULTS.land.filter(r => match(r.tags)),
    farmers: ALL_RESULTS.farmers.filter(r => match(r.tags)),
  };

  const total = Object.values(results).reduce((s, arr) => s + arr.length, 0);

  const tabs = [
    { key: 'all', label: 'All', count: total },
    { key: 'produce', label: 'Produce', count: results.produce.length },
    { key: 'transport', label: 'Transport', count: results.transport.length },
    { key: 'equipment', label: 'Equipment', count: results.equipment.length },
    { key: 'investments', label: 'Invest', count: results.investments.length },
    { key: 'land', label: 'Land', count: results.land.length },
    { key: 'farmers', label: 'Farmers', count: results.farmers.length },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-4xl">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6 mt-4">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Search produce, farmers, transport, equipment..."
                className="w-full pl-10 pr-4 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" autoFocus />
            </div>
            <button type="submit" className="bg-brand-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-brand-700 transition-colors">Search</button>
          </form>

          {/* Popular searches */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs text-gray-400 self-center">Popular:</span>
            {POPULAR.map(p => (
              <button key={p} onClick={() => search(p)}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-brand-400 hover:text-brand-600 transition-colors">
                {p}
              </button>
            ))}
          </div>

          {q && (
            <p className="text-sm text-gray-500 mb-5">
              {total > 0 ? <><span className="font-bold text-gray-900">{total} results</span> for "{q}"</> : <>No results for "{q}" — try a different search</>}
            </p>
          )}

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${tab === t.key ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-400'}`}>
                {t.label}
                {t.count > 0 && <span className={`text-xs font-black w-4 h-4 rounded-full flex items-center justify-center ${tab === t.key ? 'bg-white text-brand-600' : 'bg-gray-100 text-gray-600'}`}>{t.count}</span>}
              </button>
            ))}
          </div>

          {total === 0 && q && (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-black text-gray-800 text-xl mb-2">No results found</h3>
              <p className="text-gray-500 text-sm mb-6">Try searching for: Maize, Tomatoes, Tractor, Lagos</p>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR.map(p => <button key={p} onClick={() => search(p)} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-brand-50 hover:text-brand-600 transition-colors">{p}</button>)}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Produce */}
            {(tab === 'all' || tab === 'produce') && results.produce.length > 0 && (
              <div>
                {tab === 'all' && <div className="flex items-center justify-between mb-3"><h2 className="font-black text-gray-800">🌾 Produce</h2><Link href="/marketplace" className="text-sm text-brand-600 font-semibold">See all →</Link></div>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.produce.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🌾</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">PRODUCE</span>
                        <p className="font-bold text-gray-900 text-sm mt-1">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.farmer} · {r.location}</p>
                        <p className="text-brand-600 font-black text-sm mt-1">{r.price}</p>
                      </div>
                      <Link href={`/marketplace/${r.id}`} className="flex-shrink-0 bg-brand-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-brand-700 transition-colors">Buy</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Transport */}
            {(tab === 'all' || tab === 'transport') && results.transport.length > 0 && (
              <div>
                {tab === 'all' && <div className="flex items-center justify-between mb-3"><h2 className="font-black text-gray-800">🚛 Transport</h2><Link href="/transport" className="text-sm text-brand-600 font-semibold">See all →</Link></div>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.transport.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🚛</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">TRANSPORT</span>
                        <p className="font-bold text-gray-900 text-sm mt-1">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.driver} · {r.vehicle}</p>
                        <p className="text-brand-600 font-black text-sm mt-1">{r.price}</p>
                      </div>
                      <Link href="/transport" className="flex-shrink-0 bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors">Book</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipment */}
            {(tab === 'all' || tab === 'equipment') && results.equipment.length > 0 && (
              <div>
                {tab === 'all' && <div className="flex items-center justify-between mb-3"><h2 className="font-black text-gray-800">⚙️ Equipment</h2><Link href="/equipment" className="text-sm text-brand-600 font-semibold">See all →</Link></div>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.equipment.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">⚙️</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">EQUIPMENT</span>
                        <p className="font-bold text-gray-900 text-sm mt-1">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.owner} · {r.location}</p>
                        <p className="text-brand-600 font-black text-sm mt-1">{r.price}</p>
                      </div>
                      <Link href="/equipment" className="flex-shrink-0 bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-orange-600 transition-colors">Hire</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investments */}
            {(tab === 'all' || tab === 'investments') && results.investments.length > 0 && (
              <div>
                {tab === 'all' && <div className="flex items-center justify-between mb-3"><h2 className="font-black text-gray-800">💼 Investments</h2><Link href="/invest" className="text-sm text-brand-600 font-semibold">See all →</Link></div>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.investments.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">💼</div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">INVESTMENT</span>
                        <p className="font-bold text-gray-900 text-sm mt-1">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.returns} · Risk: {r.risk}</p>
                        <div className="h-1.5 bg-gray-100 rounded-full mt-2"><div className="h-1.5 bg-purple-500 rounded-full" style={{ width: `${r.funded}%` }} /></div>
                      </div>
                      <Link href="/invest" className="flex-shrink-0 bg-purple-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-purple-700 transition-colors">Invest</Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Farmers */}
            {(tab === 'all' || tab === 'farmers') && results.farmers.length > 0 && (
              <div>
                {tab === 'all' && <div className="flex items-center justify-between mb-3"><h2 className="font-black text-gray-800">👨‍🌾 Farmers</h2><Link href="/marketplace" className="text-sm text-brand-600 font-semibold">Browse all →</Link></div>}
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.farmers.map(r => (
                    <Link key={r.id} href={`/farmer/${r.id}`} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
                      <div className="w-12 h-12 rounded-2xl bg-brand-700 flex items-center justify-center text-white font-black flex-shrink-0">{r.name.charAt(0)}</div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.specialty} · {r.state}</p>
                        <p className="text-xs text-amber-600 font-semibold mt-1">⭐ {r.rating} · {r.orders}+ orders</p>
                      </div>
                      <span className="text-brand-600 text-xs font-bold self-center">View →</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {!q && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="font-black text-gray-800 text-xl mb-3">Search everything on FarmLink</h3>
              <p className="text-gray-500 text-sm mb-6">Find produce, transport, equipment, investments, land, and farmers all in one place</p>
              <div className="flex flex-wrap justify-center gap-2">
                {POPULAR.map(p => <button key={p} onClick={() => search(p)} className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300 transition-colors">{p}</button>)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
