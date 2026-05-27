'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';
import { useAuth } from '../../../../../contexts/AuthContext';
import ImageUpload from '../../../../../components/ImageUpload';

const CROP_CATEGORIES = ['Grains & Cereals', 'Vegetables', 'Tubers & Roots', 'Fruits', 'Legumes & Pulses', 'Oilseeds', 'Cash Crops', 'Processed Produce', 'Livestock & Fishery'];

const CROP_SUGGESTIONS: Record<string, string[]> = {
  'Grains & Cereals': ['Maize', 'Rice (Paddy)', 'Wheat', 'Sorghum', 'Millet', 'Barley'],
  'Vegetables': ['Tomatoes', 'Pepper', 'Onions', 'Cabbage', 'Lettuce', 'Spinach', 'Carrot', 'Cucumber'],
  'Tubers & Roots': ['Yam', 'Cassava', 'Sweet Potato', 'Irish Potato', 'Cocoyam'],
  'Fruits': ['Plantain', 'Banana', 'Mango', 'Orange', 'Watermelon', 'Pineapple', 'Pawpaw'],
  'Legumes & Pulses': ['Beans', 'Soya Beans', 'Cowpea', 'Groundnuts'],
  'Oilseeds': ['Palm Fruit', 'Sesame', 'Sunflower Seed', 'Shea Nut'],
  'Cash Crops': ['Cocoa', 'Coffee', 'Cotton', 'Sugarcane', 'Ginger', 'Turmeric'],
  'Processed Produce': ['Garri', 'Palm Oil', 'Groundnut Oil', 'Dried Fish', 'Smoked Fish'],
  'Livestock & Fishery': ['Broiler Chicken', 'Catfish', 'Tilapia', 'Goat', 'Sheep', 'Eggs'],
};

const UNITS = ['bag (50kg)', 'bag (100kg)', 'crate', 'tuber', 'kg', 'tonne', 'drum (25L)', 'basket', 'bunch', 'litre', 'piece'];
const QUALITIES = ['Grade A (Premium)', 'Grade B (Standard)', 'Grade C (Economy)'];
const AFRICAN_STATES = ['Lagos', 'Abuja (FCT)', 'Kano', 'Ogun', 'Rivers', 'Kaduna', 'Oyo', 'Benue', 'Enugu', 'Anambra', 'Delta', 'Plateau', 'Cross River', 'Sokoto', 'Kebbi', 'Katsina', 'Adamawa', 'Accra', 'Kumasi', 'Nairobi', 'Kampala', 'Dar es Salaam'];

interface FormData {
  category: string; cropType: string; customCrop: string; unit: string;
  quantity: string; pricePerUnit: string; quality: string;
  harvestDate: string; expiryDate: string;
  state: string; town: string; farmAddress: string;
  description: string; minOrder: string; bulkDiscount: string; bulkMinQty: string;
  images: string[];
  isOrganic: boolean; isCertified: boolean; acceptsNegotiation: boolean;
}

export default function NewListingPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormData>({
    category: '', cropType: '', customCrop: '', unit: '',
    quantity: '', pricePerUnit: '', quality: 'Grade A (Premium)',
    harvestDate: '', expiryDate: '',
    state: '', town: '', farmAddress: '',
    description: '', minOrder: '1', bulkDiscount: '', bulkMinQty: '',
    images: [],
    isOrganic: false, isCertified: false, acceptsNegotiation: true,
  });

  const set = (k: keyof FormData, v: string | boolean | string[]) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const totalValue = Number(form.quantity) * Number(form.pricePerUnit);
  const suggestions = form.category ? CROP_SUGGESTIONS[form.category] || [] : [];

  const canNext1 = form.category && (form.cropType || form.customCrop) && form.unit && form.quantity && form.pricePerUnit;
  const canNext2 = form.state && form.harvestDate;
  const canSubmit = canNext1 && canNext2 && form.description;

  if (submitted) return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-16">
        <div className="text-center max-w-sm mx-auto p-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-5 animate-bounce">✅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Listing Published!</h2>
          <p className="text-gray-500 mb-2">Your produce is now visible to thousands of buyers across Africa.</p>
          <p className="text-sm text-gray-400 mb-6">Listings typically get enquiries within <span className="font-bold text-gray-700">2–6 hours</span>.</p>
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-6 text-sm text-brand-700">
            <p className="font-bold mb-1">What happens next?</p>
            <ul className="text-left space-y-1 list-disc list-inside">
              <li>Buyers will find your listing in the Marketplace</li>
              <li>You'll get notified when someone places an order</li>
              <li>Payment is held in escrow until delivery is confirmed</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <Link href="/marketplace" className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm text-center hover:bg-gray-50">View Marketplace</Link>
            <Link href="/dashboard" className="flex-1 bg-brand-600 text-white px-6 py-3 rounded-xl font-bold text-sm text-center hover:bg-brand-700">Go to Dashboard</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-2xl">
          {/* Header */}
          <div className="pt-4 mb-6">
            <Link href="/dashboard" className="text-sm text-gray-400 hover:text-brand-600">← Dashboard</Link>
            <h1 className="text-2xl font-black text-gray-900 mt-2">List New Produce</h1>
            <p className="text-gray-500 text-sm">Fill in your produce details to start receiving orders</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${s < step ? 'bg-brand-600' : s === step ? 'bg-brand-400' : 'bg-gray-200'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400 text-right mb-6">Step {step} of 3 — {['Produce Details', 'Location & Dates', 'Photos & Description'][step-1]}</p>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">

            {/* Step 1: Produce details */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-black text-gray-900">Produce Details</h2>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {CROP_CATEGORIES.map(cat => (
                      <button key={cat} onClick={() => { set('category', cat); set('cropType', ''); }}
                        className={`px-3 py-2.5 rounded-xl border-2 text-xs font-semibold text-left transition-all ${form.category === cat ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crop type */}
                {form.category && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Crop Type *</label>
                    {suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {suggestions.map(s => (
                          <button key={s} onClick={() => { set('cropType', s); set('customCrop', ''); }}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${form.cropType === s ? 'bg-brand-600 text-white border-brand-600' : 'bg-gray-100 text-gray-600 border-transparent hover:bg-gray-200'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <input value={form.customCrop} onChange={e => { set('customCrop', e.target.value); set('cropType', ''); }}
                      placeholder="Or type custom crop name..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Unit */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Unit *</label>
                    <select value={form.unit} onChange={e => set('unit', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400 bg-white">
                      <option value="">Select unit</option>
                      {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  {/* Quantity */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Available Qty *</label>
                    <input value={form.quantity} onChange={e => set('quantity', e.target.value)} type="number" min="1" placeholder="e.g. 50"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                  {/* Price */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price per Unit (₦) *</label>
                    <input value={form.pricePerUnit} onChange={e => set('pricePerUnit', e.target.value)} type="number" min="0" placeholder="e.g. 55000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                  {/* Quality */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Quality Grade *</label>
                    <select value={form.quality} onChange={e => set('quality', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400 bg-white">
                      {QUALITIES.map(q => <option key={q}>{q}</option>)}
                    </select>
                  </div>
                </div>

                {totalValue > 0 && (
                  <div className="bg-brand-50 rounded-xl p-3 text-sm text-brand-700">
                    <span className="font-bold">Total listing value: ₦{totalValue.toLocaleString()}</span>
                    <span className="text-brand-500 ml-2">({form.quantity} {form.unit}s × ₦{Number(form.pricePerUnit).toLocaleString()})</span>
                  </div>
                )}

                {/* Bulk discount */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bulk Discount (optional)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={form.bulkMinQty} onChange={e => set('bulkMinQty', e.target.value)} type="number" placeholder="Min qty for discount"
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                    <input value={form.bulkDiscount} onChange={e => set('bulkDiscount', e.target.value)} type="number" placeholder="Discount %" min="0" max="50"
                      className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">e.g. 10+ bags get 8% off</p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {[
                    { key: 'isOrganic' as const, label: 'Organically grown (no synthetic chemicals)', icon: '🌿' },
                    { key: 'isCertified' as const, label: 'Has quality/organic certification', icon: '📜' },
                    { key: 'acceptsNegotiation' as const, label: 'Open to price negotiation', icon: '🤝' },
                  ].map(opt => (
                    <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => set(opt.key, !form[opt.key])}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${form[opt.key] ? 'bg-brand-600 border-brand-600' : 'border-gray-300'}`}>
                        {form[opt.key] && <span className="text-white text-xs font-black">✓</span>}
                      </div>
                      <span className="text-sm text-gray-700">{opt.icon} {opt.label}</span>
                    </label>
                  ))}
                </div>

                <button onClick={() => setStep(2)} disabled={!canNext1}
                  className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Location & Dates */}
            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-lg font-black text-gray-900">Location & Harvest Info</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">State / Region *</label>
                    <select value={form.state} onChange={e => set('state', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400 bg-white">
                      <option value="">Select state</option>
                      {AFRICAN_STATES.map(s => <option key={s}>{s}</option>)}
                      <option value="other">Other (type below)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Town / LGA</label>
                    <input value={form.town} onChange={e => set('town', e.target.value)} placeholder="e.g. Zaria"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Farm Address (for pickup)</label>
                  <input value={form.farmAddress} onChange={e => set('farmAddress', e.target.value)} placeholder="e.g. KM 12 Kano-Zaria Road, near Wudil junction"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Harvest Date *</label>
                    <input value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} type="date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Best Before / Expiry</label>
                    <input value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} type="date"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Minimum Order Quantity</label>
                  <div className="flex gap-2 items-center">
                    <input value={form.minOrder} onChange={e => set('minOrder', e.target.value)} type="number" min="1"
                      className="w-28 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400" />
                    <span className="text-sm text-gray-500">{form.unit || 'units'}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">← Back</button>
                  <button onClick={() => setStep(3)} disabled={!canNext2}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">Continue →</button>
                </div>
              </div>
            )}

            {/* Step 3: Photos & Description */}
            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-lg font-black text-gray-900">Photos & Description</h2>

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Produce Photos (up to 4)</label>
                  <ImageUpload
                    images={form.images}
                    onChange={imgs => set('images', imgs)}
                    maxImages={4}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description *</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)}
                    placeholder="Describe your produce: variety, how it was grown, quality details, storage info, delivery availability..."
                    rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400 resize-none" />
                  <p className="text-xs text-gray-400 mt-1">{form.description.length}/500 characters</p>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 text-sm space-y-2">
                  <p className="font-bold text-gray-900 mb-2">Listing Summary</p>
                  <div className="flex justify-between text-gray-600"><span>Crop</span><span className="font-semibold">{form.cropType || form.customCrop}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Quantity</span><span className="font-semibold">{form.quantity} {form.unit}s</span></div>
                  <div className="flex justify-between text-gray-600"><span>Price</span><span className="font-semibold">₦{Number(form.pricePerUnit).toLocaleString()} / {form.unit}</span></div>
                  <div className="flex justify-between text-gray-600"><span>Location</span><span className="font-semibold">{form.town ? form.town + ', ' : ''}{form.state}</span></div>
                  {form.bulkDiscount && <div className="flex justify-between text-green-700"><span>Bulk deal</span><span className="font-semibold">{form.bulkDiscount}% off {form.bulkMinQty}+</span></div>}
                  {form.isOrganic && <div className="text-green-700 font-semibold">🌿 Organic</div>}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">← Back</button>
                  <button onClick={() => setSubmitted(true)} disabled={!canSubmit}
                    className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-bold disabled:opacity-40 hover:bg-brand-700 transition-colors">
                    🚀 Publish Listing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
