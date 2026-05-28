'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ShareModal from '../../components/ShareModal';
import MakeOfferModal from '../../components/MakeOfferModal';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const EQUIPMENT_LIST = [
  { id: 'eq1', emoji: '🚜', name: 'John Deere 5055E Tractor', owner: 'Kaduna Agri-Services', ownerInitials: 'KA', ownerBg: 'bg-green-700', state: 'Kaduna', town: 'Zaria', dailyRate: 45000, weeklyRate: 280000, deposit: 50000, available: true, negotiable: true, bookings: 34, condition: 'Excellent', type: 'Tractor', hp: '55 HP', capacity: '3 hectares/day', features: ['GPS Navigation', 'Air-conditioned cab', 'Hydraulic lift', 'PTO shaft'], rating: 4.9, reviews: 28, yearMade: 2021 },
  { id: 'eq2', emoji: '💧', name: 'Honda WP20X Irrigation Pump', owner: 'IrrigaTech Nigeria', ownerInitials: 'IT', ownerBg: 'bg-blue-600', state: 'Kano', town: 'Nassarawa', dailyRate: 8500, weeklyRate: 50000, deposit: 10000, available: true, negotiable: false, bookings: 67, condition: 'Good', type: 'Irrigation', hp: '5.5 HP', capacity: '30,000 L/hour', features: ['Self-priming', '2-inch outlet', 'Fuel efficient', 'Portable'], rating: 4.7, reviews: 51, yearMade: 2020 },
  { id: 'eq3', emoji: '⚙️', name: 'Maize Thresher (5T/hr)', owner: 'Northern Farm Tools', ownerInitials: 'NF', ownerBg: 'bg-amber-700', state: 'Kaduna', town: 'Kafanchan', dailyRate: 25000, weeklyRate: 150000, deposit: 30000, available: false, negotiable: true, bookings: 18, condition: 'Good', type: 'Thresher', hp: '15 HP', capacity: '5,000 kg/hour', features: ['Diesel powered', 'Adjustable screen', 'Grain collector', 'Easy cleaning'], rating: 4.6, reviews: 14, yearMade: 2019 },
  { id: 'eq4', emoji: '🌾', name: 'Rice Combine Harvester', owner: 'Kebbi Agro-Mech', ownerInitials: 'KM', ownerBg: 'bg-brand-700', state: 'Kebbi', town: 'Birnin Kebbi', dailyRate: 80000, weeklyRate: 480000, deposit: 100000, available: true, negotiable: false, bookings: 9, condition: 'Excellent', type: 'Harvester', hp: '85 HP', capacity: '2 hectares/hour', features: ['Air-conditioned cab', 'GPS guidance', 'Grain tank 3,000L', 'Auto header height'], rating: 4.9, reviews: 7, yearMade: 2022 },
  { id: 'eq5', emoji: '🔧', name: 'Power Sprayer (20L Knapsack)', owner: 'AgroTools Ibadan', ownerInitials: 'AI', ownerBg: 'bg-teal-600', state: 'Oyo', town: 'Ibadan', dailyRate: 4500, weeklyRate: 28000, deposit: 5000, available: true, negotiable: true, bookings: 142, condition: 'Good', type: 'Sprayer', hp: '1.5 HP', capacity: '1 hectare/hour', features: ['Battery powered', 'Adjustable nozzle', 'Anti-drip valve', 'Lightweight'], rating: 4.5, reviews: 98, yearMade: 2021 },
  { id: 'eq6', emoji: '⚡', name: '15 KVA Generator (Farm)', owner: 'PowerFarm Ltd', ownerInitials: 'PF', ownerBg: 'bg-yellow-600', state: 'Lagos', town: 'Ikorodu', dailyRate: 15000, weeklyRate: 90000, deposit: 20000, available: true, negotiable: false, bookings: 55, condition: 'Good', type: 'Generator', hp: 'N/A', capacity: '15 KVA / 12 KW', features: ['Diesel powered', 'Electric start', 'AVR voltage', 'Low noise'], rating: 4.6, reviews: 43, yearMade: 2020 },
  { id: 'eq7', emoji: '🌱', name: 'Transplanting Machine', owner: 'Delta AgroMech', ownerInitials: 'DA', ownerBg: 'bg-emerald-700', state: 'Delta', town: 'Asaba', dailyRate: 35000, weeklyRate: 200000, deposit: 40000, available: true, negotiable: true, bookings: 6, condition: 'Excellent', type: 'Transplanter', hp: '8 HP', capacity: '0.5 hectare/hour', features: ['Walk-behind type', 'Row spacing adjustment', 'Floating technology', 'Certified'], rating: 4.8, reviews: 5, yearMade: 2022 },
  { id: 'eq8', emoji: '🏗️', name: 'Borehole Drilling Rig', owner: 'WaterWell NG', ownerInitials: 'WW', ownerBg: 'bg-cyan-700', state: 'Abuja', town: 'Gwagwalada', dailyRate: 120000, weeklyRate: 700000, deposit: 150000, available: false, negotiable: true, bookings: 11, condition: 'Excellent', type: 'Drilling', hp: '120 HP', capacity: '100m depth', features: ['Rotary drill', 'Mud pump', 'Casing pipe', 'Certified operator'], rating: 4.7, reviews: 10, yearMade: 2020 },
  { id: 'eq9', emoji: '🌿', name: 'Cassava Peeling Machine', owner: 'Enugu Agri-Tools', ownerInitials: 'EA', ownerBg: 'bg-lime-700', state: 'Enugu', town: 'Enugu', dailyRate: 12000, weeklyRate: 70000, deposit: 15000, available: true, negotiable: false, bookings: 29, condition: 'Good', type: 'Processing', hp: '3 HP', capacity: '1,000 kg/hour', features: ['Stainless steel', 'Low power', 'Easy clean', 'Portable'], rating: 4.4, reviews: 22, yearMade: 2019 },
];

const EQUIPMENT_TYPES = ['All Types', 'Tractor', 'Irrigation', 'Thresher', 'Harvester', 'Sprayer', 'Generator', 'Transplanter', 'Drilling', 'Processing'];
const STATES_LIST = ['All States', 'Kaduna', 'Kano', 'Kebbi', 'Oyo', 'Lagos', 'Delta', 'Abuja', 'Enugu'];

const CONDITION_BADGE: Record<string, string> = {
  Excellent: 'bg-green-100 text-green-700 border-green-200',
  Good: 'bg-blue-100 text-blue-700 border-blue-200',
  Fair: 'bg-amber-100 text-amber-700 border-amber-200',
};

export default function EquipmentPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState({ type: 'All Types', state: 'All States', available: false, search: '' });
  const [selected, setSelected] = useState<typeof EQUIPMENT_LIST[0] | null>(null);
  const [rentalType, setRentalType] = useState<'daily' | 'weekly'>('daily');
  const [days, setDays] = useState(1);
  const [date, setDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);
  const [shareEq, setShareEq] = useState<typeof EQUIPMENT_LIST[0] | null>(null);
  const [offerEq, setOfferEq] = useState<typeof EQUIPMENT_LIST[0] | null>(null);

  const filtered = EQUIPMENT_LIST.filter(e => {
    if (filter.available && !e.available) return false;
    if (filter.type !== 'All Types' && e.type !== filter.type) return false;
    if (filter.state !== 'All States' && e.state !== filter.state) return false;
    if (filter.search && !e.name.toLowerCase().includes(filter.search.toLowerCase()) && !e.type.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleHire = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/auth'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setBooked(true);
    setSelected(null);
    setTimeout(() => setBooked(false), 5000);
  };

  const totalCost = selected
    ? rentalType === 'daily' ? selected.dailyRate * days : selected.weeklyRate * Math.ceil(days / 7)
    : 0;

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Hero */}
      <div className="bg-violet-950 pt-24 pb-10">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-violet-300 text-sm font-semibold mb-1">⚙️ Equipment Marketplace</p>
              <h1 className="text-3xl md:text-4xl font-black text-white">Hire Farm Equipment</h1>
              <p className="text-violet-200/70 text-sm mt-2 max-w-lg">Rent tractors, harvesters, irrigation pumps, and more from verified owners across Nigeria. Daily and weekly rates.</p>
            </div>
            <div className="flex gap-3 text-center">
              {[
                { num: '450+', label: 'Listings' },
                { num: '36', label: 'States' },
                { num: '4.7★', label: 'Avg Rating' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                  <p className="font-black text-white text-lg">{s.num}</p>
                  <p className="text-violet-300/70 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-tight py-8">
        {booked && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-700 font-semibold mb-6">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-black">Hire request submitted!</p>
              <p className="text-sm font-normal text-green-600">The equipment owner will confirm your booking within 2 hours.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-ink mb-4">Filter Equipment</h3>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Search</label>
                <input value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} placeholder="Tractor, pump, sprayer..." className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Equipment Type</label>
                <select value={filter.type} onChange={e => setFilter(f => ({ ...f, type: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400">
                  {EQUIPMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">State</label>
                <select value={filter.state} onChange={e => setFilter(f => ({ ...f, state: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400">
                  {STATES_LIST.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filter.available} onChange={e => setFilter(f => ({ ...f, available: e.target.checked }))} className="w-4 h-4 accent-violet-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Available now only</span>
                </label>
              </div>

              <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 mt-4">
                <p className="text-xs font-bold text-violet-800 mb-1">🔒 Deposit Protected</p>
                <p className="text-xs text-violet-700">Refundable deposit held in escrow. Returned after equipment is returned in good condition.</p>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">{filtered.length} item{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(eq => (
                <div key={eq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-all overflow-hidden">
                  {/* Image area */}
                  <div className="bg-gradient-to-br from-violet-50 to-slate-100 h-40 flex items-center justify-center relative">
                    <span className="text-6xl">{eq.emoji}</span>
                    <div className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${CONDITION_BADGE[eq.condition]}`}>
                      {eq.condition}
                    </div>
                    <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${eq.available ? 'bg-green-500 text-white' : 'bg-red-400 text-white'}`}>
                      {eq.available ? '✓ Available' : 'Rented Out'}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-lg ${eq.ownerBg} flex items-center justify-center text-white font-black text-[9px]`}>{eq.ownerInitials}</div>
                      <span className="text-xs text-gray-600 bg-white/90 px-1.5 py-0.5 rounded-full">{eq.owner}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="font-bold text-ink text-sm leading-snug mb-0.5">{eq.name}</p>
                    <p className="text-gray-400 text-xs mb-2">{eq.town}, {eq.state} · {eq.yearMade} · ⭐ {eq.rating} ({eq.reviews})</p>

                    {/* Specs */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3 text-xs">
                      <span className="bg-gray-50 px-2 py-1 rounded-lg text-gray-600">⚡ {eq.hp}</span>
                      <span className="bg-gray-50 px-2 py-1 rounded-lg text-gray-600">📦 {eq.capacity}</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {eq.features.slice(0, 3).map(f => (
                        <span key={f} className="text-[10px] bg-violet-50 text-violet-700 border border-violet-100 px-1.5 py-0.5 rounded-full">{f}</span>
                      ))}
                    </div>

                    {/* Rates */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                        <p className="font-black text-violet-700 text-sm">₦{eq.dailyRate.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400">per day</p>
                      </div>
                      <div className="bg-violet-50 rounded-xl p-2.5 text-center">
                        <p className="font-black text-violet-700 text-sm">₦{eq.weeklyRate.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400">per week</p>
                      </div>
                    </div>

                    {/* Negotiable badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${eq.negotiable ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                        {eq.negotiable ? '🤝 Negotiable' : '🔒 Fixed Price'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => eq.available && setSelected(eq)}
                        disabled={!eq.available}
                        className={`py-2.5 rounded-xl text-sm font-bold transition-all ${eq.available ? 'bg-violet-700 hover:bg-violet-600 active:scale-95 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        {eq.available ? 'Hire →' : 'Rented Out'}
                      </button>
                      <button
                        onClick={() => setShareEq(eq)}
                        className="py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700 transition-all"
                      >
                        🔗 Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">⚙️</p>
                <p className="font-bold text-ink text-xl mb-2">No equipment found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {/* Hire modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <p className="font-black text-ink text-sm">{selected.name}</p>
                  <p className="text-gray-400 text-xs">{selected.owner} · {selected.state}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            {/* Rental type toggle */}
            <div className="flex gap-2 mb-4">
              {(['daily', 'weekly'] as const).map(t => (
                <button key={t} onClick={() => setRentalType(t)} className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${rentalType === t ? 'bg-violet-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {t === 'daily' ? `₦${selected.dailyRate.toLocaleString()}/day` : `₦${selected.weeklyRate.toLocaleString()}/week`}
                </button>
              ))}
            </div>

            <form onSubmit={handleHire} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date *</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Number of {rentalType === 'daily' ? 'Days' : 'Weeks'} *</label>
                  <input type="number" min={1} max={30} value={days} onChange={e => setDays(Number(e.target.value))} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400" />
                </div>
              </div>

              <div className="bg-violet-50 border border-violet-100 rounded-xl p-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Rental cost</span>
                  <span className="font-bold">₦{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Refundable deposit</span>
                  <span className="font-bold">₦{selected.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-violet-100 pt-1 mt-1">
                  <span>Total due now</span>
                  <span className="text-violet-700">₦{(totalCost + selected.deposit).toLocaleString()}</span>
                </div>
              </div>

              {selected.negotiable && (
                <button
                  type="button"
                  onClick={() => { setOfferEq(selected); setSelected(null); }}
                  className="w-full border border-violet-300 text-violet-700 font-bold py-2.5 rounded-xl text-sm hover:bg-violet-50 transition-colors"
                >
                  🤝 Make an Offer Instead
                </button>
              )}
              <button type="submit" disabled={submitting} className="w-full bg-violet-700 hover:bg-violet-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '⚙️'}
                {submitting ? 'Submitting...' : 'Confirm Hire Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      {shareEq && (
        <ShareModal
          title={`${shareEq.name} — ${shareEq.owner}`}
          description={`₦${shareEq.dailyRate.toLocaleString()}/day · ${shareEq.town}, ${shareEq.state}`}
          onClose={() => setShareEq(null)}
        />
      )}

      {offerEq && (
        <MakeOfferModal
          listingTitle={`${offerEq.name} — ${offerEq.town}, ${offerEq.state}`}
          askingPrice={offerEq.dailyRate}
          unit="day"
          sellerName={offerEq.owner}
          sellerType="equipment"
          onClose={() => setOfferEq(null)}
        />
      )}
    </div>
  );
}
