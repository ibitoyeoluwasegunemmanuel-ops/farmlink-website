'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

const EQUIPMENT_TYPES = ['Tractor', 'Plough', 'Harvester', 'Irrigation Pump', 'Sprayer', 'Thresher', 'Generator', 'Borehole Pump', 'Transplanter', 'Other'];
const STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];

const MOCK_EQUIPMENT = [
  { id: 'eq1', name: 'John Deere Tractor 5055E', type: 'Tractor', dailyRate: 45000, weeklyRate: 280000, location: 'Kaduna', status: 'available', bookings: 12 },
  { id: 'eq2', name: 'Honda WP20X Irrigation Pump', type: 'Irrigation Pump', dailyRate: 8500, weeklyRate: 50000, location: 'Kaduna', status: 'rented', bookings: 24 },
];

export default function EquipmentDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState(MOCK_EQUIPMENT);
  const [tab, setTab] = useState<'overview' | 'listings' | 'add'>('overview');
  const [form, setForm] = useState({ name: '', type: '', description: '', dailyRate: '', weeklyRate: '', deposit: '', state: '', town: '', condition: 'good' });
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

  const totalRevenue = listings.reduce((s, l) => s + l.bookings * l.dailyRate, 0);
  const available = listings.filter(l => l.status === 'available').length;

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    try {
      await fetch(`${API}/equipment/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ownerId: user.id, ownerName: user.fullName }),
      });
    } catch { /* ignore */ }
    setPosting(false);
    setPosted(true);
    setTab('listings');
    setTimeout(() => setPosted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-brand-950 pt-16 pb-0">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-brand-300 text-sm">Equipment Owner Dashboard</p>
              <h1 className="text-3xl font-black text-white">{user.fullName || 'Owner'} ⚙️</h1>
            </div>
            <button onClick={() => { logout(); router.push('/'); }} className="text-brand-400 hover:text-brand-200 text-sm font-medium transition-colors">Sign out</button>
          </div>

          <div className="flex gap-1 border-b border-white/10">
            {(['overview', 'listings', 'add'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  tab === t ? 'border-brand-400 text-brand-300' : 'border-transparent text-brand-500 hover:text-brand-300'
                }`}
              >
                {t === 'add' ? '+ Add Equipment' : t === 'listings' ? 'My Equipment' : 'Overview'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-tight py-8 space-y-6">
        {posted && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-700 font-semibold text-sm">
            <span className="text-xl">✅</span> Equipment listed successfully!
          </div>
        )}

        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `₦${totalRevenue.toLocaleString()}`, icon: '💰' },
                { label: 'Available', value: String(available), icon: '✅' },
                { label: 'Currently Rented', value: String(listings.filter(l => l.status === 'rented').length), icon: '⚙️' },
                { label: 'Total Bookings', value: String(listings.reduce((s, l) => s + l.bookings, 0)), icon: '📋' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <span className="text-2xl block mb-2">{s.icon}</span>
                  <p className="font-black text-ink text-lg">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-black text-ink text-lg mb-4">Quick Actions</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { icon: '➕', label: 'List Equipment', desc: 'Add machinery, tools, or farm equipment for hire', color: 'bg-brand-50 border-brand-200', action: () => setTab('add') },
                  { icon: '📋', label: 'View Listings', desc: 'Manage your listed equipment and availability', color: 'bg-amber-50 border-amber-200', action: () => setTab('listings') },
                  { icon: '💬', label: 'Enquiries', desc: 'View and respond to rental requests from farmers', color: 'bg-purple-50 border-purple-200', action: () => {} },
                ].map(a => (
                  <button key={a.label} onClick={a.action} className={`${a.color} border rounded-2xl p-4 text-left hover:-translate-y-0.5 transition-all`}>
                    <span className="text-3xl block mb-2">{a.icon}</span>
                    <p className="font-bold text-ink text-sm">{a.label}</p>
                    <p className="text-gray-500 text-xs mt-1">{a.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'listings' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-black text-ink text-lg">My Equipment</h2>
              <button onClick={() => setTab('add')} className="btn-primary text-sm py-2 px-4">+ Add More</button>
            </div>
            {listings.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No equipment listed yet.</p>
            ) : (
              <div className="space-y-3">
                {listings.map(eq => (
                  <div key={eq.id} className="flex items-center justify-between border border-gray-100 rounded-xl p-4 hover:border-brand-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚙️</span>
                      <div>
                        <p className="font-bold text-ink text-sm">{eq.name}</p>
                        <p className="text-gray-400 text-xs">{eq.type} · {eq.location} · {eq.bookings} bookings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-brand-700 text-sm">₦{eq.dailyRate.toLocaleString()}/day</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${eq.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {eq.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'add' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl">
            <h2 className="font-black text-ink text-lg mb-5">List New Equipment</h2>
            <form onSubmit={handlePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Equipment Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. John Deere 5055E Tractor" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Equipment Type *</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400">
                    <option value="">Select type</option>
                    {EQUIPMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Condition</label>
                  <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400">
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your equipment, its specs, and capabilities..." rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Daily Rate (₦) *</label>
                  <input value={form.dailyRate} onChange={e => setForm(f => ({ ...f, dailyRate: e.target.value }))} placeholder="e.g. 45000" required type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Weekly Rate (₦)</label>
                  <input value={form.weeklyRate} onChange={e => setForm(f => ({ ...f, weeklyRate: e.target.value }))} placeholder="e.g. 250000" type="number" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
                  <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400">
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Town / LGA *</label>
                  <input value={form.town} onChange={e => setForm(f => ({ ...f, town: e.target.value }))} placeholder="e.g. Zaria" required className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400" />
                </div>
              </div>
              <button type="submit" disabled={posting} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {posting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {posting ? 'Listing...' : '⚙️ List Equipment'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
