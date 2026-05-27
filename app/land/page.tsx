'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const LANDS = [
  {
    id: 1,
    title: 'Fertile Farmland — Benue Valley',
    location: 'Makurdi, Benue',
    state: 'Benue',
    size: '5 Hectares',
    sizeNum: 5,
    type: 'rent',
    price: 120000,
    period: 'per season',
    soilType: 'Loamy Clay',
    waterSource: 'River + Borehole',
    suitable: ['Rice', 'Maize', 'Cassava', 'Yam'],
    features: ['Flat terrain', 'Access road', 'Fenced', 'Irrigation canal'],
    owner: 'Terwase Agber',
    ownerPhone: '+234 803 xxx xxxx',
    verified: true,
    image: '🌾',
    description: 'Premium farmland in the food basket of Nigeria. Well-irrigated, loamy soil perfect for wet-season rice and dry-season maize. Access road leads directly to the Makurdi main market.',
    available: 'March 2026',
    tenure: '1 season (6 months)',
  },
  {
    id: 2,
    title: 'Dry Season Irrigated Plot',
    location: 'Kano, Kano State',
    state: 'Kano',
    size: '2 Hectares',
    sizeNum: 2,
    type: 'rent',
    price: 80000,
    period: 'per season',
    soilType: 'Sandy Loam',
    waterSource: 'Irrigation Canal',
    suitable: ['Tomatoes', 'Pepper', 'Onion', 'Garlic'],
    features: ['Irrigation canal', 'Year-round', 'Flat', 'Nearby market'],
    owner: 'Musa Kabiru',
    ownerPhone: '+234 806 xxx xxxx',
    verified: true,
    image: '🏜️',
    description: 'Located in Kano\'s famous fadama belt. Excellent for dry-season vegetables. Canal irrigation from Kano River project. Tomato market 2km away.',
    available: 'Immediately',
    tenure: 'Flexible (3-12 months)',
  },
  {
    id: 3,
    title: 'Cocoa Plantation — Ondo',
    location: 'Owo, Ondo State',
    state: 'Ondo',
    size: '10 Hectares',
    sizeNum: 10,
    type: 'sale',
    price: 8500000,
    period: 'outright',
    soilType: 'Forest Soil',
    waterSource: 'Rainfall + Stream',
    suitable: ['Cocoa', 'Rubber', 'Oil Palm'],
    features: ['Existing cocoa trees', 'Processing shed', 'Staff quarters', 'Road access'],
    owner: 'Chief Adeleke Olatunji',
    ownerPhone: '+234 805 xxx xxxx',
    verified: true,
    image: '🍫',
    description: 'Established 10-hectare cocoa plantation with mature trees (8-15 years). Existing processing shed. Ideal for investor looking to enter cocoa export market with immediate production.',
    available: 'Negotiable',
    tenure: 'Outright sale with C of O',
  },
  {
    id: 4,
    title: 'Greenhouse-Ready Land — Jos Plateau',
    location: 'Jos South, Plateau',
    state: 'Plateau',
    size: '1 Hectare',
    sizeNum: 1,
    type: 'rent',
    price: 150000,
    period: 'per year',
    soilType: 'Volcanic Loam',
    waterSource: 'Spring Water',
    suitable: ['Strawberry', 'Tomatoes', 'Carrots', 'Cabbage'],
    features: ['Cool climate', 'Spring water', 'Level ground', 'Electricity nearby'],
    owner: 'Ngo Bong',
    ownerPhone: '+234 812 xxx xxxx',
    verified: false,
    image: '🏔️',
    description: 'Cool climate land on the Jos Plateau — Nigeria\'s best location for exotic vegetables and strawberry farming. Spring water available year-round. Perfect for greenhouse investment.',
    available: 'February 2026',
    tenure: '1–3 year lease',
  },
  {
    id: 5,
    title: 'Ogun Cassava Belt — Large Plot',
    location: 'Ijebu Ode, Ogun',
    state: 'Ogun',
    size: '20 Hectares',
    sizeNum: 20,
    type: 'rent',
    price: 600000,
    period: 'per year',
    soilType: 'Sandy Loam',
    waterSource: 'Rainfall',
    suitable: ['Cassava', 'Maize', 'Plantain', 'Cocoyam'],
    features: ['Large scale', 'Good soil depth', 'Near gari factory', 'Access roads'],
    owner: 'Kamoru Adeyemi',
    ownerPhone: '+234 809 xxx xxxx',
    verified: true,
    image: '🌿',
    description: 'Large-scale cassava belt land near Ijebu Ode. Adjacent to a garri processing factory for direct offtake. Good for contract farming with guaranteed buyers.',
    available: 'Immediately',
    tenure: '1–5 year lease',
  },
  {
    id: 6,
    title: 'Delta Catfish Farm Plot',
    location: 'Asaba, Delta State',
    state: 'Delta',
    size: '3 Hectares',
    sizeNum: 3,
    type: 'sale',
    price: 4200000,
    period: 'outright',
    soilType: 'Alluvial',
    waterSource: 'River Access + Pond',
    suitable: ['Catfish', 'Tilapia', 'Crayfish'],
    features: ['River access', 'Existing ponds', 'Fish market nearby', 'Electricity'],
    owner: 'Emmanuel Okafor',
    ownerPhone: '+234 803 xxx xxxx',
    verified: true,
    image: '🐟',
    description: 'Established fish farm plot with 3 existing concrete ponds along the Niger Delta. River water access for continuous farming. Fish market 500m away. Ideal for aquaculture investment.',
    available: 'Negotiable',
    tenure: 'Outright sale with deed',
  },
];

const STATES = ['All States', 'Benue', 'Kano', 'Ondo', 'Plateau', 'Ogun', 'Delta'];

export default function LandPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'rent' | 'sale'>('all');
  const [stateFilter, setStateFilter] = useState('All States');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof LANDS[0] | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const filtered = LANDS.filter(l => {
    if (typeFilter !== 'all' && l.type !== typeFilter) return false;
    if (stateFilter !== 'All States' && l.state !== stateFilter) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase()) &&
        !l.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setShowInquiry(false); setSelected(null); }, 2500);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-800 via-green-700 to-lime-600 pt-24 pb-16 text-white">
          <div className="container-tight text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-semibold mb-6">
              🌍 Land Marketplace
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Farmland for Rent & Sale<br />
              <span className="text-lime-300">Across Nigeria</span>
            </h1>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Find verified farmland by state, soil type, and crop suitability. Rent for a season or buy outright.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
              {[['6+', 'Active Plots'], ['6 States', 'Coverage'], ['100%', 'Verified Owners']].map(([v, l]) => (
                <div key={l} className="bg-white/15 rounded-2xl p-4">
                  <div className="text-2xl font-black">{v}</div>
                  <div className="text-xs text-white/70">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="container-tight py-4 flex flex-wrap gap-3 items-center">
            <div className="flex bg-gray-100 rounded-xl p-1">
              {(['all', 'rent', 'sale'] as const).map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${typeFilter === t ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
                  {t === 'all' ? 'All' : t === 'rent' ? 'For Rent' : 'For Sale'}
                </button>
              ))}
            </div>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white">
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search location or crop..."
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm flex-1 min-w-[200px]" />
          </div>
        </section>

        {/* Listings */}
        <section className="container-tight py-10">
          <p className="text-sm text-gray-500 mb-6">{filtered.length} plots found</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(land => (
              <div key={land.id} className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all border border-gray-100 flex flex-col">
                {/* Banner */}
                <div className={`h-36 flex items-center justify-center text-6xl relative ${land.type === 'sale' ? 'bg-gradient-to-br from-amber-50 to-orange-100' : 'bg-gradient-to-br from-emerald-50 to-green-100'}`}>
                  {land.image}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${land.type === 'sale' ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      {land.type === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                    </span>
                  </div>
                  {land.verified && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">✓ Verified</div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-black text-ink text-base mb-1 leading-snug">{land.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">📍 {land.location} · {land.size}</p>

                  {/* Suitable crops */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {land.suitable.slice(0, 3).map(c => (
                      <span key={c} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">{c}</span>
                    ))}
                    {land.suitable.length > 3 && <span className="text-xs text-gray-400">+{land.suitable.length - 3}</span>}
                  </div>

                  {/* Info */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    <div className="bg-gray-50 rounded-xl p-2">
                      <div className="text-gray-400">Soil</div>
                      <div className="font-semibold text-ink">{land.soilType}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2">
                      <div className="text-gray-400">Water</div>
                      <div className="font-semibold text-ink truncate">{land.waterSource}</div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline justify-between mb-4">
                      <div>
                        <span className="text-2xl font-black text-brand-600">₦{land.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1">{land.period}</span>
                      </div>
                      <span className="text-xs text-gray-500">{land.available}</span>
                    </div>
                    <button onClick={() => { setSelected(land); setShowInquiry(false); }}
                      className="w-full btn-primary text-sm py-2.5">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🌱</div>
              <p className="text-gray-500 font-medium">No plots match your filters</p>
            </div>
          )}
        </section>

        {/* List Your Land CTA */}
        <section className="bg-emerald-900 text-white py-16">
          <div className="container-tight text-center">
            <h2 className="text-2xl font-black mb-3">Own Farmland? List It Today</h2>
            <p className="text-white/70 mb-8 max-w-md mx-auto">Reach thousands of verified farmers and investors. Get your land generating income every season.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="/join?role=landowner" className="btn-primary bg-white text-emerald-800 hover:bg-gray-50">
                List My Land
              </a>
              <a href="/auth" className="px-6 py-3 border border-white/30 text-white rounded-xl hover:bg-white/10 font-semibold text-sm">
                Sign In First
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => { setSelected(null); setShowInquiry(false); setSent(false); }}>
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className={`h-40 flex items-center justify-center text-7xl ${selected.type === 'sale' ? 'bg-gradient-to-br from-amber-50 to-orange-100' : 'bg-gradient-to-br from-emerald-50 to-green-100'} rounded-t-3xl relative`}>
              {selected.image}
              <button onClick={() => { setSelected(null); setShowInquiry(false); setSent(false); }} className="absolute top-4 right-4 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white text-sm hover:bg-black/40">✕</button>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-xl font-black text-ink leading-snug flex-1">{selected.title}</h2>
                <span className={`ml-3 px-3 py-1 rounded-full text-xs font-black flex-shrink-0 ${selected.type === 'sale' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {selected.type === 'sale' ? 'FOR SALE' : 'FOR RENT'}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">📍 {selected.location} · {selected.size}</p>

              <p className="text-sm text-gray-700 leading-relaxed mb-5">{selected.description}</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  ['Soil Type', selected.soilType],
                  ['Water Source', selected.waterSource],
                  ['Available', selected.available],
                  ['Tenure', selected.tenure],
                ].map(([label, val]) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400">{label}</div>
                    <div className="font-semibold text-ink text-sm">{val}</div>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 mb-2">SUITABLE CROPS</p>
                <div className="flex flex-wrap gap-2">
                  {selected.suitable.map(c => (
                    <span key={c} className="bg-green-50 text-green-700 text-sm px-3 py-1 rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-gray-500 mb-2">FEATURES</p>
                <div className="flex flex-wrap gap-2">
                  {selected.features.map(f => (
                    <span key={f} className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full font-medium">{f}</span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-brand-600">₦{selected.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500 ml-1">{selected.period}</span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>Owner: <span className="font-semibold text-ink">{selected.owner}</span></div>
                    {selected.verified && <div className="text-blue-600 text-xs font-semibold">✓ ID Verified</div>}
                  </div>
                </div>
              </div>

              {!showInquiry ? (
                <button onClick={() => setShowInquiry(true)} className="w-full btn-primary py-3">
                  Send Inquiry to Owner
                </button>
              ) : sent ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="font-bold text-ink">Inquiry sent! Owner will contact you.</p>
                </div>
              ) : (
                <form onSubmit={handleInquiry} className="space-y-3">
                  <input value={inquiryForm.name} onChange={e => setInquiryForm(p => ({ ...p, name: e.target.value }))} required placeholder="Your name" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  <input value={inquiryForm.phone} onChange={e => setInquiryForm(p => ({ ...p, phone: e.target.value }))} required placeholder="Your phone number" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                  <textarea value={inquiryForm.message} onChange={e => setInquiryForm(p => ({ ...p, message: e.target.value }))} rows={3} placeholder="Tell the owner what you need..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none" />
                  <button type="submit" className="w-full btn-primary py-3">Send Inquiry</button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
