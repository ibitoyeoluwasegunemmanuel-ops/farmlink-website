'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const DRIVERS = [
  { id: 't1', name: 'Ibrahim Musa', avatar: 'IM', avatarBg: 'bg-amber-600', vehicle: '10-Tonne Cargo Truck', plate: 'KN 452 GHT', routes: ['Kano → Lagos', 'Kano → Abuja', 'Kano → Port Harcourt'], baseRate: 85000, perKm: 150, available: true, trips: 134, rating: 4.9, reviews: 98, verified: true, capacity: '10,000 kg', state: 'Kano', experience: '8 years', phone: '+234 810 000 0001', crops: ['Maize', 'Rice', 'Groundnut'], joined: '2023' },
  { id: 't2', name: 'Adamu Hassan', avatar: 'AH', avatarBg: 'bg-blue-600', vehicle: '5-Tonne Pickup Van', plate: 'KD 221 ABJ', routes: ['Kaduna → Abuja', 'Kaduna → Kano', 'Kaduna → Lagos'], baseRate: 45000, perKm: 100, available: true, trips: 83, rating: 4.8, reviews: 61, verified: true, capacity: '5,000 kg', state: 'Kaduna', experience: '5 years', phone: '+234 810 000 0002', crops: ['Tomatoes', 'Onions', 'Peppers'], joined: '2023' },
  { id: 't3', name: 'Chukwu Drivers Ltd', avatar: 'CD', avatarBg: 'bg-green-700', vehicle: 'Refrigerated Truck', plate: 'AN 097 LGS', routes: ['Anambra → Lagos', 'Anambra → Abuja', 'Anambra → PH'], baseRate: 120000, perKm: 200, available: false, trips: 22, rating: 4.7, reviews: 19, verified: true, capacity: '8,000 kg', state: 'Anambra', experience: '4 years', phone: '+234 810 000 0003', crops: ['Yam', 'Cassava', 'Vegetables'], joined: '2024' },
  { id: 't4', name: 'Bello Abdullahi', avatar: 'BA', avatarBg: 'bg-purple-600', vehicle: 'Open Flatbed Truck', plate: 'KT 773 ABJ', routes: ['Katsina → All States'], baseRate: 60000, perKm: 120, available: true, trips: 209, rating: 4.6, reviews: 154, verified: true, capacity: '12,000 kg', state: 'Katsina', experience: '10 years', phone: '+234 810 000 0004', crops: ['Sorghum', 'Millet', 'Maize'], joined: '2022' },
  { id: 't5', name: 'Tunde Logistics', avatar: 'TL', avatarBg: 'bg-rose-600', vehicle: 'Mini Van (3-Tonne)', plate: 'LG 881 ABJ', routes: ['Lagos → South West', 'Lagos → Abuja'], baseRate: 35000, perKm: 90, available: true, trips: 341, rating: 4.9, reviews: 275, verified: true, capacity: '3,000 kg', state: 'Lagos', experience: '6 years', phone: '+234 810 000 0005', crops: ['Vegetables', 'Fruits', 'Eggs'], joined: '2022' },
  { id: 't6', name: 'Hauwa Transport Co.', avatar: 'HT', avatarBg: 'bg-teal-600', vehicle: 'Agricultural Tanker', plate: 'GM 554 ABJ', routes: ['Gombe → North East', 'Gombe → Abuja'], baseRate: 95000, perKm: 170, available: true, trips: 31, rating: 4.5, reviews: 22, verified: false, capacity: '15,000 L', state: 'Gombe', experience: '3 years', phone: '+234 810 000 0006', crops: ['Palm Oil', 'Groundnut Oil'], joined: '2024' },
  { id: 't7', name: 'Emeka Fast Haulage', avatar: 'EF', avatarBg: 'bg-orange-600', vehicle: '7-Tonne Box Truck', plate: 'IM 334 LGS', routes: ['Imo → Lagos', 'Imo → Abuja', 'Imo → PH'], baseRate: 65000, perKm: 130, available: true, trips: 77, rating: 4.7, reviews: 55, verified: true, capacity: '7,000 kg', state: 'Imo', experience: '7 years', phone: '+234 810 000 0007', crops: ['Yam', 'Cassava', 'Rice'], joined: '2023' },
  { id: 't8', name: 'Fatima Agro-Truck', avatar: 'FA', avatarBg: 'bg-indigo-600', vehicle: 'Flatbed + Crane', plate: 'SO 119 KN', routes: ['Sokoto → Kano', 'Sokoto → Abuja'], baseRate: 75000, perKm: 140, available: false, trips: 44, rating: 4.8, reviews: 38, verified: true, capacity: '10,000 kg', state: 'Sokoto', experience: '5 years', phone: '+234 810 000 0008', crops: ['Cotton', 'Groundnut', 'Maize'], joined: '2023' },
];

const VEHICLE_TYPES = ['All Types', '10-Tonne Truck', '5-Tonne Van', 'Refrigerated Truck', 'Flatbed Truck', 'Mini Van', 'Tanker'];
const STATES = ['All States', 'Kano', 'Kaduna', 'Lagos', 'Anambra', 'Katsina', 'Gombe', 'Imo', 'Sokoto'];

export default function TransportPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState({ state: 'All States', vehicleType: 'All Types', available: false, search: '' });
  const [selected, setSelected] = useState<typeof DRIVERS[0] | null>(null);
  const [booking, setBooking] = useState({ from: '', to: '', date: '', cargo: '', weight: '' });
  const [submitting, setSubmitting] = useState(false);
  const [booked, setBooked] = useState(false);

  const filtered = DRIVERS.filter(d => {
    if (filter.available && !d.available) return false;
    if (filter.state !== 'All States' && d.state !== filter.state) return false;
    if (filter.search && !d.name.toLowerCase().includes(filter.search.toLowerCase()) && !d.vehicle.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/auth'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    setBooked(true);
    setSelected(null);
    setTimeout(() => setBooked(false), 5000);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Hero */}
      <div className="bg-amber-900 pt-24 pb-10">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="text-amber-300 text-sm font-semibold mb-1">🚛 Logistics Network</p>
              <h1 className="text-3xl md:text-4xl font-black text-white">Find a Truck Driver</h1>
              <p className="text-amber-200/70 text-sm mt-2 max-w-lg">Book verified drivers for farm-to-market delivery. All trips are insured and tracked through FarmLink escrow.</p>
            </div>
            <div className="flex gap-3 text-center">
              {[
                { num: '2,200+', label: 'Verified Drivers' },
                { num: '36', label: 'States Covered' },
                { num: '98%', label: 'Delivery Rate' },
              ].map(s => (
                <div key={s.label} className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                  <p className="font-black text-white text-lg">{s.num}</p>
                  <p className="text-amber-300/70 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-tight py-8">
        {booked && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-700 font-semibold mb-6">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-black">Booking request sent!</p>
              <p className="text-sm font-normal text-green-600">The driver will contact you within 30 minutes to confirm.</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
              <h3 className="font-bold text-ink mb-4">Filter Drivers</h3>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Search</label>
                <input
                  value={filter.search}
                  onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
                  placeholder="Driver name or truck type..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">State</label>
                <select value={filter.state} onChange={e => setFilter(f => ({ ...f, state: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400">
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={filter.available} onChange={e => setFilter(f => ({ ...f, available: e.target.checked }))} className="w-4 h-4 accent-amber-600 rounded" />
                  <span className="text-sm font-medium text-gray-700">Available now only</span>
                </label>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mt-4">
                <p className="text-xs font-bold text-amber-800 mb-1">🔒 FarmLink Protected</p>
                <p className="text-xs text-amber-700">Payment secured in escrow. Driver paid only after delivery confirmed.</p>
              </div>
            </div>
          </div>

          {/* Driver grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">{filtered.length} driver{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(driver => (
                <div key={driver.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-all overflow-hidden">
                  {/* Header */}
                  <div className={`${driver.avatarBg} p-4 relative`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                          {driver.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-black text-white text-sm">{driver.name}</p>
                            {driver.verified && <span className="text-white/80 text-xs">✓</span>}
                          </div>
                          <p className="text-white/70 text-xs">{driver.state} · {driver.experience}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${driver.available ? 'bg-green-400/30 text-green-100' : 'bg-white/20 text-white/60'}`}>
                        {driver.available ? '● Available' : '● Busy'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Vehicle */}
                    <p className="font-semibold text-ink text-sm mb-0.5">{driver.vehicle}</p>
                    <p className="text-gray-400 text-xs mb-3">{driver.plate} · {driver.capacity}</p>

                    {/* Routes */}
                    <div className="space-y-1 mb-3">
                      {driver.routes.slice(0, 2).map(r => (
                        <p key={r} className="text-xs text-gray-500 flex items-center gap-1.5">
                          <span className="text-amber-500 font-bold">→</span> {r}
                        </p>
                      ))}
                      {driver.routes.length > 2 && <p className="text-xs text-gray-400">+{driver.routes.length - 2} more routes</p>}
                    </div>

                    {/* Crops handled */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {driver.crops.map(c => (
                        <span key={c} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>

                    {/* Rate + rating */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50 mb-3">
                      <div>
                        <p className="font-black text-amber-700 text-base">₦{driver.baseRate.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">base rate · ₦{driver.perKm}/km</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-ink text-sm">⭐ {driver.rating}</p>
                        <p className="text-gray-400 text-xs">{driver.reviews} reviews · {driver.trips} trips</p>
                      </div>
                    </div>

                    <button
                      onClick={() => driver.available && setSelected(driver)}
                      disabled={!driver.available}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${driver.available ? 'bg-amber-600 hover:bg-amber-500 active:scale-95 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      {driver.available ? 'Book This Driver →' : 'Currently Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-5xl mb-4">🚛</p>
                <p className="font-bold text-ink text-xl mb-2">No drivers found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            )}

            {/* How it works */}
            <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-black text-ink text-lg mb-4">How Transport Booking Works</h3>
              <div className="grid sm:grid-cols-4 gap-4">
                {[
                  { step: '1', title: 'Choose a Driver', desc: 'Browse verified drivers by route, vehicle type, and availability', icon: '🔍' },
                  { step: '2', title: 'Submit Booking', desc: 'Enter pickup location, destination, cargo details and preferred date', icon: '📋' },
                  { step: '3', title: 'Driver Confirms', desc: 'The driver reviews your request and confirms within 30 minutes', icon: '✅' },
                  { step: '4', title: 'Pay on Delivery', desc: 'Payment secured in escrow — driver paid only after you confirm receipt', icon: '🔒' },
                ].map(s => (
                  <div key={s.step} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center mx-auto mb-2">{s.step}</div>
                    <p className="text-xl mb-1">{s.icon}</p>
                    <p className="font-bold text-ink text-sm mb-1">{s.title}</p>
                    <p className="text-gray-400 text-xs">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Booking modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${selected.avatarBg} flex items-center justify-center text-white font-black text-xs`}>{selected.avatar}</div>
                <div>
                  <p className="font-black text-ink text-sm">{selected.name}</p>
                  <p className="text-gray-400 text-xs">{selected.vehicle}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-gray-500">Base rate:</span> <span className="font-bold text-amber-700">₦{selected.baseRate.toLocaleString()}</span></div>
              <div><span className="text-gray-500">Per km:</span> <span className="font-bold">₦{selected.perKm}</span></div>
              <div><span className="text-gray-500">Capacity:</span> <span className="font-bold">{selected.capacity}</span></div>
              <div><span className="text-gray-500">Rating:</span> <span className="font-bold">⭐ {selected.rating}</span></div>
            </div>

            <form onSubmit={handleBook} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pickup Location *</label>
                  <input value={booking.from} onChange={e => setBooking(b => ({ ...b, from: e.target.value }))} placeholder="e.g. Kano Farm" required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Destination *</label>
                  <input value={booking.to} onChange={e => setBooking(b => ({ ...b, to: e.target.value }))} placeholder="e.g. Lagos Market" required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Preferred Date *</label>
                  <input type="date" value={booking.date} onChange={e => setBooking(b => ({ ...b, date: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Weight (kg)</label>
                  <input type="number" value={booking.weight} onChange={e => setBooking(b => ({ ...b, weight: e.target.value }))} placeholder="e.g. 2000" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Cargo Description *</label>
                <input value={booking.cargo} onChange={e => setBooking(b => ({ ...b, cargo: e.target.value }))} placeholder="e.g. 500 bags of maize" required className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🚛'}
                {submitting ? 'Sending Request...' : 'Send Booking Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
