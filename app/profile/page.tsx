'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const NIGERIAN_STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara'];

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<'info' | 'security' | 'notifications' | 'account'>('info');
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phoneNumber: user?.phoneNumber || '',
    email: '',
    state: 'Lagos',
    lga: '',
    address: '',
    bio: '',
    farmName: '',
    farmSize: '',
    crops: '',
    yearsExperience: '',
  });

  const [notifs, setNotifs] = useState({
    orderUpdates: true,
    priceAlerts: true,
    investmentUpdates: true,
    marketingEmails: false,
    smsAlerts: true,
  });

  const [pinForm, setPinForm] = useState({ current: '', newPin: '', confirm: '' });
  const [pinSaved, setPinSaved] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-black text-ink mb-3">Sign in to view your profile</h2>
            <button onClick={() => router.push('/auth')} className="btn-primary">Sign In</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePinSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPinSaved(true);
    setTimeout(() => setPinSaved(false), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setAvatar(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const roleLabel: Record<string, string> = {
    farmer: '🌾 Farmer',
    buyer: '🛒 Buyer',
    transporter: '🚛 Transporter',
    equipment_owner: '⚙️ Equipment Owner',
    investor: '💼 Investor',
  };

  const isFarmer = user?.role === 'farmer';

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-4xl">
          {/* Profile header */}
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-6 md:p-8 text-white mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center text-4xl font-black overflow-hidden flex-shrink-0">
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : (user?.fullName?.charAt(0) || 'U')
                }
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg hover:bg-gray-50">
                <svg className="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-black mb-1">{user?.fullName || 'Your Name'}</h1>
              <p className="text-white/70 text-sm mb-2">{user?.phoneNumber}</p>
              {user?.role && (
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {roleLabel[user.role] || user.role}
                </span>
              )}
            </div>
            <div className="md:ml-auto grid grid-cols-3 gap-3 text-center">
              {[['12', 'Orders'], ['4', 'Reviews'], ['98%', 'Rating']].map(([v, l]) => (
                <div key={l} className="bg-white/15 rounded-2xl p-3">
                  <div className="text-xl font-black">{v}</div>
                  <div className="text-xs text-white/60">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto scrollbar-none">
            {([['info', 'Personal Info'], ['security', 'Security'], ['notifications', 'Notifications'], ['account', 'Account']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${tab === key ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Info tab */}
          {tab === 'info' && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
                <h3 className="font-black text-ink mb-5">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Full Name</label>
                    <input value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Phone Number</label>
                    <input value={form.phoneNumber} disabled
                      className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
                    <p className="text-xs text-gray-400 mt-1">Phone number cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Email (optional)</label>
                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">State</label>
                    <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white">
                      {NIGERIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">LGA / Area</label>
                    <input value={form.lga} onChange={e => setForm(p => ({ ...p, lga: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Local Government Area" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Address</label>
                    <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="Street address" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Bio / About You</label>
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none"
                    placeholder="Tell buyers or partners about yourself..." />
                </div>
              </div>

              {isFarmer && (
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
                  <h3 className="font-black text-ink mb-5">Farm Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Farm Name</label>
                      <input value={form.farmName} onChange={e => setForm(p => ({ ...p, farmName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. Green Valley Farm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Farm Size (hectares)</label>
                      <input type="number" value={form.farmSize} onChange={e => setForm(p => ({ ...p, farmSize: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. 2.5" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Crops / Products</label>
                      <input value={form.crops} onChange={e => setForm(p => ({ ...p, crops: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. Tomatoes, Maize, Cassava" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Years of Experience</label>
                      <input type="number" value={form.yearsExperience} onChange={e => setForm(p => ({ ...p, yearsExperience: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" placeholder="e.g. 5" />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button type="submit" className="btn-primary px-8">
                  {saved ? '✓ Saved!' : 'Save Changes'}
                </button>
                {saved && <span className="text-green-600 text-sm font-semibold">Profile updated successfully</span>}
              </div>
            </form>
          )}

          {/* Security tab */}
          {tab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
                <h3 className="font-black text-ink mb-2">Change PIN</h3>
                <p className="text-sm text-gray-500 mb-5">Your PIN is used to confirm payments and withdrawals</p>
                <form onSubmit={handlePinSave} className="space-y-4 max-w-sm">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Current PIN</label>
                    <input type="password" maxLength={4} value={pinForm.current}
                      onChange={e => setPinForm(p => ({ ...p, current: e.target.value.replace(/\D/g, '') }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm tracking-widest" placeholder="••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">New PIN</label>
                    <input type="password" maxLength={4} value={pinForm.newPin}
                      onChange={e => setPinForm(p => ({ ...p, newPin: e.target.value.replace(/\D/g, '') }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm tracking-widest" placeholder="••••" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Confirm New PIN</label>
                    <input type="password" maxLength={4} value={pinForm.confirm}
                      onChange={e => setPinForm(p => ({ ...p, confirm: e.target.value.replace(/\D/g, '') }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm tracking-widest" placeholder="••••" />
                  </div>
                  <button type="submit" className="btn-primary px-8">
                    {pinSaved ? '✓ PIN Changed!' : 'Change PIN'}
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
                <h3 className="font-black text-ink mb-2">Login Sessions</h3>
                <p className="text-sm text-gray-500 mb-4">You are currently signed in on 1 device</p>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">Current Device</p>
                      <p className="text-xs text-gray-400">Active now · Nigeria</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-bold">Current</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications tab */}
          {tab === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
              <h3 className="font-black text-ink mb-5">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'orderUpdates', label: 'Order Updates', desc: 'When your orders are confirmed, dispatched, or delivered' },
                  { key: 'priceAlerts', label: 'Price Alerts', desc: 'When prices of your watched commodities change significantly' },
                  { key: 'investmentUpdates', label: 'Investment Updates', desc: 'Milestones, returns, and new opportunities' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive SMS notifications for critical updates' },
                  { key: 'marketingEmails', label: 'Marketing & Promotions', desc: 'New features, promotions, and platform news' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-semibold text-ink text-sm">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifs[item.key as keyof typeof notifs] ? 'bg-brand-600' : 'bg-gray-200'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${notifs[item.key as keyof typeof notifs] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <button className="btn-primary mt-6">Save Preferences</button>
            </div>
          )}

          {/* Account tab */}
          {tab === 'account' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
                <h3 className="font-black text-ink mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-left">
                    <span className="flex items-center gap-3 text-sm font-semibold text-ink">
                      <span className="text-xl">📋</span> Download My Data
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-left">
                    <span className="flex items-center gap-3 text-sm font-semibold text-ink">
                      <span className="text-xl">🔕</span> Deactivate Account
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                  <button
                    onClick={() => { logout(); router.push('/'); }}
                    className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors text-left text-sm font-semibold text-red-600">
                    <span className="text-xl">🚪</span> Sign Out of All Devices
                  </button>
                </div>
              </div>

              <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                <h3 className="font-black text-red-800 mb-2">Delete Account</h3>
                <p className="text-sm text-red-600 mb-4">Permanently delete your FarmLink account. This action cannot be undone. All data, listings, and transaction history will be removed.</p>
                <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors">
                  Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
