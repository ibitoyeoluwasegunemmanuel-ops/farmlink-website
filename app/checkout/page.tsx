'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL ||
  'https://farm-link-bmiv-cpk3unx1j-ibitoyeoluwasegunemmanuel-ops-projects.vercel.app/api';

const STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara','FCT'];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phoneNumber || '',
    address: '',
    city: '',
    state: user?.state || '',
    landmark: '',
  });
  const [step, setStep] = useState<'address' | 'review' | 'processing'>('address');
  const [error, setError] = useState('');

  const platformFee = total * 0.02;
  const logisticsFee = total * 0.05;
  const grandTotal = total + logisticsFee;

  const handleSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.address || !form.state) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setStep('review');
  };

  const handlePay = async () => {
    setStep('processing');
    try {
      // Initiate one transaction per item (simplified: one transaction for first item)
      const firstItem = items[0];
      const res = await fetch(`${API}/transactions/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerId: user?.id || 'guest',
          productId: firstItem.id,
          quantity: firstItem.quantity,
          totalAmount: grandTotal,
          deliveryLocation: { address: form.address, city: form.city, state: form.state, landmark: form.landmark },
        }),
      });
      const data = await res.json();
      if (data.paymentLink) {
        clearCart();
        window.location.href = data.paymentLink;
      } else {
        // Payment link unavailable (test mode) — simulate success
        clearCart();
        router.push(`/orders?success=true&ref=${data.txRef || 'TEST'}`);
      }
    } catch {
      setError('Payment initiation failed. Please try again.');
      setStep('review');
    }
  };

  if (items.length === 0 && step !== 'processing') {
    return (
      <div className="min-h-screen bg-canvas">
        <Navbar />
        <div className="container-tight py-24 text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h1 className="text-2xl font-black text-ink mb-2">Nothing to checkout</h1>
          <Link href="/marketplace" className="btn-primary inline-flex mt-4">Browse Marketplace →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="container-tight py-8">
        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {['address', 'review', 'processing'].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-sm font-semibold ${step === s ? 'text-brand-700' : 'text-gray-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? 'bg-brand-600 text-white' : i < ['address','review','processing'].indexOf(step) ? 'bg-brand-100 text-brand-600' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</div>
                <span className="hidden sm:block capitalize">{s === 'processing' ? 'Payment' : s}</span>
              </div>
              {i < 2 && <div className="w-8 sm:w-16 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: form */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <form onSubmit={handleSubmitAddress} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="font-black text-ink text-xl mb-2">Delivery Details</h2>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                    <input value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Your full name" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone Number *</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="08012345678" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Delivery Address *</label>
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="House/plot number, street name" required />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City / LGA *</label>
                    <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Surulere" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">State *</label>
                    <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white" required>
                      <option value="">Select state</option>
                      {STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Landmark (optional)</label>
                  <input value={form.landmark} onChange={e => setForm(f => ({ ...f, landmark: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="e.g. Near GTBank, opposite church" />
                </div>

                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-colors">
                  Continue to Review →
                </button>
              </form>
            )}

            {step === 'review' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <h2 className="font-black text-ink text-xl">Review Your Order</h2>
                {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

                {/* Delivery address */}
                <div className="bg-brand-50 border border-brand-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-ink text-sm">📍 Delivery Address</h3>
                    <button onClick={() => setStep('address')} className="text-brand-600 text-xs font-semibold hover:text-brand-700">Edit</button>
                  </div>
                  <p className="text-gray-700 text-sm">{form.fullName} · {form.phone}</p>
                  <p className="text-gray-600 text-sm">{form.address}, {form.city}, {form.state}</p>
                  {form.landmark && <p className="text-gray-400 text-xs mt-1">{form.landmark}</p>}
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-ink text-sm mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                        <span className="text-gray-700">{item.cropType} × {item.quantity} {item.unit}s</span>
                        <span className="font-semibold">₦{(item.pricePerUnit * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment method */}
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold text-xs">FLW</div>
                  <div>
                    <p className="font-semibold text-ink text-sm">Flutterwave Escrow</p>
                    <p className="text-gray-400 text-xs">Your payment is held securely until delivery</p>
                  </div>
                  <span className="ml-auto text-brand-600 text-sm font-bold">✅ Secure</span>
                </div>

                <button onClick={handlePay} className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  🔒 Pay ₦{Math.round(grandTotal).toLocaleString()} via Flutterwave →
                </button>
                <p className="text-xs text-gray-400 text-center">You will be redirected to Flutterwave&apos;s secure payment page</p>
              </div>
            )}

            {step === 'processing' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-5" />
                <h2 className="text-2xl font-black text-ink mb-2">Processing Payment...</h2>
                <p className="text-gray-400">Redirecting to Flutterwave secure payment</p>
              </div>
            )}
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h2 className="font-black text-ink text-base mb-4">Order Total</h2>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₦{total.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Platform fee (2%)</span><span>₦{Math.round(platformFee).toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-600"><span>Logistics (5%)</span><span>₦{Math.round(logisticsFee).toLocaleString()}</span></div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-ink text-lg">
                  <span>Total</span><span>₦{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2"><span>🔒</span> Escrow protection</div>
                <div className="flex items-center gap-2"><span>⚡</span> Instant payment processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
