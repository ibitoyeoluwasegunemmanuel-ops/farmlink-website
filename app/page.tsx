'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

/* ─── DATA ─────────────────────────────────────────────── */

const PRODUCE_LISTINGS = [
  { id: 'h1', emoji: '🌽', name: 'Premium White Maize', price: 55000, unit: 'bag', farmer: 'Emeka Okafor Farms', state: 'Kaduna', verified: true, rating: 4.8, sold: 312, badge: 'Best Seller', qty: 500, quality: 'Premium' },
  { id: 'h2', emoji: '🌾', name: 'Paddy Rice (Kebbi)', price: 38000, unit: 'bag', farmer: 'Kebbi Rice Cooperative', state: 'Kebbi', verified: true, rating: 4.9, sold: 890, badge: 'Top Rated', qty: 2000, quality: 'Grade A' },
  { id: 'h3', emoji: '🍠', name: 'Puna Yam Tubers', price: 3500, unit: 'tuber', farmer: 'Nnamdi Farm Co.', state: 'Benue', verified: true, rating: 4.9, sold: 540, badge: 'Fresh', qty: 800, quality: 'Premium' },
  { id: 'h4', emoji: '🍅', name: 'Roma Tomatoes', price: 12000, unit: 'crate', farmer: 'Kola Fresh Farms', state: 'Ogun', verified: false, rating: 4.2, sold: 670, badge: 'Flash Deal', qty: 200, quality: 'Standard' },
  { id: 'h5', emoji: '🧅', name: 'Dry Red Onions', price: 42000, unit: 'bag', farmer: 'Garba Farms', state: 'Sokoto', verified: true, rating: 4.6, sold: 298, badge: 'Bulk Deal', qty: 600, quality: 'Grade A' },
  { id: 'h6', emoji: '🥜', name: 'Kano Groundnuts', price: 22000, unit: 'bag', farmer: 'Suleiman Farms', state: 'Kano', verified: true, rating: 4.7, sold: 405, badge: 'Verified', qty: 1000, quality: 'Premium' },
  { id: 'h7', emoji: '🫘', name: 'Honey Beans', price: 45000, unit: 'bag', farmer: 'Musa Bean Farm', state: 'Kwara', verified: true, rating: 4.7, sold: 188, badge: 'New', qty: 350, quality: 'Grade A' },
  { id: 'h8', emoji: '🫚', name: 'Red Palm Oil', price: 85000, unit: 'drum', farmer: 'Niger Delta Produce', state: 'Rivers', verified: true, rating: 4.5, sold: 210, badge: 'Premium', qty: 80, quality: 'Premium' },
];

const TRANSPORT_LISTINGS = [
  { id: 't1', name: 'Ibrahim Musa', avatar: 'IM', vehicle: '10-Tonne Cargo Truck', routes: ['Kano → Lagos', 'Kano → Abuja'], rate: 85000, rateUnit: 'per trip', available: true, trips: 47, rating: 4.9, verified: true, capacity: '10,000 kg' },
  { id: 't2', name: 'Adamu Hassan', avatar: 'AH', vehicle: '5-Tonne Pickup Van', routes: ['Kaduna → Abuja', 'Kaduna → Kano'], rate: 45000, rateUnit: 'per trip', available: true, trips: 83, rating: 4.8, verified: true, capacity: '5,000 kg' },
  { id: 't3', name: 'Chukwu Drivers Ltd', avatar: 'CD', vehicle: 'Refrigerated Truck', routes: ['Anambra → Lagos', 'Anambra → Abuja'], rate: 120000, rateUnit: 'per trip', available: false, trips: 22, rating: 4.7, verified: true, capacity: '8,000 kg' },
  { id: 't4', name: 'Bello Abdullahi', avatar: 'BA', vehicle: 'Open Flatbed Truck', routes: ['Katsina → All States'], rate: 60000, rateUnit: 'per trip', available: true, trips: 134, rating: 4.6, verified: true, capacity: '12,000 kg' },
  { id: 't5', name: 'Tunde Logistics', avatar: 'TL', vehicle: 'Mini Van (3-Tonne)', routes: ['Lagos → South West'], rate: 35000, rateUnit: 'per trip', available: true, trips: 209, rating: 4.9, verified: true, capacity: '3,000 kg' },
  { id: 't6', name: 'Hauwa Transport', avatar: 'HT', vehicle: 'Agricultural Tanker', routes: ['Gombe → North East'], rate: 95000, rateUnit: 'per trip', available: true, trips: 31, rating: 4.5, verified: false, capacity: '15,000 L' },
];

const EQUIPMENT_LISTINGS = [
  { id: 'eq1', emoji: '🚜', name: 'John Deere 5055E Tractor', owner: 'Kaduna Agri-Services', state: 'Kaduna', dailyRate: 45000, weeklyRate: 280000, available: true, bookings: 34, condition: 'Excellent', type: 'Tractor' },
  { id: 'eq2', emoji: '💧', name: 'Honda WP20X Irrigation Pump', owner: 'IrrigaTech NG', state: 'Kano', dailyRate: 8500, weeklyRate: 50000, available: true, bookings: 67, condition: 'Good', type: 'Irrigation' },
  { id: 'eq3', emoji: '⚙️', name: 'Maize Thresher (5T/hr)', owner: 'Northern Farm Tools', state: 'Kaduna', dailyRate: 25000, weeklyRate: 150000, available: false, bookings: 18, condition: 'Good', type: 'Thresher' },
  { id: 'eq4', emoji: '🌾', name: 'Rice Combine Harvester', owner: 'Kebbi Agro-Mech', state: 'Kebbi', dailyRate: 80000, weeklyRate: 480000, available: true, bookings: 9, condition: 'Excellent', type: 'Harvester' },
  { id: 'eq5', emoji: '🔧', name: 'Power Sprayer (20L)', owner: 'AgroTools Ibadan', state: 'Oyo', dailyRate: 4500, weeklyRate: 28000, available: true, bookings: 142, condition: 'Good', type: 'Sprayer' },
  { id: 'eq6', emoji: '⚡', name: '15KVA Generator (Farm)', owner: 'PowerFarm Ltd', state: 'Lagos', dailyRate: 15000, weeklyRate: 90000, available: true, bookings: 55, condition: 'Good', type: 'Generator' },
];

const INVESTMENT_LISTINGS = [
  { id: 'inv1', title: 'Maize Farm Expansion — 50 Hectares', farmer: 'Ibrahim Musa Farms', state: 'Kano', target: 2500000, raised: 1750000, returnPct: 18, durationMonths: 6, risk: 'Low', category: 'Grain Farming', minInvestment: 50000, investors: 12 },
  { id: 'inv2', title: 'Poultry Processing Plant — Phase 2', farmer: 'Bola Adeyemi', state: 'Ogun', target: 8000000, raised: 3200000, returnPct: 24, durationMonths: 12, risk: 'Medium', category: 'Livestock', minInvestment: 100000, investors: 8 },
  { id: 'inv3', title: 'Tomato Greenhouse Project', farmer: 'Emeka Okafor', state: 'Anambra', target: 1500000, raised: 1500000, returnPct: 22, durationMonths: 4, risk: 'Low', category: 'Horticulture', minInvestment: 25000, investors: 31 },
  { id: 'inv4', title: 'Rice Paddy — Ebonyi State', farmer: 'Ifeanyi Rice Farms', state: 'Ebonyi', target: 3000000, raised: 900000, returnPct: 20, durationMonths: 8, risk: 'Low', category: 'Grain Farming', minInvestment: 50000, investors: 6 },
  { id: 'inv5', title: 'Irrigation Infrastructure — Katsina', farmer: 'Yusuf Bello Farms', state: 'Katsina', target: 5000000, raised: 800000, returnPct: 15, durationMonths: 8, risk: 'Low', category: 'Infrastructure', minInvestment: 100000, investors: 4 },
  { id: 'inv6', title: 'Cocoa Export Farm', farmer: 'Ondo Premium Cocoa', state: 'Ondo', target: 6000000, raised: 4200000, returnPct: 28, durationMonths: 10, risk: 'Medium', category: 'Cash Crops', minInvestment: 75000, investors: 19 },
];

const LAND_LISTINGS = [
  { id: 'l1', emoji: '🏡', title: '12 Hectares Irrigated Farmland', owner: 'Bello Lands Ltd', state: 'Kano', annualRent: 280000, salePrice: null, soilType: 'Loamy Clay', waterSource: 'Borehole', verified: true },
  { id: 'l2', emoji: '🌳', title: '5 Hectares — Plantain Ready', owner: 'Akin Farmlands', state: 'Ogun', annualRent: 120000, salePrice: 4500000, soilType: 'Sandy Loam', waterSource: 'River Access', verified: true },
  { id: 'l3', emoji: '🌾', title: '30 Hectares Rice-Suitable', owner: 'Northern Plots', state: 'Kebbi', annualRent: 450000, salePrice: null, soilType: 'Clay', waterSource: 'Canal Irrigation', verified: false },
  { id: 'l4', emoji: '🏕️', title: '8 Hectares Greenhouse-Ready', owner: 'Delta Farmland Corp', state: 'Delta', annualRent: 200000, salePrice: 7200000, soilType: 'Rich Loam', waterSource: 'Overhead Irrigation', verified: true },
];

const MARKET_PRICES = [
  { crop: 'White Maize', price: '₦55,000', change: '+4.2%', up: true },
  { crop: 'Tomatoes', price: '₦28,000', change: '-2.1%', up: false },
  { crop: 'Red Onions', price: '₦42,000', change: '+8.5%', up: true },
  { crop: 'Paddy Rice', price: '₦380,000', change: '+1.8%', up: true },
  { crop: 'Palm Oil', price: '₦85,000', change: '-0.9%', up: false },
  { crop: 'Cowpea', price: '₦190,000', change: '+6.3%', up: true },
];

const CATEGORIES = [
  { emoji: '🌽', label: 'Grains', filter: 'produce' },
  { emoji: '🥬', label: 'Vegetables', filter: 'produce' },
  { emoji: '🍊', label: 'Fruits', filter: 'produce' },
  { emoji: '🍠', label: 'Tubers', filter: 'produce' },
  { emoji: '🚛', label: 'Transport', filter: 'transport' },
  { emoji: '🚜', label: 'Equipment', filter: 'equipment' },
  { emoji: '💼', label: 'Investments', filter: 'invest' },
  { emoji: '🏡', label: 'Farm Land', filter: 'land' },
  { emoji: '🫘', label: 'Legumes', filter: 'produce' },
  { emoji: '🌿', label: 'Cash Crops', filter: 'produce' },
  { emoji: '🌱', label: 'Seedlings', filter: 'produce' },
  { emoji: '🐄', label: 'Livestock', filter: 'produce' },
];

/* ─── COMPONENTS ──────────────────────────────────────── */

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
          <span className="bg-red-600 text-white font-black text-sm px-2 py-0.5 rounded-md w-9 text-center tabular-nums">{v}</span>
          {i < 2 && <span className="text-red-600 font-black">:</span>}
        </span>
      ))}
    </div>
  );
}

function ProduceCard({ item }: { item: typeof PRODUCE_LISTINGS[0] }) {
  return (
    <Link href={`/marketplace/${item.id}`} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0">
      <div className="h-36 bg-gradient-to-br from-brand-50 to-amber-50 flex items-center justify-center relative">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
        <div className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badge === 'Flash Deal' ? 'bg-red-500 text-white' : item.badge === 'Best Seller' || item.badge === 'Premium' ? 'bg-amber-500 text-white' : item.badge === 'Top Rated' ? 'bg-brand-600 text-white' : 'bg-gray-800/80 text-white'}`}>
          {item.badge}
        </div>
      </div>
      <div className="p-3.5">
        <p className="font-bold text-ink text-sm leading-snug mb-0.5">{item.name}</p>
        <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
          {item.verified && <span className="text-brand-600">✓</span>} {item.farmer} · {item.state}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-black text-brand-700 text-base">₦{item.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/{item.unit}</span></p>
          <span className="text-xs text-gray-400">{item.sold} sold</span>
        </div>
      </div>
    </Link>
  );
}

function TransportCard({ item }: { item: typeof TRANSPORT_LISTINGS[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {item.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="font-bold text-ink text-sm truncate">{item.name}</p>
              {item.verified && <span className="text-brand-600 text-xs">✓</span>}
            </div>
            <p className="text-gray-400 text-xs truncate">{item.vehicle}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${item.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {item.available ? 'Available' : 'Busy'}
          </span>
        </div>
        <div className="space-y-1 mb-3">
          {item.routes.map(r => (
            <p key={r} className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="text-amber-500">→</span> {r}
            </p>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <p className="font-black text-amber-700 text-base">₦{item.rate.toLocaleString()}</p>
            <p className="text-gray-400 text-xs">{item.rateUnit} · {item.capacity}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">⭐ {item.rating} · {item.trips} trips</p>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        <Link href="/join?role=transporter" className={`w-full py-2.5 rounded-xl text-xs font-bold text-center block transition-all ${item.available ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'}`}>
          {item.available ? 'Book Driver →' : 'Currently Busy'}
        </Link>
      </div>
    </div>
  );
}

function EquipmentCard({ item }: { item: typeof EQUIPMENT_LISTINGS[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0">
      <div className="h-32 bg-gradient-to-br from-violet-50 to-slate-50 flex items-center justify-center relative">
        <span className="text-5xl">{item.emoji}</span>
        <div className={`absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.available ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}>
          {item.available ? '✓ Available' : 'Rented Out'}
        </div>
      </div>
      <div className="p-3.5">
        <p className="font-bold text-ink text-sm leading-snug mb-0.5">{item.name}</p>
        <p className="text-gray-400 text-xs mb-3">{item.owner} · {item.state} · {item.condition}</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-violet-50 rounded-lg px-2.5 py-1.5 text-center">
            <p className="font-black text-violet-700 text-sm">₦{item.dailyRate.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">per day</p>
          </div>
          <div className="bg-violet-50 rounded-lg px-2.5 py-1.5 text-center">
            <p className="font-black text-violet-700 text-sm">₦{item.weeklyRate.toLocaleString()}</p>
            <p className="text-[10px] text-gray-400">per week</p>
          </div>
        </div>
        <Link href="/join?role=equipment_owner" className={`w-full py-2 rounded-xl text-xs font-bold text-center block transition-all ${item.available ? 'bg-violet-700 hover:bg-violet-600 text-white' : 'bg-gray-100 text-gray-400 pointer-events-none'}`}>
          {item.available ? 'Hire Now →' : 'Not Available'}
        </Link>
      </div>
    </div>
  );
}

function InvestmentCard({ item }: { item: typeof INVESTMENT_LISTINGS[0] }) {
  const pct = Math.round((item.raised / item.target) * 100);
  const full = item.raised >= item.target;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0">
      <div className="bg-gradient-to-br from-brand-950 to-brand-800 p-4">
        <div className="flex items-start justify-between mb-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.risk === 'Low' ? 'bg-green-400/20 text-green-300' : 'bg-amber-400/20 text-amber-300'}`}>
            {item.risk} Risk
          </span>
          <span className="text-[10px] text-brand-300 font-semibold">{item.category}</span>
        </div>
        <p className="font-black text-white text-sm leading-snug mb-1">{item.title}</p>
        <p className="text-brand-400 text-xs">by {item.farmer} · {item.state}</p>
      </div>
      <div className="p-3.5">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Returns</p>
            <p className="font-black text-green-700 text-base">{item.returnPct}%</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 mb-0.5">Duration</p>
            <p className="font-black text-ink text-base">{item.durationMonths} months</p>
          </div>
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>₦{item.raised.toLocaleString()} raised</span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div className={`h-1.5 rounded-full ${full ? 'bg-gray-400' : 'bg-brand-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Min. ₦{item.minInvestment.toLocaleString()} · {item.investors} investors</p>
        </div>
        <Link href="/dashboard/investor" className={`w-full py-2 rounded-xl text-xs font-bold text-center block transition-all ${full ? 'bg-gray-100 text-gray-400 pointer-events-none' : 'bg-brand-600 hover:bg-brand-500 text-white'}`}>
          {full ? '✓ Fully Funded' : 'Invest Now →'}
        </Link>
      </div>
    </div>
  );
}

function LandCard({ item }: { item: typeof LAND_LISTINGS[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden flex-shrink-0">
      <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center relative">
        <span className="text-5xl">{item.emoji}</span>
        {item.verified && <div className="absolute top-2.5 left-2.5 bg-brand-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ Verified</div>}
        {item.salePrice && <div className="absolute top-2.5 right-2.5 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">For Sale</div>}
      </div>
      <div className="p-3.5">
        <p className="font-bold text-ink text-sm leading-snug mb-0.5">{item.title}</p>
        <p className="text-gray-400 text-xs mb-2">{item.owner} · {item.state}</p>
        <div className="grid grid-cols-2 gap-1.5 mb-3 text-xs text-gray-500">
          <span className="bg-gray-50 px-2 py-1 rounded-lg">🌱 {item.soilType}</span>
          <span className="bg-gray-50 px-2 py-1 rounded-lg">💧 {item.waterSource}</span>
        </div>
        <div className="flex justify-between items-end mb-3">
          <div>
            <p className="text-[10px] text-gray-400">Annual Rent</p>
            <p className="font-black text-brand-700">₦{item.annualRent.toLocaleString()}</p>
          </div>
          {item.salePrice && (
            <div className="text-right">
              <p className="text-[10px] text-gray-400">Sale Price</p>
              <p className="font-black text-amber-700">₦{item.salePrice.toLocaleString()}</p>
            </div>
          )}
        </div>
        <Link href="/join?role=farmer" className="w-full py-2 rounded-xl text-xs font-bold text-center block bg-brand-600 hover:bg-brand-500 text-white transition-all">
          Enquire →
        </Link>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────── */
export default function HomePage() {
  const [discoverTab, setDiscoverTab] = useState<'all' | 'produce' | 'transport' | 'equipment' | 'invest' | 'land'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);

  const TABS = [
    { key: 'all', label: '⚡ All', color: 'bg-brand-700 text-white' },
    { key: 'produce', label: '🌾 Produce', color: 'bg-green-600 text-white' },
    { key: 'transport', label: '🚛 Transport', color: 'bg-amber-600 text-white' },
    { key: 'equipment', label: '⚙️ Equipment', color: 'bg-violet-700 text-white' },
    { key: 'invest', label: '💼 Invest', color: 'bg-brand-600 text-white' },
    { key: 'land', label: '🏡 Land', color: 'bg-emerald-700 text-white' },
  ] as const;

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative bg-brand-950 overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/8 blur-3xl" />
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="container-tight relative z-10 py-16 md:py-20">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/25 rounded-full px-4 py-1.5 text-sm text-brand-300 font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              Nigeria's #1 Agricultural Marketplace — 12,000+ Verified Farmers
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] mb-5">
              Buy Farm Produce.<br />
              <span className="text-brand-400">Hire Transport.</span>{' '}
              <span className="text-amber-400">Rent Equipment.</span><br />
              Fund Farms. All in One.
            </h1>
            <p className="text-brand-200/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              FarmLink connects buyers, farmers, truck drivers, equipment owners, and investors on one secure platform. Browse. Buy. Earn.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link href="/marketplace" className="btn-primary text-base px-8 py-3.5 w-full sm:w-auto text-center">
                Browse Marketplace →
              </Link>
              <Link href="/join" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3.5 rounded-2xl transition-all text-base w-full sm:w-auto text-center">
                Join as Farmer / Driver / Investor
              </Link>
            </div>

            {/* Who are you? */}
            <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
              {[
                { icon: '🌾', label: 'Farmer', href: '/join?role=farmer' },
                { icon: '🛒', label: 'Buyer', href: '/marketplace' },
                { icon: '🚛', label: 'Driver', href: '/join?role=transporter' },
                { icon: '⚙️', label: 'Equipment', href: '/join?role=equipment_owner' },
                { icon: '💼', label: 'Investor', href: '/join?role=investor' },
              ].map(r => (
                <Link key={r.label} href={r.href} className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl py-2.5 px-1 text-center transition-all group">
                  <span className="text-xl block mb-0.5 group-hover:scale-110 transition-transform">{r.icon}</span>
                  <span className="text-white/60 text-[11px] font-medium">{r.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Market prices ticker */}
        <div className="border-t border-white/8 bg-black/30 py-2.5 overflow-hidden">
          <div className="ticker-wrap">
            <div className="ticker-inner">
              {[...MARKET_PRICES, ...MARKET_PRICES].map((p, i) => (
                <span key={i} className="inline-flex items-center gap-2 mx-6 text-sm whitespace-nowrap">
                  <span className="text-brand-300 font-semibold">{p.crop}</span>
                  <span className="text-white font-black">{p.price}</span>
                  <span className={`font-bold ${p.up ? 'text-green-400' : 'text-red-400'}`}>{p.change}</span>
                  <span className="text-white/15">|</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK CATEGORY ICONS ─────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-5">
        <div className="container-tight">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(c => (
              <button
                key={c.label}
                onClick={() => setDiscoverTab(c.filter as any)}
                className="flex flex-col items-center gap-1 flex-shrink-0 hover:opacity-100 opacity-75 hover:scale-105 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-50 hover:bg-brand-50 flex items-center justify-center text-2xl border border-gray-100 hover:border-brand-200 transition-colors">
                  {c.emoji}
                </div>
                <span className="text-[10px] font-medium text-gray-600 whitespace-nowrap">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCOVERY SECTION ────────────────────────────── */}
      <section className="section">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-ink">Discover FarmLink</h2>
              <p className="text-gray-500 text-sm mt-0.5">Produce, transport, equipment, investments — all in one place</p>
            </div>
            <Link href="/marketplace" className="hidden sm:block text-sm font-semibold text-brand-600 hover:text-brand-700">See all →</Link>
          </div>

          {/* Tab pills */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setDiscoverTab(t.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  discoverTab === t.key ? t.color + ' shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Produce */}
          {(discoverTab === 'all' || discoverTab === 'produce') && (
            <div className="mb-8">
              {discoverTab === 'all' && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-ink flex items-center gap-2">🌾 Farm Produce <span className="text-sm font-normal text-gray-400">{PRODUCE_LISTINGS.length} listings</span></h3>
                  <button onClick={() => setDiscoverTab('produce')} className="text-xs text-brand-600 font-semibold">See all →</button>
                </div>
              )}
              <div className={discoverTab === 'all' ? 'flex gap-3 overflow-x-auto pb-2' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'}>
                {(discoverTab === 'all' ? PRODUCE_LISTINGS.slice(0, 6) : PRODUCE_LISTINGS).map(item => (
                  <div key={item.id} className={discoverTab === 'all' ? 'flex-shrink-0 w-44' : ''}>
                    <ProduceCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transport */}
          {(discoverTab === 'all' || discoverTab === 'transport') && (
            <div className="mb-8">
              {discoverTab === 'all' && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-ink flex items-center gap-2">🚛 Available Transporters <span className="text-sm font-normal text-gray-400">{TRANSPORT_LISTINGS.filter(t => t.available).length} available now</span></h3>
                  <button onClick={() => setDiscoverTab('transport')} className="text-xs text-brand-600 font-semibold">See all →</button>
                </div>
              )}
              {discoverTab === 'all' ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {TRANSPORT_LISTINGS.slice(0, 4).map(item => (
                    <div key={item.id} className="flex-shrink-0 w-64">
                      <TransportCard item={item} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {TRANSPORT_LISTINGS.map(item => <TransportCard key={item.id} item={item} />)}
                </div>
              )}
            </div>
          )}

          {/* Equipment */}
          {(discoverTab === 'all' || discoverTab === 'equipment') && (
            <div className="mb-8">
              {discoverTab === 'all' && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-ink flex items-center gap-2">⚙️ Equipment for Hire <span className="text-sm font-normal text-gray-400">{EQUIPMENT_LISTINGS.filter(e => e.available).length} available</span></h3>
                  <button onClick={() => setDiscoverTab('equipment')} className="text-xs text-brand-600 font-semibold">See all →</button>
                </div>
              )}
              <div className={discoverTab === 'all' ? 'flex gap-3 overflow-x-auto pb-2' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4'}>
                {(discoverTab === 'all' ? EQUIPMENT_LISTINGS.slice(0, 4) : EQUIPMENT_LISTINGS).map(item => (
                  <div key={item.id} className={discoverTab === 'all' ? 'flex-shrink-0 w-52' : ''}>
                    <EquipmentCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invest */}
          {(discoverTab === 'all' || discoverTab === 'invest') && (
            <div className="mb-8">
              {discoverTab === 'all' && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-ink flex items-center gap-2">💼 Investment Opportunities <span className="text-sm font-normal text-gray-400">15–28% returns</span></h3>
                  <button onClick={() => setDiscoverTab('invest')} className="text-xs text-brand-600 font-semibold">See all →</button>
                </div>
              )}
              <div className={discoverTab === 'all' ? 'flex gap-3 overflow-x-auto pb-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
                {(discoverTab === 'all' ? INVESTMENT_LISTINGS.slice(0, 4) : INVESTMENT_LISTINGS).map(item => (
                  <div key={item.id} className={discoverTab === 'all' ? 'flex-shrink-0 w-60' : ''}>
                    <InvestmentCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Land */}
          {(discoverTab === 'all' || discoverTab === 'land') && (
            <div className="mb-4">
              {discoverTab === 'all' && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-ink flex items-center gap-2">🏡 Farm Land <span className="text-sm font-normal text-gray-400">Rent or buy</span></h3>
                  <button onClick={() => setDiscoverTab('land')} className="text-xs text-brand-600 font-semibold">See all →</button>
                </div>
              )}
              <div className={discoverTab === 'all' ? 'flex gap-3 overflow-x-auto pb-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
                {(discoverTab === 'all' ? LAND_LISTINGS : LAND_LISTINGS).map(item => (
                  <div key={item.id} className={discoverTab === 'all' ? 'flex-shrink-0 w-56' : ''}>
                    <LandCard item={item} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FLASH DEALS ──────────────────────────────────── */}
      <section className="section bg-white border-y border-gray-100">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <span className="bg-red-500 text-white font-black text-xs px-2.5 py-1 rounded-lg animate-pulse">FLASH SALE</span>
              <h2 className="text-xl font-black text-ink">Today's Best Deals</h2>
            </div>
            <CountdownTimer />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { id: 'h1', emoji: '🌱', name: 'Soya Beans', original: 80000, price: 72000, unit: 'bag', pct: 10 },
              { id: 'h2', emoji: '🌿', name: 'Cassava (Dried)', original: 10000, price: 8500, unit: 'bag', pct: 15 },
              { id: 'h3', emoji: '🍚', name: 'White Garri', original: 9500, price: 8000, unit: 'bag', pct: 16 },
            ].map(d => (
              <Link key={d.id} href={`/marketplace/${d.id}`} className="bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 rounded-2xl p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
                <div className="flex items-start gap-4">
                  <span className="text-5xl">{d.emoji}</span>
                  <div className="flex-1">
                    <p className="font-black text-ink text-base mb-1">{d.name}</p>
                    <p className="font-black text-brand-700 text-xl">₦{d.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/{d.unit}</span></p>
                    <p className="text-gray-400 text-xs line-through">₦{d.original.toLocaleString()}</p>
                  </div>
                  <span className="bg-red-500 text-white font-black text-sm px-2.5 py-1 rounded-xl">{d.pct}% OFF</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR EVERY ROLE ───────────────────────────────── */}
      <section className="section bg-brand-950">
        <div className="container-tight">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">One Platform. Every Role.</h2>
            <p className="text-brand-300/70 text-base max-w-xl mx-auto">Whether you grow it, move it, own it, or invest in it — FarmLink has your place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { emoji: '🌾', role: 'Farmer', desc: 'List your harvest, land, and equipment. Get paid directly — no middlemen.', cta: 'Start Selling', href: '/join?role=farmer', color: 'border-brand-600/30 hover:border-brand-500/50' },
              { emoji: '🛒', role: 'Buyer / Trader', desc: 'Source fresh produce from 12,000+ verified farmers across Nigeria.', cta: 'Browse Produce', href: '/marketplace', color: 'border-blue-600/30 hover:border-blue-500/50' },
              { emoji: '🚛', role: 'Truck Driver', desc: 'Get matched with farm delivery jobs on your route. Earn more per week.', cta: 'Start Driving', href: '/join?role=transporter', color: 'border-amber-600/30 hover:border-amber-500/50' },
              { emoji: '⚙️', role: 'Equipment Owner', desc: 'Rent out your tractor, pump or harvester. Earn daily and weekly income.', cta: 'List Equipment', href: '/join?role=equipment_owner', color: 'border-violet-600/30 hover:border-violet-500/50' },
              { emoji: '💼', role: 'Investor', desc: 'Fund verified farms and earn 15–30% returns per harvest cycle.', cta: 'View Opportunities', href: '/dashboard/investor', color: 'border-rose-600/30 hover:border-rose-500/50' },
              { emoji: '🏡', role: 'Land Owner', desc: 'Rent or sell your farmland to verified farmers and cooperatives.', cta: 'List Your Land', href: '/join?role=farmer', color: 'border-emerald-600/30 hover:border-emerald-500/50' },
            ].map(r => (
              <Link key={r.role} href={r.href} className={`bg-white/5 hover:bg-white/8 border ${r.color} border rounded-2xl p-5 group transition-all`}>
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">{r.emoji}</span>
                <h3 className="font-black text-white text-lg mb-2">{r.role}</h3>
                <p className="text-brand-300/60 text-sm mb-4 leading-relaxed">{r.desc}</p>
                <span className="text-brand-400 text-sm font-semibold group-hover:text-brand-300 transition-colors">{r.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-tight">
          <h2 className="text-3xl font-black text-ink text-center mb-8">What Our Users Say</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { quote: "I sold 200 bags of maize in 3 days. The escrow meant I got paid the moment delivery was confirmed — no chasing buyers.", name: 'Emeka Okafor', role: 'Maize Farmer · Kaduna', initials: 'EO', bg: 'bg-brand-700' },
              { quote: "I source all my restaurant produce from FarmLink. The quality is consistent and I can track every delivery in real-time.", name: 'Chioma Nwosu', role: 'Restaurant Owner · Lagos', initials: 'CN', bg: 'bg-blue-700' },
              { quote: "FarmLink trip-matching gave me 3× more jobs per week. I now earn ₦180K monthly from farm deliveries alone.", name: 'Bello Abdullahi', role: 'Truck Driver · Kano', initials: 'BA', bg: 'bg-amber-600' },
            ].map(t => (
              <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <p className="text-gray-600 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>{t.initials}</div>
                  <div>
                    <p className="font-bold text-ink text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ─────────────────────────────────── */}
      <section id="download" className="section bg-gradient-to-br from-brand-900 via-brand-950 to-black">
        <div className="container-tight text-center">
          <p className="text-4xl mb-4">📱</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Get the FarmLink App</h2>
          <p className="text-brand-300/70 text-base max-w-lg mx-auto mb-8">The full marketplace, logistics, AI assistant, and investment tools — in your pocket. Available on Android.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="#" className="bg-white text-ink font-bold px-8 py-3.5 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
              <span className="text-xl">🤖</span> Download for Android
            </a>
            <Link href="/marketplace" className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
              <span className="text-xl">🌐</span> Use Web App
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
