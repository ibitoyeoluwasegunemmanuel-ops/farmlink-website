'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

function getCropEmoji(name: string) {
  const t = name.toLowerCase();
  if (t.includes('maize') || t.includes('corn')) return '🌽';
  if (t.includes('tomato')) return '🍅';
  if (t.includes('yam')) return '🍠';
  if (t.includes('cassava') || t.includes('garri')) return '🌿';
  if (t.includes('groundnut') || t.includes('peanut')) return '🥜';
  if (t.includes('palm')) return '🫚';
  if (t.includes('rice') || t.includes('paddy')) return '🌾';
  if (t.includes('soya') || t.includes('soy') || t.includes('bean')) return '🫘';
  if (t.includes('onion')) return '🧅';
  return '🌾';
}

export default function CartPage() {
  const { items, total, count, updateQty, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const platformFee = total * 0.02;
  const logisticsFee = total * 0.05;
  const grandTotal = total + logisticsFee;

  // Group items by farmer
  const byFarmer = items.reduce<Record<string, typeof items>>((acc, item) => {
    const key = item.farmerId || 'unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const handleCheckout = () => {
    if (!isAuthenticated) { router.push('/auth?role=buyer'); return; }
    router.push('/checkout');
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-canvas">
      <Navbar />
      <div className="container-tight py-24 text-center">
        <span className="text-7xl block mb-5">🛒</span>
        <h1 className="text-3xl font-black text-ink mb-3">Your cart is empty</h1>
        <p className="text-gray-400 mb-8">Add some fresh produce from Nigerian farms to get started.</p>
        <Link href="/marketplace" className="btn-primary inline-flex">Browse Marketplace →</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      <div className="container-tight py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-ink">Shopping Cart ({count} {count === 1 ? 'item' : 'items'})</h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">Clear all</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(byFarmer).map(([farmerId, farmerItems]) => (
              <div key={farmerId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Farmer header */}
                <div className="bg-brand-50 border-b border-brand-100 px-5 py-3 flex items-center gap-2">
                  <span className="text-brand-600">🌾</span>
                  <span className="font-semibold text-brand-800 text-sm">{farmerItems[0].farmerName}</span>
                  <span className="text-brand-400 text-xs ml-1">· Verified Seller</span>
                </div>

                {/* Items */}
                {farmerItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-0">
                    {/* Emoji */}
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-50 to-amber-50 flex items-center justify-center text-3xl flex-shrink-0">
                      {getCropEmoji(item.cropType)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-ink text-sm">{item.cropType}</p>
                      <p className="text-gray-400 text-xs">{item.quality || 'Grade A'} · {item.location || 'Nigeria'}</p>
                      <p className="text-brand-700 font-bold text-sm mt-0.5">₦{item.pricePerUnit.toLocaleString()} per {item.unit}</p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-colors font-bold"
                      >−</button>
                      <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-colors font-bold"
                      >+</button>
                    </div>

                    {/* Subtotal + remove */}
                    <div className="text-right flex-shrink-0 min-w-[90px]">
                      <p className="font-black text-ink text-sm">₦{(item.pricePerUnit * item.quantity).toLocaleString()}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 text-xs mt-1 transition-colors"
                      >Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* Continue shopping */}
            <div className="flex items-center justify-between pt-2">
              <Link href="/marketplace" className="text-brand-600 font-semibold text-sm hover:text-brand-700 flex items-center gap-1">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-card p-6">
              <h2 className="font-black text-ink text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({count} items)</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform fee (2%)</span>
                  <span>₦{Math.round(platformFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Logistics fee (5%)</span>
                  <span>₦{Math.round(logisticsFee).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-black text-ink text-base">
                  <span>Total</span>
                  <span>₦{Math.round(grandTotal).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3"
              >
                🔒 Proceed to Checkout
              </button>

              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-center gap-2"><span>🔒</span> All payments held in escrow</div>
                <div className="flex items-center gap-2"><span>⚡</span> Powered by Flutterwave</div>
                <div className="flex items-center gap-2"><span>🛡️</span> Buyer protection guaranteed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
