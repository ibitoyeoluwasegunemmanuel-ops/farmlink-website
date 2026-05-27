'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

const MOCK_TRIPS = [
  { id: 't1', from: 'Kano', to: 'Lagos', cargo: 'Maize (500kg)', status: 'in_transit', amount: 45000, date: '2025-11-06' },
  { id: 't2', from: 'Kaduna', to: 'Abuja', cargo: 'Tomatoes (200kg)', status: 'completed', amount: 28000, date: '2025-11-04' },
  { id: 't3', from: 'Onitsha', to: 'PH', cargo: 'Yam (1200 tubers)', status: 'completed', amount: 62000, date: '2025-10-30' },
];

const STATUS_COLORS: Record<string, string> = {
  in_transit: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function TransporterDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState(MOCK_TRIPS);
  const [offerOpen, setOfferOpen] = useState(false);
  const [form, setForm] = useState({ vehicleType: '', capacity: '', currentLocation: '', routes: '', pricePerKm: '', availability: '' });
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/auth');
  }, [loading, isAuthenticated, router]);

  if (loading || !user) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalEarned = trips.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const activeTrips = trips.filter(t => t.status === 'in_transit').length;

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await fetch(`${API}/transport/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, transporterId: user.id, transporterName: user.fullName }),
      });
    } catch { /* ignore */ }
    setPosting(false);
    setPosted(true);
    setOfferOpen(false);
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-brand-950 pt-16 pb-8">
        <div className="container-tight flex items-center justify-between">
          <div>
            <p className="text-brand-300 text-sm">Transporter Dashboard</p>
            <h1 className="text-3xl font-black text-white">{user.fullName || 'Driver'} 🚛</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setOfferOpen(true)} className="btn-primary text-sm py-2.5 px-4">+ Post Offer</button>
            <button onClick={() => { logout(); router.push('/'); }} className="text-brand-400 hover:text-brand-200 text-sm font-medium transition-colors">Sign out</button>
          </div>
        </div>
      </div>

      <div className="container-tight py-8 space-y-6">
        {posted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-700 font-semibold text-sm">
            <span className="text-xl">✅</span> Transport offer posted successfully!
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Earned', value: `₦${totalEarned.toLocaleString()}`, icon: '💰' },
            { label: 'Active Trips', value: String(activeTrips), icon: '🚛' },
            { label: 'Completed', value: String(trips.filter(t => t.status === 'completed').length), icon: '✅' },
            { label: 'Rating', value: `${(user as any).rating || '4.7'} ★`, icon: '⭐' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <span className="text-2xl block mb-2">{s.icon}</span>
              <p className="font-black text-ink text-lg">{s.value}</p>
              <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-black text-ink text-lg mb-4">How to Get Hired</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Post Your Offer', desc: 'List your vehicle, capacity, routes, and pricing so farmers can find you', color: 'bg-brand-50 border-brand-100' },
              { step: '2', title: 'Get Matched', desc: 'Farmers with matching delivery needs will contact you directly through FarmLink', color: 'bg-amber-50 border-amber-100' },
              { step: '3', title: 'Deliver & Earn', desc: 'Complete the delivery and get paid securely through our escrow system', color: 'bg-green-50 border-green-100' },
            ].map(s => (
              <div key={s.step} className={`${s.color} border rounded-2xl p-4`}>
                <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center font-black text-sm mb-3">{s.step}</div>
                <p className="font-bold text-ink text-sm mb-1">{s.title}</p>
                <p className="text-gray-500 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setOfferOpen(true)} className="btn-primary mt-4 text-sm py-2.5 px-5">
            Post Transport Offer →
          </button>
        </div>

        {/* Trips */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-black text-ink text-lg mb-4">My Trips</h2>
          {trips.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">No trips yet. Post an offer to get started.</p>
          ) : (
            <div className="space-y-3">
              {trips.map(trip => (
                <div key={trip.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:border-brand-200 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-ink text-sm">{trip.from} → {trip.to}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[trip.status]}`}>
                        {trip.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{trip.cargo} · {new Date(trip.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <p className="font-black text-brand-700 text-base">₦{trip.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Offer Modal */}
      {offerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setOfferOpen(false)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-ink text-xl">Post Transport Offer</h3>
              <button onClick={() => setOfferOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handlePost} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Vehicle Type</label>
                  <input value={form.vehicleType} onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value }))} placeholder="e.g. 5-tonne truck" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Capacity (kg)</label>
                  <input value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="e.g. 5000" required type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Current Location / Base</label>
                <input value={form.currentLocation} onChange={e => setForm(f => ({ ...f, currentLocation: e.target.value }))} placeholder="e.g. Kano, Kano State" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Routes Covered</label>
                <input value={form.routes} onChange={e => setForm(f => ({ ...f, routes: e.target.value }))} placeholder="e.g. Kano - Lagos, Kano - Abuja" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Price per km (₦)</label>
                  <input value={form.pricePerKm} onChange={e => setForm(f => ({ ...f, pricePerKm: e.target.value }))} placeholder="e.g. 150" type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Availability</label>
                  <input value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value }))} placeholder="e.g. Mon-Sat, 7am-6pm" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
                </div>
              </div>
              <button type="submit" disabled={posting} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {posting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {posting ? 'Posting...' : 'Post Offer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
