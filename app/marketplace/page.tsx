'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

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

function ProductCard({ item, onBuy, inCart, justAdded }: { item: Harvest; onBuy: (item: Harvest) => void; inCart: boolean; justAdded: boolean }) {
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
          {justAdded ? (
            <div className="w-full py-3 rounded-xl bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2">
              <span>✓</span> Added!
            </div>
          ) : inCart ? (
            <Link href="/cart" className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
              <span>✓</span> In Cart — Go to Cart
            </Link>
          ) : (
            <button
              onClick={() => onBuy(item)}
              className="w-full py-3 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>🔒</span> Buy with Escrow
            </button>
          )}
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

const MOCK_DRIVERS = [
  { id: 'd1', name: 'Alhaji Musa Trucks', vehicle: '10-tonne Lorry', route: 'Kano → Lagos', pricePerKm: 150 },
  { id: 'd2', name: 'Swift Agro Haulage', vehicle: '5-tonne Pick-up', route: 'Abuja → Port Harcourt', pricePerKm: 120 },
  { id: 'd3', name: 'Delta Express Cargo', vehicle: 'Refrigerated Van', route: 'Delta → Onitsha', pricePerKm: 200 },
];

const MOCK_EQUIPMENT_HIRE = [
  { id: 'e1', name: 'John Deere 5055E', type: 'Tractor', dailyRate: 45000 },
  { id: 'e2', name: 'Honda WP20X', type: 'Irrigation Pump', dailyRate: 8500 },
  { id: 'e3', name: 'New Holland TC5', type: 'Harvester', dailyRate: 90000 },
];

const MOCK_INVESTMENTS = [
  { id: 'i1', crop: 'Maize Farm — Kano', returnPct: 18, risk: 'Low' },
  { id: 'i2', crop: 'Poultry Processing — Ogun', returnPct: 24, risk: 'Medium' },
  { id: 'i3', crop: 'Tomato Greenhouse — Anambra', returnPct: 22, risk: 'Low' },
];

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', currency: '₦' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GH₵' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KSh' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'R' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', currency: 'Br' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', currency: 'CFA' },
  { code: 'CI', name: "Côte d'Ivoire", flag: '🇨🇮', currency: 'CFA' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TSh' },
];

const INTL_MOCK: Harvest[] = [
  { id: 'gh1', cropType: 'Ghana Cocoa Beans', quantity: 50, unit: 'bag', pricePerUnit: 85000, quality: 'Grade A', status: 'available', location: { state: 'Ashanti, Ghana', town: 'Kumasi' }, farmer: { id: 'gf1', fullName: 'Kwame Asante Farms', rating: 4.9 }, createdAt: '2025-11-05' },
  { id: 'gh2', cropType: 'Yam (Puna)', quantity: 800, unit: 'tuber', pricePerUnit: 2800, quality: 'Grade A', status: 'available', location: { state: 'Brong-Ahafo, Ghana', town: 'Sunyani' }, farmer: { id: 'gf2', fullName: 'Akosua Farms', rating: 4.7 }, createdAt: '2025-11-04' },
  { id: 'ke1', cropType: 'Kenya AA Coffee', quantity: 30, unit: 'bag', pricePerUnit: 120000, quality: 'Grade A', status: 'available', location: { state: 'Nyeri, Kenya', town: 'Nyeri' }, farmer: { id: 'kf1', fullName: 'Wanjiku Coffee Co.', rating: 5.0 }, createdAt: '2025-11-03' },
  { id: 'ke2', cropType: 'French Beans', quantity: 200, unit: 'kg', pricePerUnit: 1800, quality: 'Grade A', status: 'available', location: { state: 'Naivasha, Kenya', town: 'Naivasha' }, farmer: { id: 'kf2', fullName: 'Rift Valley Exports', rating: 4.8 }, createdAt: '2025-11-02' },
  { id: 'za1', cropType: 'Premium Avocado', quantity: 150, unit: 'crate', pricePerUnit: 35000, quality: 'Grade A', status: 'available', location: { state: 'Limpopo, SA', town: 'Tzaneen' }, farmer: { id: 'zf1', fullName: 'Green Valley SA', rating: 4.6 }, createdAt: '2025-11-01' },
  { id: 'et1', cropType: 'Ethiopian Sesame', quantity: 100, unit: 'bag', pricePerUnit: 58000, quality: 'Grade A', status: 'available', location: { state: 'Tigray, Ethiopia', town: 'Humera' }, farmer: { id: 'ef1', fullName: 'Nile Basin Farms', rating: 4.7 }, createdAt: '2025-10-31' },
];

export default function MarketplacePage() {
  const router = useRouter();
  const { addItem, hasItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All States');
  const [sort, setSort] = useState('newest');
  const [added, setAdded] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState('NG');
  const [showIntl, setShowIntl] = useState(false);
  const [nearbyItems, setNearbyItems] = useState<Harvest[]>([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const handleBuy = (item: Harvest) => {
    if (!isAuthenticated) { router.push('/auth?role=buyer'); return; }
    addItem({
      id: item.id,
      cropType: item.cropType,
      pricePerUnit: item.pricePerUnit,
      unit: item.unit,
      availableQty: item.quantity,
      farmerId: item.farmer?.id || '',
      farmerName: item.farmer?.fullName || 'Farmer',
      quality: item.quality,
      location: item.location?.state,
    });
    setAdded(item.id);
    setTimeout(() => setAdded(null), 2000);
  };

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

  // Nearby: use browser geolocation → reverse geocode state, filter MOCK by that state
  useEffect(() => {
    if (!navigator.geolocation) return;
    setNearbyLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        // Map rough lat/lng to Nigerian states (simplified)
        const { latitude, longitude } = pos.coords;
        let state = 'Lagos';
        if (latitude > 11) state = 'Kano';
        else if (latitude > 9 && longitude > 7) state = 'Abuja (FCT)';
        else if (latitude > 7 && longitude > 5) state = 'Plateau';
        else if (latitude > 6 && longitude > 7) state = 'Anambra';
        else if (latitude < 5) state = 'Rivers';
        setUserLocation(state);
        setNearbyItems(MOCK.filter(m => m.location?.state?.includes(state.split(' ')[0])));
        setNearbyLoading(false);
      },
      () => {
        setNearbyItems(MOCK.slice(0, 4));
        setNearbyLoading(false);
      },
      { timeout: 5000 }
    );
  }, []);

  const displayItems = showIntl ? INTL_MOCK : items;

  const filtered = displayItems
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
              Fresh produce from verified farmers across Africa. Every order is escrow-protected.
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

        {/* ── Local / International toggle ── */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setShowIntl(false)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${!showIntl ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}
            >
              🏠 Local Listings
            </button>
            <button
              onClick={() => setShowIntl(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${showIntl ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500'}`}
            >
              🌍 International (Africa)
            </button>
          </div>

          {/* Country selector — shown when international */}
          {showIntl && (
            <div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap">
              {COUNTRIES.filter(c => c.code !== 'NG').map(c => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-2 rounded-xl border text-sm font-semibold transition-all ${selectedCountry === c.code ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}
                >
                  {c.flag} {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Nearby section (local only) ── */}
        {!showIntl && (nearbyLoading || nearbyItems.length > 0) && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📍</span>
              <h2 className="font-black text-gray-900 text-lg">
                Near You{userLocation ? ` — ${userLocation}` : ''}
              </h2>
              {nearbyLoading && <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />}
            </div>
            {nearbyLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {nearbyItems.slice(0, 4).map(item => (
                  <Link key={item.id} href={`/marketplace/${item.id}`}
                    className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-brand-200 hover:shadow-md transition-all group">
                    <div className="text-4xl mb-2 text-center">{getCropEmoji(item.cropType)}</div>
                    <p className="font-bold text-gray-900 text-sm truncate">{item.cropType}</p>
                    <p className="text-brand-700 font-black text-sm">₦{item.pricePerUnit.toLocaleString()}<span className="text-gray-400 font-normal text-xs">/{item.unit}</span></p>
                    <p className="text-xs text-gray-400 mt-1 truncate">📍 {item.location?.town}, {item.location?.state}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

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
            {filtered.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onBuy={handleBuy}
                inCart={hasItem(item.id)}
                justAdded={added === item.id}
              />
            ))}
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

      {/* ── More on FarmLink Discovery Section ── */}
      <section className="bg-gray-50 border-t border-gray-100 py-14 mt-4">
        <div className="container-tight">
          <h2 className="text-2xl font-black text-ink mb-8">More on FarmLink</h2>

          {/* Transport */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2"><span>🚛</span> Transport Available</h3>
              <Link href="/transport" className="text-sm text-brand-600 font-semibold hover:text-brand-700 transition-colors">See all →</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {MOCK_DRIVERS.map(d => (
                <div key={d.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-shrink-0 w-64 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl mb-3">🚛</div>
                  <p className="font-bold text-ink text-sm mb-0.5">{d.name}</p>
                  <p className="text-xs text-gray-400 mb-1">{d.vehicle}</p>
                  <p className="text-xs text-gray-500 mb-3">📍 {d.route}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-700">₦{d.pricePerKm}/km</span>
                    <Link href="/transport" className="text-xs bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors">Book</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2"><span>⚙️</span> Equipment for Hire</h3>
              <Link href="/equipment" className="text-sm text-brand-600 font-semibold hover:text-brand-700 transition-colors">See all →</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {MOCK_EQUIPMENT_HIRE.map(e => (
                <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-shrink-0 w-64 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-xl mb-3">⚙️</div>
                  <p className="font-bold text-ink text-sm mb-0.5">{e.name}</p>
                  <p className="text-xs text-gray-400 mb-3">{e.type}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-700">₦{e.dailyRate.toLocaleString()}/day</span>
                    <Link href="/equipment" className="text-xs bg-amber-500 hover:bg-amber-400 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors">Hire</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Investments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink flex items-center gap-2"><span>💼</span> Investment Opportunities</h3>
              <Link href="/invest" className="text-sm text-brand-600 font-semibold hover:text-brand-700 transition-colors">See all →</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
              {MOCK_INVESTMENTS.map(inv => (
                <div key={inv.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex-shrink-0 w-64 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-xl mb-3">💼</div>
                  <p className="font-bold text-ink text-sm mb-1">{inv.crop}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-green-700">{inv.returnPct}% return</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${inv.risk === 'Low' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{inv.risk} Risk</span>
                  </div>
                  <Link href="/invest" className="block text-center text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors">Invest</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Farmer CTA Banner ── */}
      <section className="bg-brand-950 py-16 relative overflow-hidden">
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
