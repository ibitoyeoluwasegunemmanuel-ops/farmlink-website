'use client';
import { useState } from 'react';

interface Props {
  listingTitle: string;
  askingPrice: number;
  unit: string;
  sellerName: string;
  sellerType?: 'farmer' | 'driver' | 'equipment' | 'landlord' | 'investor';
  onClose: () => void;
}

export default function MakeOfferModal({ listingTitle, askingPrice, unit, sellerName, sellerType = 'farmer', onClose }: Props) {
  const [offerPrice, setOfferPrice] = useState('');
  const [qty, setQty] = useState('1');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'form' | 'sent'>('form');

  const discount = offerPrice && Number(offerPrice) < askingPrice
    ? Math.round(((askingPrice - Number(offerPrice)) / askingPrice) * 100)
    : 0;

  const SELLER_LABELS: Record<string, string> = {
    farmer: '🌾 Farmer', driver: '🚛 Driver', equipment: '⚙️ Equipment Owner',
    landlord: '🏡 Landlord', investor: '💼 Farm Owner',
  };

  const handleSend = () => {
    if (!offerPrice) return;
    setStep('sent');
  };

  if (step === 'sent') return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-sm rounded-3xl p-8 text-center" onClick={e => e.stopPropagation()}>
        <div className="text-5xl mb-4">🤝</div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Offer Sent!</h3>
        <p className="text-gray-500 text-sm mb-2">
          Your offer of <span className="font-black text-brand-700">₦{Number(offerPrice).toLocaleString()}/{unit}</span> has been sent to {sellerName}.
        </p>
        <p className="text-gray-400 text-xs mb-6">They'll respond via your Messages inbox. Usually within 1–4 hours.</p>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-700 mb-6">
          💡 You can also message them directly in <span className="font-bold">Messages</span> to discuss further.
        </div>
        <button onClick={onClose} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition-colors">
          Done
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-br from-brand-700 to-emerald-600 p-5 text-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-white/60 text-xs mb-1">Making an offer to</p>
              <p className="font-black text-lg">{sellerName}</p>
              <p className="text-white/70 text-xs">{SELLER_LABELS[sellerType]}</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white/80 hover:bg-white/30 transition-colors text-sm">✕</button>
          </div>
          <div className="bg-white/15 rounded-xl p-3">
            <p className="text-white/70 text-xs">Listing</p>
            <p className="font-bold text-sm line-clamp-1">{listingTitle}</p>
            <p className="text-white/60 text-xs mt-0.5">Asking: <span className="font-black text-white">₦{askingPrice.toLocaleString()}/{unit}</span></p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Offer price */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Your Offer Price (₦ per {unit})</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₦</span>
              <input
                value={offerPrice}
                onChange={e => setOfferPrice(e.target.value)}
                type="number"
                min="1"
                placeholder={`e.g. ${Math.round(askingPrice * 0.9).toLocaleString()}`}
                className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            {discount > 0 && (
              <p className="text-xs text-amber-600 mt-1 font-semibold">
                {discount}% below asking price · {sellerName} may counter-offer
              </p>
            )}
            {offerPrice && Number(offerPrice) >= askingPrice && (
              <p className="text-xs text-green-600 mt-1 font-semibold">
                ✓ At or above asking price — likely to be accepted quickly
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Quantity ({unit}s)</label>
            <input
              value={qty}
              onChange={e => setQty(e.target.value)}
              type="number"
              min="1"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          {/* Total offer value */}
          {offerPrice && qty && (
            <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between text-sm">
              <span className="text-gray-500">Total offer value</span>
              <span className="font-black text-gray-900">₦{(Number(offerPrice) * Number(qty)).toLocaleString()}</span>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message (optional)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`e.g. "Hi, I'm interested in buying in bulk. Can you do ₦${offerPrice ? Number(offerPrice).toLocaleString() : '...'} for ${qty}+ ${unit}s?"`}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!offerPrice}
              className="flex-1 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              🤝 Send Offer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
