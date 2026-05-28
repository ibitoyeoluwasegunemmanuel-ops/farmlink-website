'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { useCart } from '../../../contexts/CartContext';
import { useAuth } from '../../../contexts/AuthContext';
import ShareModal from '../../../components/ShareModal';
import MakeOfferModal from '../../../components/MakeOfferModal';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

interface Product {
  id: string; cropType: string; quantity: number; unit: string;
  pricePerUnit: number; quality: string; status: string;
  description?: string;
  location?: { state?: string; town?: string };
  farmer?: { id: string; fullName?: string; farmName?: string; rating?: number; totalSales?: number; phoneNumber?: string };
  createdAt?: string; images?: string[];
}

const MOCK: Record<string, Product> = {
  '1': { id: '1', cropType: 'Premium White Maize', quantity: 200, unit: 'bag', pricePerUnit: 55000, quality: 'Grade A', status: 'available', description: 'Sun-dried white maize harvested from Zaria plains. Free from aflatoxin, moisture content below 12%. Ideal for flour mills, poultry feed and direct consumption. Packed in 100kg woven PP bags.', location: { state: 'Kaduna', town: 'Zaria' }, farmer: { id: 'f1', fullName: 'Emeka Okafor', farmName: 'Emeka Farms', rating: 4.8, totalSales: 312 }, createdAt: '2025-11-06' },
  '2': { id: '2', cropType: 'Cassava (Sun-Dried)', quantity: 500, unit: 'bag', pricePerUnit: 8500, quality: 'Grade A', status: 'available', description: 'Sun-dried cassava chips from Nsukka cooperative farms. High starch content, ideal for garri production, starch extraction and animal feed.', location: { state: 'Enugu', town: 'Nsukka' }, farmer: { id: 'f2', fullName: 'Fatima Agro Ltd', rating: 4.6, totalSales: 189 }, createdAt: '2025-11-05' },
  '3': { id: '3', cropType: 'Roma Tomatoes', quantity: 80, unit: 'crate', pricePerUnit: 12000, quality: 'Grade B', status: 'available', description: 'Fresh Roma tomatoes from Ogun State greenhouse farms. Harvested within 24 hours. Crates of 30kg each. Ideal for ketchup production and retail markets.', location: { state: 'Ogun', town: 'Abeokuta' }, farmer: { id: 'f3', fullName: 'Kola Fresh Farms', rating: 4.2, totalSales: 670 }, createdAt: '2025-11-05' },
  '4': { id: '4', cropType: 'Puna Yam Tubers', quantity: 1000, unit: 'tuber', pricePerUnit: 3500, quality: 'Grade A', status: 'available', description: 'Premium Puna yam from the Benue valley — known as Nigeria\'s food basket. Each tuber averages 4-6kg. Clean, scar-free, properly cured for storage.', location: { state: 'Benue', town: 'Makurdi' }, farmer: { id: 'f4', fullName: 'Nnamdi Farm Co.', rating: 4.9, totalSales: 540 }, createdAt: '2025-11-04' },
  '5': { id: '5', cropType: 'Kano Groundnuts', quantity: 300, unit: 'bag', pricePerUnit: 22000, quality: 'Grade A', status: 'available', description: 'Machine-shelled Kano groundnuts. Cleaned and sorted, low moisture. Excellent for oil extraction, groundnut cake and direct consumption. 50kg bags.', location: { state: 'Kano', town: 'Kano City' }, farmer: { id: 'f5', fullName: 'Suleiman Farms', rating: 4.7, totalSales: 405 }, createdAt: '2025-11-04' },
  '6': { id: '6', cropType: 'Red Palm Oil', quantity: 100, unit: 'drum', pricePerUnit: 85000, quality: 'Grade A', status: 'available', description: 'Fresh red palm oil from Rivers State. First press, unrefined. 25-litre steel drums. Ideal for food processing, restaurants and retail packaging.', location: { state: 'Rivers', town: 'Port Harcourt' }, farmer: { id: 'f6', fullName: 'Niger Delta Produce', rating: 4.5, totalSales: 210 }, createdAt: '2025-11-03' },
  '7': { id: '7', cropType: 'Soya Beans', quantity: 150, unit: 'bag', pricePerUnit: 72000, quality: 'Grade A', status: 'available', description: 'High-protein soya beans from Jos Plateau. Moisture-free, clean sorted. 100kg bags. Ideal for poultry feed manufacturers, soy milk and tofu producers.', location: { state: 'Plateau', town: 'Jos' }, farmer: { id: 'f7', fullName: 'Highland Farms', rating: 4.8, totalSales: 180 }, createdAt: '2025-11-03' },
  '8': { id: '8', cropType: 'White Garri', quantity: 200, unit: 'bag', pricePerUnit: 8000, quality: 'Grade B', status: 'available', description: 'Fine-grain white garri from Delta State. Machine-processed, sieved for consistency. 25kg bags. Popular in Lagos, Abuja and Port Harcourt markets.', location: { state: 'Delta', town: 'Asaba' }, farmer: { id: 'f8', fullName: 'Chinwe Produce', rating: 4.3, totalSales: 298 }, createdAt: '2025-11-02' },
  '9': { id: '9', cropType: 'Paddy Rice', quantity: 800, unit: 'bag', pricePerUnit: 38000, quality: 'Grade A', status: 'available', description: 'Kebbi State long-grain paddy rice. Locally grown under USAID irrigation programme. Uniform grain size, low breakage. 50kg bags. Suitable for milling.', location: { state: 'Kebbi', town: 'Birnin Kebbi' }, farmer: { id: 'f9', fullName: 'Kebbi Rice Cooperative', rating: 4.9, totalSales: 890 }, createdAt: '2025-11-02' },
  '10': { id: '10', cropType: 'Red Onions', quantity: 120, unit: 'bag', pricePerUnit: 42000, quality: 'Grade A', status: 'available', description: 'Premium dried red onions from Sokoto. Long shelf life, pungent flavour. 50kg bags. Perfect for supermarkets, food processors and export.', location: { state: 'Sokoto', town: 'Sokoto' }, farmer: { id: 'f10', fullName: 'Garba Farms', rating: 4.6, totalSales: 298 }, createdAt: '2025-11-01' },
};

function getCropEmoji(name: string) {
  const t = name.toLowerCase();
  if (t.includes('maize') || t.includes('corn')) return '🌽';
  if (t.includes('tomato')) return '🍅';
  if (t.includes('yam')) return '🍠';
  if (t.includes('cassava') || t.includes('garri')) return '🌿';
  if (t.includes('groundnut') || t.includes('peanut')) return '🥜';
  if (t.includes('palm')) return '🫚';
  if (t.includes('rice') || t.includes('paddy')) return '🌾';
  if (t.includes('soya') || t.includes('soy') || t.includes('cowpea') || t.includes('bean')) return '🫘';
  if (t.includes('onion')) return '🧅';
  if (t.includes('pepper')) return '🌶️';
  return '🌾';
}

const REVIEWS = [
  { name: 'Chukwudi M.', rating: 5, date: '2 weeks ago', comment: 'Excellent quality. Arrived on time, no moisture issues. Will definitely order again.' },
  { name: 'Hauwa A.', rating: 5, date: '1 month ago', comment: 'Best maize I have sourced this season. The grading was accurate and the farmer was very responsive.' },
  { name: 'Tunde O.', rating: 4, date: '1 month ago', comment: 'Good product overall. Delivery took an extra day but quality was as described.' },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, hasItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkQty, setBulkQty] = useState('');
  const [bulkSent, setBulkSent] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API}/harvests/${id}`);
        const data = await res.json();
        if (data.harvest) setProduct(data.harvest);
        else setProduct(MOCK[id] || null);
      } catch {
        setProduct(MOCK[id] || null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (product) setAdded(hasItem(product.id));
  }, [product, hasItem]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) { router.push('/auth?role=buyer'); return; }
    addItem({
      id: product.id, cropType: product.cropType,
      pricePerUnit: product.pricePerUnit, unit: product.unit,
      availableQty: product.quantity, farmerId: product.farmer?.id || '',
      farmerName: product.farmer?.farmName || product.farmer?.fullName || 'Verified Farmer',
      quality: product.quality,
      location: product.location?.state,
    });
    setAdded(true);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-20 text-center">
        <p className="text-5xl mb-4">🌾</p>
        <h1 className="text-2xl font-black text-ink mb-2">Listing not found</h1>
        <Link href="/marketplace" className="btn-primary inline-flex mt-4">Browse Marketplace →</Link>
      </div>
    </div>
  );

  const totalCost = product.pricePerUnit * qty;
  const platformFee = totalCost * 0.02;
  const logisticsFee = totalCost * 0.05;
  const farmerGets = totalCost - platformFee - logisticsFee;
  const stars = product.farmer?.rating || 4.5;

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="container-tight py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-brand-600">Marketplace</Link>
          <span>/</span>
          <span className="text-ink font-medium">{product.cropType}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: image + details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product image */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-brand-50 to-amber-50 flex items-center justify-center text-8xl mb-4">
                {getCropEmoji(product.cropType)}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full border border-brand-100">
                  {product.quality || 'Grade A'}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${product.status === 'available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {product.status === 'available' ? '✅ In Stock' : product.status}
                </span>
              </div>
            </div>

            {/* Product info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h1 className="text-2xl font-black text-ink mb-2">{product.cropType}</h1>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-brand-700">₦{product.pricePerUnit.toLocaleString()}</span>
                <span className="text-gray-400">/{product.unit}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                📦 {product.quantity.toLocaleString()} {product.unit}s available
                {product.location?.state && ` · 📍 ${product.location.town ? product.location.town + ', ' : ''}${product.location.state}`}
              </p>

              {product.description && (
                <div>
                  <h3 className="font-semibold text-ink text-sm mb-2">Product Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-5">
                <h3 className="font-semibold text-ink text-sm mb-2">Quantity ({product.unit}s)</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-colors">−</button>
                  <span className="w-12 text-center font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))} className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-colors">+</button>
                  <span className="text-gray-400 text-sm ml-2">Total: <span className="font-black text-ink">₦{(product.pricePerUnit * qty).toLocaleString()}</span></span>
                </div>
              </div>
            </div>

            {/* Escrow breakdown */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-5">
              <h3 className="font-bold text-ink text-sm mb-3 flex items-center gap-2"><span>🔒</span> Escrow Payment Breakdown</h3>
              <div className="space-y-2 text-sm">
                {[
                  { label: 'Product subtotal', value: `₦${totalCost.toLocaleString()}` },
                  { label: 'Platform fee (2%)', value: `₦${Math.round(platformFee).toLocaleString()}` },
                  { label: 'Logistics fee (5%)', value: `₦${Math.round(logisticsFee).toLocaleString()}` },
                  { label: 'Farmer receives', value: `₦${Math.round(farmerGets).toLocaleString()}`, bold: true },
                ].map(row => (
                  <div key={row.label} className={`flex justify-between ${row.bold ? 'font-bold text-brand-700 border-t border-brand-200 pt-2' : 'text-gray-600'}`}>
                    <span>{row.label}</span><span>{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-brand-600/70 mt-3">💡 Payment is held in escrow and released to the farmer only after you confirm delivery.</p>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-bold text-ink mb-4">Customer Reviews</h3>
              <div className="space-y-4">
                {REVIEWS.map(r => (
                  <div key={r.name} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-ink">{r.name}</span>
                      <span className="text-gray-400 text-xs">{r.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 mb-2">
                      {Array.from({ length: r.rating }).map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
                    </div>
                    <p className="text-gray-600 text-sm">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sticky purchase card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Buy card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <div className="text-center mb-5">
                  <p className="text-3xl font-black text-brand-700">₦{(product.pricePerUnit * qty).toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{qty} × ₦{product.pricePerUnit.toLocaleString()} per {product.unit}</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    🔒 Buy Now with Escrow
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={added}
                    className="w-full border-2 border-brand-600 text-brand-600 hover:bg-brand-50 disabled:opacity-60 font-bold py-3.5 rounded-xl transition-colors"
                  >
                    {added ? '✅ In Cart' : '🛒 Add to Cart'}
                  </button>
                </div>
                {/* Make offer + Share */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={() => setShowOffer(true)}
                    className="flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-bold py-2.5 rounded-xl text-xs transition-colors">
                    🤝 Make Offer
                  </button>
                  <button onClick={() => setShowShare(true)}
                    className="flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold py-2.5 rounded-xl text-xs transition-colors">
                    🔗 Share
                  </button>
                </div>

                <div className="mt-3 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2"><span>🔒</span> Escrow-protected payment</div>
                  <div className="flex items-center gap-2"><span>🚚</span> Delivery available to your state</div>
                  <div className="flex items-center gap-2"><span>↩️</span> Dispute resolution within 48hrs</div>
                </div>

                {/* Bulk / wholesale order */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  {!bulkMode ? (
                    <button onClick={() => setBulkMode(true)}
                      className="w-full text-sm text-brand-600 font-semibold hover:bg-brand-50 py-2.5 rounded-xl border border-brand-200 transition-colors">
                      📦 Request Bulk / Wholesale Order
                    </button>
                  ) : bulkSent ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center text-sm text-green-700 font-bold">
                      ✅ Request sent! The farmer will contact you shortly.
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-bold text-amber-800">Bulk Order Request</p>
                      <p className="text-xs text-amber-700">For large orders (10+ units), contact the farmer directly for negotiated pricing and delivery terms.</p>
                      <input
                        value={bulkQty}
                        onChange={e => setBulkQty(e.target.value)}
                        type="number"
                        placeholder={`Quantity needed (${product.unit}s)`}
                        className="w-full border border-amber-300 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-400"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setBulkMode(false)} className="flex-1 text-xs text-gray-500 border border-gray-200 py-2 rounded-lg bg-white hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                        <button
                          disabled={!bulkQty || Number(bulkQty) < 1}
                          onClick={() => { setBulkSent(true); }}
                          className="flex-1 text-xs bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold py-2 rounded-lg transition-colors"
                        >
                          Send Request
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Seller card */}
              {product.farmer && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-ink text-sm mb-4">About the Seller</h3>
                  <Link href={`/farmer/${product.farmer.id}`} className="flex items-center gap-3 group mb-4">
                    <div className="w-12 h-12 rounded-full bg-brand-700 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {(product.farmer.fullName || 'F').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-ink text-sm group-hover:text-brand-600 transition-colors">{product.farmer.farmName || product.farmer.fullName}</p>
                      <p className="text-xs text-gray-400">{product.location?.state}</p>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="font-black text-ink">{stars}</p>
                      <div className="flex justify-center gap-0.5 my-0.5">{Array.from({ length: Math.floor(stars) }).map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}</div>
                      <p className="text-xs text-gray-400">Rating</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="font-black text-ink">{product.farmer.totalSales || 0}+</p>
                      <p className="text-xs text-gray-400 mt-1">Sales</p>
                    </div>
                  </div>
                  <Link href={`/farmer/${product.farmer.id}`} className="w-full text-center block text-brand-600 text-sm font-semibold hover:text-brand-700 bg-brand-50 py-2.5 rounded-xl transition-colors">
                    View Farmer Store →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {showShare && (
        <ShareModal
          title={product.cropType}
          description={`₦${product.pricePerUnit.toLocaleString()}/${product.unit} · ${product.location?.state}`}
          onClose={() => setShowShare(false)}
        />
      )}

      {showOffer && (
        <MakeOfferModal
          listingTitle={product.cropType}
          askingPrice={product.pricePerUnit}
          unit={product.unit}
          sellerName={product.farmer?.farmName || product.farmer?.fullName || 'Farmer'}
          sellerType="farmer"
          onClose={() => setShowOffer(false)}
        />
      )}
    </div>
  );
}
