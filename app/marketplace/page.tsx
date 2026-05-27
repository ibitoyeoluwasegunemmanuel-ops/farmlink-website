'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

interface Harvest {
  id: string;
  cropType: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  quality: string;
  status: string;
  description?: string;
  location?: { state?: string; town?: string };
  images?: string[];
  farmer?: { id: string; fullName?: string; farmName?: string; rating?: number };
  createdAt?: string;
}

const CATEGORIES = [
  { label: 'All', emoji: '🛒' },
  { label: 'Grains', emoji: '🌾' },
  { label: 'Vegetables', emoji: '🥬' },
  { label: 'Fruits', emoji: '🍊' },
  { label: 'Tubers', emoji: '🍠' },
  { label: 'Legumes', emoji: '🫘' },
  { label: 'Livestock', emoji: '🐄' },
  { label: 'Spices', emoji: '🌶️' },
];

const STATES = [
  'All States', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi',
  'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi',
  'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna',
  'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa',
  'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
  'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT',
];

function getCropEmoji(cropType: string): string {
  const t = cropType.toLowerCase();
  if (t.includes('maize') || t.includes('corn')) return '🌽';
  if (t.includes('tomato')) return '🍅';
  if (t.includes('yam')) return '🍠';
  if (t.includes('cassava') || t.includes('garri')) return '🌿';
  if (t.includes('groundnut') || t.includes('peanut')) return '🥜';
  if (t.includes('palm')) return '🫚';
  if (t.includes('rice') || t.includes('paddy')) return '🌾';
  if (t.includes('soya') || t.includes('soy') || t.includes('cowpea') || t.includes('bean')) return '🫘';
  if (t.includes('onion')) return '🧅';
  if (t.includes('pepper') || t.includes('chili')) return '🌶️';
  if (t.includes('watermelon')) return '🍉';
  if (t.includes('banana') || t.includes('plantain')) return '🍌';
  if (t.includes('orange')) return '🍊';
  if (t.includes('mango')) return '🥭';
  if (t.includes('pineapple')) return '🍍';
  if (t.includes('potato') || t.includes('Irish')) return '🥔';
  if (t.includes('spinach') || t.includes('leaf') || t.includes('vegetable')) return '🥬';
  if (t.includes('chicken') || t.includes('poultry')) return '🐔';
  if (t.includes('fish')) return '🐟';
  return '🌾';
}

const MOCK: Harvest[] = [
  { id: '1', cropType: 'Premium White Maize', quantity: 200, unit: 'bag', pricePerUnit: 55000, quality: 'Grade A', status: 'available', location: { state: 'Kaduna', town: 'Zaria' }, farmer: { id: 'f1', fullName: 'Emeka Okafor Farms', rating: 4.8 }, createdAt: '2025-11-06' },
  { id: '2', cropType: 'Cassava (Sun-Dried)', quantity: 500, unit: 'bag', pricePerUnit: 8500, quality: 'Grade A', status: 'available', location: { state: 'Enugu', town: 'Nsukka' }, farmer: { id: 'f2', fullName: 'Fatima Agro Ltd', rating: 4.6 }, createdAt: '2025-11-05' },
  { id: '3', cropType: 'Roma Tomatoes', quantity: 80, unit: 'crate', pricePerUnit: 12000, quality: 'Grade B', status: 'available', location: { state: 'Ogun', town: 'Abeokuta' }, farmer: { id: 'f3', fullName: 'Kola Fresh Farms', rating: 4.2 }, createdAt: '2025-11-05' },
  { id: '4', cropType: 'Puna Yam Tubers', quantity: 1000, unit: 'tuber', pricePerUnit: 3500, quality: 'Grade A', status: 'available', location: { state: 'Benue', town: 'Makurdi' }, farmer: { id: 'f4', fullName: 'Nnamdi Farm Co.', rating: 4.9 }, createdAt: '2025-11-04' },
  { id: '5', cropType: 'Kano Groundnuts', quantity: 300, unit: 'bag', pricePerUnit: 22000, quality: 'Grade A', status: 'available', location: { state: 'Kano', town: 'Kano City' }, farmer: { id: 'f5', fullName: 'Suleiman Farms', rating: 4.7 }, createdAt: '2025-11-04' },
  { id: '6', cropType: 'Red Palm Oil', quantity: 100, unit: 'drum', pricePerUnit: 85000, quality: 'Grade A', status: 'available', location: { state: 'Rivers', town: 'Port Harcourt' }, farmer: { id: 'f6', fullName: 'Niger Delta Produce', rating: 4.5 }, createdAt: '2025-11-03' },
  { id: '7', cropType: 'Soya Beans', quantity: 150, unit: 'bag', pricePerUnit: 72000, quality: 'Grade A', status: 'available', location: { state: 'Plateau', town: 'Jos' }, farmer: { id: 'f7', fullName: 'Highland Farms', rating: 4.8 }, createdAt: '2025-11-03' },
  { id: '8', cropType: 'White Garri', quantity: 200, unit: 'bag', pricePerUnit: 8000, quality: 'Grade B', status: 'available', location: { state: 'Delta', town: 'Asaba' }, farmer: { id: 'f8', fullName: 'Chinwe Produce', rating: 4.3 }, createdAt: '2025-11-02' },
  { id: '9', cropType: 'Paddy Rice', quantity: 800, unit: 'bag', pricePerUnit: 38000, quality: 'Grade A', status: 'available', location: { state: 'Kebbi', town: 'Birnin Kebbi' }, farmer: { id: 'f9', fullName: 'Kebbi Rice Cooperative', rating: 4.9 }, createdAt: '2025-11-02' },
  { id: '10', cropType: 'Red Onions', quantity: 120, unit: 'bag', pricePerUnit: 42000, quality: 'Grade A', status: 'available', location: { state: 'Sokoto', town: 'Sokoto' }, farmer: { id: 'f10', fullName: 'Garba Farms', rating: 4.6 }, createdAt: '2025-11-01' },
  { id: '11', cropType: 'Yellow Pepper', quantity: 60, unit: 'crate', pricePerUnit: 9500, quality: 'Grade A', status: 'available', location: { state: 'Kogi', town: 'Lokoja' }, farmer: { id: 'f11', fullName: 'Okwori Agro', rating: 4.4 }, createdAt: '2025-10-31' },
  { id: '12', cropType: 'Cowpea (Honey Beans)', quantity: 250, unit: 'bag', pricePerUnit: 45000, quality: 'Grade A', status: 'available', location: { state: 'Kwara', town: 'Ilorin' }, farmer: { id: 'f12', fullName: 'Musa Bean Farm', rating: 4.7 }, createdAt: '2025-10-30' },
];

function qualityBadge(q: string) {
  if (!q) return '';
  const lower = q.toLowerCase();
  if (lower.includes('grade a') || lower === 'a') return 'bg-brand-100 text-brand-800 border-brand-200';
  if (lower.includes('grade b') || lower === 'b') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-gray-100 text-gray-600 border-gray-200';
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

function ProductCard({ item }: { item: Harvest }) {
  const initials = (item.farmer?.fullName || 'F').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();
  const rating = item.farmer?.rating || 4.5;
  const fullStars = Math.floor(rating);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Produce image area */}
      <div className="relative h-44 bg-gradient-to-br from-brand-50 via-brand-50/80 to-amber-50 flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {getCropEmoji(item.cropType)}
        </span>
        {/* Quality badge */}
        {item.quality && (
          <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${qualityBadge(item.quality)}`}>
            {item.quality}
          </span>
        )}
        {/* New badge */}
        {item.createdAt && new Date(item.createdAt) > new Date(Date.now() - 3 * 86400000) && (
          <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-brand-600 text-white">
            New
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Title + location */}
        <div className="mb-3">
          <h3 className="font-bold text-ink text-base leading-tight truncate mb-1">{item.cropType}</h3>
          {item.location?.state && (
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <span>📍</span> {item.location.town ? `${item.location.town}, ` : ''}{item.location.state}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-2xl font-black text-brand-700">₦{item.pricePerUnit.toLocaleString('en-NG')}</span>
          <span className="text-sm text-gray-400">/{item.unit}</span>
        </div>

        {/* Stock + date */}
        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <span>📦</span>
            {item.quantity.toLocaleString()} {item.unit}s available
          </span>
          <span>{timeAgo(item.createdAt)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-4 mt-auto">
          {/* Farmer */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-gray-800 truncate">{item.farmer?.fullName || 'Verified Farmer'}</p>
              <div className="flex items-center gap-1">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <svg key={i} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs text-gray-400 ml-0.5">{rating}</span>
              </div>
            </div>
            <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full flex-shrink-0">✅ Verified</span>
          </div>

          {/* CTA */}
          <button className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
            <span>🔒</span> Buy with Escrow
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-100" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-7 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-10 bg-gray-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  const [items, setItems] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [sort, setSort] = useState('newest');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '60' });
      if (category !== 'All') params.set('category', category);
      if (selectedState !== 'All States') params.set('state', selectedState);
      const res = await fetch(`${API}/harvests?${params}`);
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setItems(Array.isArray(data.data) && data.data.length > 0 ? data.data : MOCK);
    } catch {
      setItems(MOCK);
    } finally {
      setLoading(false);
    }
  }, [category, selectedState]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = items
    .filter(item => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        item.cropType.toLowerCase().includes(q) ||
        item.location?.state?.toLowerCase().includes(q) ||
        item.location?.town?.toLowerCase().includes(q) ||
        item.farmer?.fullName?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
      if (sort === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
      return 0;
    });

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative bg-brand-950 pt-24 pb-14 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(31,168,69,0.2) 0%, transparent 70%)' }}
        />
        <div className="container-tight relative z-10">
          {/* Breadcrumb */}
          <nav className="text-sm text-brand-400/60 mb-5 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-300 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Marketplace</span>
          </nav>

          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-3">
              Farm Marketplace
            </h1>
            <p className="text-brand-200/60 text-lg">
              Fresh produce from verified farmers across Nigeria. Every order is escrow-protected.
            </p>
          </div>

          {/* Search bar */}
          <div className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search crops, farmers, or locations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm transition"
              />
            </div>
            <button
              onClick={fetchItems}
              className="bg-brand-500 hover:bg-brand-400 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors flex-shrink-0"
            >
              Search
            </button>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {[
              { icon: '🔒', label: 'Escrow Protected' },
              { icon: '✅', label: 'Verified Farmers Only' },
              { icon: '🚚', label: 'Delivery Available' },
              { icon: '⚡', label: 'Same-day Response' },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-1.5 text-brand-300/70 text-xs font-medium">
                <span>{t.icon}</span>{t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container-tight py-8">
        {/* ── Filters row ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            {STATES.map(s => <option key={s}>{s}</option>)}
          </select>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
          <div className="flex-1" />
          <div className="flex items-center gap-2 text-xs text-brand-700 font-medium bg-brand-50 border border-brand-100 px-3.5 py-2.5 rounded-xl">
            <span>🔒</span> All trades escrow-protected
          </div>
        </div>

        {/* ── Category chips ── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.label}
              onClick={() => setCategory(cat.label)}
              className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                category === cat.label
                  ? 'bg-brand-700 text-white shadow-glow-green'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-400 hover:text-brand-700'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* ── Results summary ── */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-gray-500 text-sm">
            {loading
              ? 'Loading fresh listings...'
              : <><span className="font-semibold text-ink">{filtered.length}</span> {filtered.length === 1 ? 'listing' : 'listings'} found</>
            }
          </p>
          {!loading && filtered.length > 0 && (
            <p className="text-xs text-gray-400">Updated just now</p>
          )}
        </div>

        {/* ── Product grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <span className="text-6xl block mb-4">🌾</span>
            <p className="text-ink font-bold text-xl mb-2">No listings found</p>
            <p className="text-gray-400 text-sm mb-6">Try adjusting your search or category filter</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setSelectedState('All States'); }}
              className="btn-outline text-sm"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => <ProductCard key={item.id} item={item} />)}
          </div>
        )}

        {/* ── Load more ── */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-10">
            <button className="btn-outline">
              Load More Listings
            </button>
          </div>
        )}
      </div>

      {/* ── Farmer CTA Banner ── */}
      <section className="bg-brand-950 py-16 mt-8 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(31,168,69,0.15) 0%, transparent 70%)' }}
        />
        <div className="container-tight relative z-10">
          <div className="max-w-2xl">
            <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">For Farmers</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-white mb-3">
              Sell your harvest to thousands of buyers
            </h2>
            <p className="text-brand-200/60 text-lg mb-7">
              List for free. Get discovered. Get paid securely. No middlemen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="btn-primary">
                📱 Download App to List →
              </a>
              <Link href="/" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
