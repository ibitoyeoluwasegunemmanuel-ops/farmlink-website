'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

const CROP_EMOJIS: Record<string, string> = {
  maize: '🌽', corn: '🌽', tomato: '🍅', tomatoes: '🍅', yam: '🍠', cassava: '🥔',
  potato: '🥔', potatoes: '🥔', rice: '🌾', wheat: '🌾', sorghum: '🌾', millet: '🌾',
  pepper: '🌶️', onion: '🧅', onions: '🧅', carrot: '🥕', carrots: '🥕',
  cabbage: '🥬', spinach: '🥬', lettuce: '🥬', watermelon: '🍉', mango: '🥭',
  banana: '🍌', orange: '🍊', pineapple: '🍍', cowpea: '🫘', beans: '🫘',
  groundnut: '🥜', peanut: '🥜', soybean: '🫘', cocoa: '🫘', coffee: '☕',
  cotton: '🌿', sugarcane: '🎋', ginger: '🫚', garlic: '🧄', sweet_potato: '🍠',
};

function getCropEmoji(name: string) {
  const key = name?.toLowerCase().replace(/\s+/g, '_');
  for (const [k, v] of Object.entries(CROP_EMOJIS)) {
    if (key?.includes(k)) return v;
  }
  return '🌿';
}

const QUALITY_BADGE: Record<string, string> = {
  premium: 'bg-amber-100 text-amber-700 border-amber-200',
  grade_a: 'bg-green-100 text-green-700 border-green-200',
  standard: 'bg-blue-100 text-blue-700 border-blue-200',
};

const MOCK_FARMER = {
  id: 'farmer_001',
  fullName: 'Emeka Okafor',
  farmName: 'GreenAcres Farm',
  state: 'Anambra',
  bio: 'Third-generation farmer specializing in premium maize, cassava, and tropical fruits. Over 15 years of farming experience with modern agricultural practices.',
  rating: 4.8,
  totalTransactions: 127,
  isVerified: true,
  avatar: '',
  memberSince: '2023-01-15',
  totalSales: 4250000,
  responseRate: 96,
};

const MOCK_LISTINGS = [
  { id: 'h1', cropType: 'Maize', quantity: 500, unit: 'kg', pricePerUnit: 450, quality: 'premium', location: 'Onitsha, Anambra', farmerId: 'farmer_001', farmerName: 'Emeka Okafor', availableQty: 500 },
  { id: 'h2', cropType: 'Cassava', quantity: 1200, unit: 'kg', pricePerUnit: 180, quality: 'grade_a', location: 'Onitsha, Anambra', farmerId: 'farmer_001', farmerName: 'Emeka Okafor', availableQty: 1200 },
  { id: 'h3', cropType: 'Tomatoes', quantity: 200, unit: 'kg', pricePerUnit: 950, quality: 'premium', location: 'Onitsha, Anambra', farmerId: 'farmer_001', farmerName: 'Emeka Okafor', availableQty: 200 },
  { id: 'h4', cropType: 'Yam', quantity: 800, unit: 'tubers', pricePerUnit: 700, quality: 'grade_a', location: 'Onitsha, Anambra', farmerId: 'farmer_001', farmerName: 'Emeka Okafor', availableQty: 800 },
  { id: 'h5', cropType: 'Pepper', quantity: 100, unit: 'kg', pricePerUnit: 1400, quality: 'standard', location: 'Onitsha, Anambra', farmerId: 'farmer_001', farmerName: 'Emeka Okafor', availableQty: 100 },
  { id: 'h6', cropType: 'Rice', quantity: 2000, unit: 'kg', pricePerUnit: 650, quality: 'premium', location: 'Onitsha, Anambra', farmerId: 'farmer_001', farmerName: 'Emeka Okafor', availableQty: 2000 },
];

function ListingCard({ listing }: { listing: any }) {
  const { addItem, hasItem } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const inCart = hasItem(listing.id);

  const handleAdd = async () => {
    if (!isAuthenticated) { router.push('/auth'); return; }
    setAdding(true);
    addItem({ ...listing, imageUrl: '' });
    setAdded(true);
    setAdding(false);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
      <Link href={`/marketplace/${listing.id}`}>
        <div className="bg-gradient-to-br from-brand-50 to-amber-50 h-44 flex items-center justify-center relative overflow-hidden">
          <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{getCropEmoji(listing.cropType)}</span>
          {listing.quality === 'premium' && (
            <div className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              ★ PREMIUM
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/marketplace/${listing.id}`}>
          <h3 className="font-bold text-ink text-base mb-1 hover:text-brand-600 transition-colors">{listing.cropType}</h3>
        </Link>
        <div className="flex items-center justify-between mb-3">
          <p className="text-brand-700 font-black text-lg">₦{listing.pricePerUnit.toLocaleString()}<span className="text-xs font-normal text-gray-400">/{listing.unit}</span></p>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${QUALITY_BADGE[listing.quality] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {listing.quality?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        <p className="text-gray-400 text-xs mb-3">📦 {listing.quantity.toLocaleString()} {listing.unit} available</p>
        <button
          onClick={handleAdd}
          disabled={adding || inCart}
          className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
            inCart || added
              ? 'bg-green-100 text-green-700 cursor-default'
              : 'bg-brand-600 hover:bg-brand-500 active:scale-95 text-white'
          }`}
        >
          {inCart || added ? '✓ Added to Cart' : adding ? '...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default function FarmerStorePage() {
  const params = useParams();
  const [farmer, setFarmer] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'about'>('listings');

  useEffect(() => {
    const id = params.id as string;
    Promise.all([
      fetch(`${API}/users/${id}`).then(r => r.json()).catch(() => null),
      fetch(`${API}/harvests?farmerId=${id}`).then(r => r.json()).catch(() => null),
    ]).then(([farmerData, listingsData]) => {
      setFarmer(farmerData?.user || MOCK_FARMER);
      const raw = listingsData?.harvests || listingsData?.data || [];
      setListings(raw.length ? raw : MOCK_LISTINGS);
    }).finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!farmer) return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-20 text-center">
        <p className="text-5xl mb-4">🌾</p>
        <h1 className="text-2xl font-black text-ink mb-2">Farmer not found</h1>
        <Link href="/marketplace" className="btn-primary inline-flex mt-4">Browse Marketplace →</Link>
      </div>
    </div>
  );

  const memberYear = farmer.memberSince ? new Date(farmer.memberSince).getFullYear() : 2023;
  const yearsActive = new Date().getFullYear() - memberYear + 1;

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Hero banner */}
      <div className="bg-brand-950 pt-24 pb-0">
        <div className="container-tight">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-brand-400 text-xs mb-6">
            <Link href="/marketplace" className="hover:text-brand-200 transition-colors">Marketplace</Link>
            <span>/</span>
            <span className="text-white">{farmer.farmName || farmer.fullName}</span>
          </div>

          {/* Farmer profile card */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 md:p-8 mb-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-brand-600 flex items-center justify-center flex-shrink-0 text-3xl font-black text-white">
                {farmer.avatar ? (
                  <img src={farmer.avatar} alt={farmer.fullName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  farmer.fullName?.charAt(0) || '🌾'
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white">{farmer.farmName || farmer.fullName}</h1>
                  {farmer.isVerified && (
                    <span className="bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      ✓ Verified Farmer
                    </span>
                  )}
                </div>
                <p className="text-brand-300 text-sm mb-1">by {farmer.fullName}</p>
                <p className="text-brand-400 text-sm flex items-center gap-1">
                  <span>📍</span> {farmer.state}, Nigeria
                </p>
              </div>

              {/* Stats */}
              <div className="flex sm:flex-col lg:flex-row items-center gap-4 sm:gap-2 lg:gap-6 bg-white/5 rounded-2xl px-5 py-3 sm:px-4 flex-shrink-0">
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{farmer.rating?.toFixed(1) || '4.8'}</p>
                  <p className="text-brand-400 text-xs">★ Rating</p>
                </div>
                <div className="w-px h-8 bg-white/10 hidden lg:block" />
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{farmer.totalTransactions || 0}</p>
                  <p className="text-brand-400 text-xs">Orders</p>
                </div>
                <div className="w-px h-8 bg-white/10 hidden lg:block" />
                <div className="text-center">
                  <p className="text-2xl font-black text-white">{yearsActive}yr{yearsActive > 1 ? 's' : ''}</p>
                  <p className="text-brand-400 text-xs">On FarmLink</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 border-b border-white/10">
            {(['listings', 'about'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-brand-400 text-brand-300'
                    : 'border-transparent text-brand-500 hover:text-brand-300'
                }`}
              >
                {tab === 'listings' ? `Listings (${listings.length})` : 'About Farm'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-tight py-8">
        {activeTab === 'listings' && (
          <>
            {listings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">🌾</p>
                <p className="font-bold text-ink text-xl mb-2">No active listings</p>
                <p className="text-gray-400">This farmer has no produce listed at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {listings.map(listing => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
              <div>
                <h3 className="font-bold text-ink mb-2">About the Farm</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{farmer.bio || 'This farmer has not added a bio yet.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Location', value: `${farmer.state}, Nigeria`, icon: '📍' },
                  { label: 'Response Rate', value: `${farmer.responseRate || 95}%`, icon: '💬' },
                  { label: 'Member Since', value: `${memberYear}`, icon: '📅' },
                  { label: 'Total Sales', value: `₦${(farmer.totalSales || 0).toLocaleString()}`, icon: '💰' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="font-bold text-ink text-sm">{s.value}</p>
                    <p className="text-gray-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">🔒</span>
                <div>
                  <p className="font-bold text-brand-800 text-sm">Safe & Secure Transactions</p>
                  <p className="text-brand-600 text-xs mt-0.5">All payments are held in escrow until you confirm delivery. Your money is protected.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
