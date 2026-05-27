'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

const ROLES = [
  { key: 'farmer', emoji: '🌾', title: 'Farmer', sub: 'Sell your harvest', color: 'from-brand-800 to-brand-600', desc: 'List produce, land & equipment. Get paid securely.', count: '12,000+ active' },
  { key: 'buyer', emoji: '🏪', title: 'Buyer / Trader', sub: 'Source fresh produce', color: 'from-blue-800 to-blue-600', desc: 'Browse thousands of verified farm listings across Nigeria.', count: '8,500+ active' },
  { key: 'transporter', emoji: '🚛', title: 'Transporter', sub: 'Earn with your truck', color: 'from-amber-700 to-amber-500', desc: 'Accept delivery jobs matched to your route and truck type.', count: '2,200+ drivers' },
  { key: 'equipment', emoji: '🚜', title: 'Equipment Owner', sub: 'Rent out your gear', color: 'from-violet-800 to-violet-600', desc: 'Post tractors, pumps and harvesters for daily or weekly rental.', count: '450+ listings' },
  { key: 'investor', emoji: '💼', title: 'Investor', sub: 'Fund Nigerian farms', color: 'from-rose-800 to-rose-600', desc: 'Back verified farms and earn competitive returns on your capital.', count: '₦2B+ deployed' },
];

const CATEGORIES = [
  { emoji: '🌽', label: 'Grains & Cereals' },
  { emoji: '🥬', label: 'Vegetables' },
  { emoji: '🍊', label: 'Fruits' },
  { emoji: '🍠', label: 'Tubers & Roots' },
  { emoji: '🫘', label: 'Legumes' },
  { emoji: '🌶️', label: 'Spices & Peppers' },
  { emoji: '🐄', label: 'Livestock' },
  { emoji: '🫚', label: 'Oils & Fats' },
  { emoji: '🌿', label: 'Cash Crops' },
  { emoji: '🚜', label: 'Equipment' },
  { emoji: '🏡', label: 'Farm Land' },
  { emoji: '🌱', label: 'Seeds & Inputs' },
];

const FEATURED_PRODUCTS = [
  { id: '1', emoji: '🌽', name: 'Premium White Maize', price: 55000, unit: 'bag', farmer: 'Emeka Farms', state: 'Kaduna', rating: 4.8, sold: 312, badge: 'Best Seller' },
  { id: '9', emoji: '🌾', name: 'Paddy Rice', price: 38000, unit: 'bag', farmer: 'Kebbi Rice Coop.', state: 'Kebbi', rating: 4.9, sold: 890, badge: 'Top Rated' },
  { id: '4', emoji: '🍠', name: 'Puna Yam Tubers', price: 3500, unit: 'tuber', farmer: 'Nnamdi Farm Co.', state: 'Benue', rating: 4.9, sold: 540, badge: 'Fresh' },
  { id: '6', emoji: '🫚', name: 'Red Palm Oil', price: 85000, unit: 'drum', farmer: 'Niger Delta Produce', state: 'Rivers', rating: 4.5, sold: 210, badge: 'Premium' },
  { id: '5', emoji: '🥜', name: 'Kano Groundnuts', price: 22000, unit: 'bag', farmer: 'Suleiman Farms', state: 'Kano', rating: 4.7, sold: 405, badge: 'Verified' },
  { id: '12', emoji: '🫘', name: 'Honey Beans', price: 45000, unit: 'bag', farmer: 'Musa Bean Farm', state: 'Kwara', rating: 4.7, sold: 188, badge: 'New' },
  { id: '3', emoji: '🍅', name: 'Roma Tomatoes', price: 12000, unit: 'crate', farmer: 'Kola Fresh Farms', state: 'Ogun', rating: 4.2, sold: 670, badge: 'Flash Deal' },
  { id: '10', emoji: '🧅', name: 'Red Onions', price: 42000, unit: 'bag', farmer: 'Garba Farms', state: 'Sokoto', rating: 4.6, sold: 298, badge: 'Bulk Deal' },
];

const FLASH_DEALS = [
  { id: '7', emoji: '🌱', name: 'Soya Beans', original: 80000, price: 72000, unit: 'bag', timeLeft: '03:45:22', pct: 10 },
  { id: '2', emoji: '🌿', name: 'Cassava (Dried)', original: 10000, price: 8500, unit: 'bag', timeLeft: '05:12:09', pct: 15 },
  { id: '8', emoji: '🍚', name: 'White Garri', original: 9500, price: 8000, unit: 'bag', timeLeft: '01:58:44', pct: 16 },
];

const TESTIMONIALS = [
  { quote: "I sold 200 bags of maize in 3 days. The escrow meant I got paid instantly on delivery — no chasing buyers.", name: 'Emeka Okafor', role: 'Maize Farmer · Kaduna', initials: 'EO', bg: 'bg-brand-700' },
  { quote: "I source all my restaurant produce from FarmLink. Quality is consistent and the delivery tracking is amazing.", name: 'Chioma Nwosu', role: 'Restaurant Owner · Lagos', initials: 'CN', bg: 'bg-blue-700' },
  { quote: "FarmLink job matching gave me 3x more trips per week. I earn ₦180K monthly now from farm deliveries alone.", name: 'Bello Abdullahi', role: 'Truck Driver · Kano', initials: 'BA', bg: 'bg-amber-600' },
];

const MARKET_PRICES = [
  { crop: 'White Maize', price: '₦55,000', change: '+4.2%', up: true },
  { crop: 'Tomatoes', price: '₦28,000', change: '-2.1%', up: false },
  { crop: 'Red Onions', price: '₦42,000', change: '+8.5%', up: true },
  { crop: 'Paddy Rice', price: '₦380,000', change: '+1.8%', up: true },
  { crop: 'Palm Oil', price: '₦85,000', change: '-0.9%', up: false },
  { crop: 'Cowpea', price: '₦190,000', change: '+6.3%', up: true },
];

function CountdownTimer() {
  const [time, setTime] = useState({ h: 5, m: 30, s: 0 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="flex items-center gap-1.5">
      {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          <span className="bg-red-600 text-white font-black text-sm px-2 py-0.5 rounded-md w-9 text-center">{v}</span>
          {i < 2 && <span className="text-red-600 font-black">:</span>}
        </span>
      ))}
    </div>
  );
}

function ProductMini({ p }: { p: typeof FEATURED_PRODUCTS[0] }) {
  return (
    <Link href={`/marketplace/${p.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0 w-44">
      <div className="h-32 bg-gradient-to-br from-brand-50 to-amber-50 flex items-center justify-center relative">
        <span className="text-5xl group-hover:scale-110 transition-transform">{p.emoji}</span>
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full ${p.badge === 'Flash Deal' ? 'bg-red-500 text-white' : p.badge === 'Best Seller' ? 'bg-amber-500 text-white' : p.badge === 'Top Rated' ? 'bg-brand-600 text-white' : 'bg-gray-800 text-white'}`}>
          {p.badge}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-ink text-xs leading-tight mb-1 line-clamp-2">{p.name}</p>
        <p className="font-black text-brand-700 text-base">₦{p.price.toLocaleString()}</p>
        <p className="text-gray-400 text-xs">/{p.unit} · {p.state}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-amber-400 text-xs">★</span>
          <span className="text-xs text-gray-500">{p.rating} ({p.sold})</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-brand-950 pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(31,168,69,0.3) 0%, transparent 70%)' }} />
        <div className="container-tight relative z-10 pt-8 pb-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center pb-12">
            <div>
              <div className="inline-flex items-center gap-2.5 bg-brand-800/60 border border-brand-600/40 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-brand-400" /></span>
                <span className="text-brand-200 text-sm font-medium">50,000+ farmers live across 36 states</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white leading-[0.95] tracking-tight mb-5">
                Nigeria&apos;s #1<br /><span className="gradient-text">Agricultural</span><br />Marketplace
              </h1>
              <p className="text-brand-100/70 text-lg leading-relaxed mb-8 max-w-md">
                Buy direct from farms. Sell your harvest. Book logistics. Rent equipment. Everything agriculture — one platform.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/marketplace" className="btn-primary text-base py-3.5 px-7">
                  Shop Now →
                </Link>
                <Link href="/join" className="btn-secondary text-base py-3.5 px-7">
                  Join FarmLink
                </Link>
              </div>
            </div>

            {/* Floating product cards */}
            <div className="hidden lg:flex flex-col gap-3 items-end pb-8">
              {[
                { emoji: '🌽', name: 'White Maize', price: '₦55,000/bag', farmer: 'Emeka Farms · Kaduna', verified: true },
                { emoji: '🍠', name: 'Puna Yam', price: '₦3,500/tuber', farmer: 'Nnamdi Farm Co. · Benue', verified: true },
                { emoji: '🌾', name: 'Paddy Rice', price: '₦38,000/bag', farmer: 'Kebbi Rice Coop. · Kebbi', verified: true },
              ].map((c, i) => (
                <div key={i} className="glass rounded-2xl p-4 flex items-center gap-3 w-72 animate-float" style={{ animationDelay: `${i * 0.8}s` }}>
                  <div className="w-12 h-12 rounded-xl bg-brand-600/30 flex items-center justify-center text-2xl flex-shrink-0">{c.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm">{c.name}</p>
                    <p className="text-brand-300 text-xs">{c.farmer}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-black text-sm">{c.price}</p>
                    {c.verified && <span className="text-brand-400 text-xs">✅ Verified</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="h-16 bg-gradient-to-t from-canvas to-transparent" />
      </section>

      {/* ── WHO ARE YOU ──────────────────────────────────────────────── */}
      <section className="py-10 bg-canvas">
        <div className="container-tight">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-black text-ink">What brings you here?</h2>
            <span className="text-gray-400 text-sm">Select your role to get started</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {ROLES.map(r => (
              <Link
                key={r.key}
                href={`/join?role=${r.key}`}
                className={`group relative bg-gradient-to-br ${r.color} rounded-2xl p-5 text-white overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
              >
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/5 rounded-full translate-x-6 translate-y-6" />
                <span className="text-3xl block mb-3">{r.emoji}</span>
                <p className="font-black text-sm leading-tight">{r.title}</p>
                <p className="text-white/65 text-xs mt-1">{r.sub}</p>
                <p className="text-white/40 text-xs mt-2 border-t border-white/10 pt-2">{r.count}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="py-8 bg-white border-y border-gray-100">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-black text-ink">Browse by Category</h2>
            <Link href="/marketplace" className="text-brand-600 text-sm font-semibold hover:text-brand-700">View all →</Link>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
            {CATEGORIES.map(c => (
              <Link
                key={c.label}
                href={`/marketplace?category=${encodeURIComponent(c.label)}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-brand-50 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-brand-100 flex items-center justify-center text-2xl transition-colors">
                  {c.emoji}
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-brand-700 text-center leading-tight transition-colors">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLASH DEALS ──────────────────────────────────────────────── */}
      <section className="py-10 bg-canvas">
        <div className="container-tight">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h2 className="text-xl font-black text-ink">Flash Deals</h2>
            </div>
            <CountdownTimer />
            <Link href="/marketplace?sort=deals" className="ml-auto text-brand-600 text-sm font-semibold hover:text-brand-700">See all deals →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FLASH_DEALS.map(d => (
              <Link key={d.id} href={`/marketplace/${d.id}`} className="group bg-white rounded-2xl border border-red-100 p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-110 transition-transform">
                    {d.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-ink text-base mb-1">{d.name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="font-black text-red-600 text-xl">₦{d.price.toLocaleString()}</span>
                      <span className="text-gray-400 text-sm line-through">₦{d.original.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-400 text-xs">/{d.unit}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">{d.pct}% OFF</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Selling fast</span>
                    <span className="text-red-500 font-semibold">Ends in {d.timeLeft}</span>
                  </div>
                  <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${60 + Math.random() * 30}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────────── */}
      <section className="py-10 bg-white border-y border-gray-100">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-ink">🔥 Trending This Week</h2>
            <Link href="/marketplace" className="text-brand-600 text-sm font-semibold hover:text-brand-700">See all →</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
            {FEATURED_PRODUCTS.map(p => <ProductMini key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* ── LIVE MARKET PRICES ───────────────────────────────────────── */}
      <section className="py-10 bg-canvas">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-ink">📊 Live Market Prices</h2>
              <p className="text-gray-400 text-sm">Mile 12, Bodija & Kasuwan Shanu — updated hourly</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Live
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MARKET_PRICES.map(p => (
              <div key={p.crop} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <p className="font-semibold text-ink text-sm mb-2">{p.crop}</p>
                <p className="font-black text-ink text-lg">{p.price}</p>
                <p className="text-xs text-gray-400">per tonne</p>
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${p.up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  <span>{p.up ? '↑' : '↓'}</span>{p.change}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR FARMERS BANNER ───────────────────────────────────────── */}
      <section id="for-farmers" className="py-12 bg-brand-950">
        <div className="container-tight">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-brand-400 text-sm font-semibold uppercase tracking-widest">For Farmers</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-4 leading-tight">
                List your harvest.<br />Reach 50,000+ buyers.<br /><span className="gradient-text">Get paid instantly.</span>
              </h2>
              <p className="text-brand-200/60 text-base mb-7">Post your produce in 3 taps, set your price, and let buyers come to you. Escrow holds the money until delivery — no fraud.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/join?role=farmer" className="btn-primary">Start Selling Free →</Link>
                <Link href="/dashboard/farmer" className="btn-secondary">Farmer Dashboard</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📸', title: 'Post in 3 taps', desc: 'Photo, price, quantity — your listing goes live instantly' },
                { icon: '💰', title: 'Secure payment', desc: 'Money held in escrow, released on delivery. No chasing buyers' },
                { icon: '🤖', title: 'AI Crop Scanner', desc: 'Diagnose disease from a photo. Powered by AI.' },
                { icon: '📊', title: 'Market prices', desc: 'See commodity prices from 40+ Nigerian markets live' },
              ].map(f => (
                <div key={f.title} className="bg-brand-800/40 border border-brand-700/30 rounded-2xl p-4">
                  <span className="text-2xl block mb-2">{f.icon}</span>
                  <p className="font-bold text-white text-sm mb-1">{f.title}</p>
                  <p className="text-brand-300/60 text-xs leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="container-tight">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-ink">Real people. Real results.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-canvas rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-0.5 mb-4">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <blockquote className="text-gray-700 text-sm leading-relaxed mb-5">
                  <span className="text-brand-200 text-4xl font-serif absolute -mt-2 -ml-1">&ldquo;</span>
                  <span className="relative">{t.quote}</span>
                </blockquote>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className={`w-9 h-9 rounded-full ${t.bg} flex items-center justify-center text-white font-bold text-xs`}>{t.initials}</div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ─────────────────────────────────────────────── */}
      <section id="download" className="py-16 bg-brand-950">
        <div className="container-tight text-center">
          <h2 className="text-4xl font-black text-white mb-3">Get the mobile app</h2>
          <p className="text-brand-200/60 text-lg max-w-xl mx-auto mb-8">GPS tracking, AI crop scanner, push notifications — features that work better on mobile.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#" className="flex items-center gap-3 bg-white rounded-2xl px-7 py-4 hover:bg-gray-50 transition-colors shadow-elevated">
              <span className="text-3xl">🤖</span>
              <div className="text-left">
                <p className="text-gray-400 text-xs uppercase tracking-wide">Get it on</p>
                <p className="text-ink font-bold text-lg">Google Play</p>
              </div>
            </a>
            <Link href="/marketplace" className="flex items-center gap-3 bg-brand-600 hover:bg-brand-500 rounded-2xl px-7 py-4 transition-colors">
              <span className="text-3xl">🌐</span>
              <div className="text-left">
                <p className="text-brand-200/70 text-xs uppercase tracking-wide">Or browse on</p>
                <p className="text-white font-bold text-lg">Web Marketplace</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
