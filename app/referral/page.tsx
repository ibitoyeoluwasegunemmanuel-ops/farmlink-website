'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const HISTORY = [
  { name: 'Adebayo Ogundimu', date: '2026-05-20', status: 'completed', earned: 2000 },
  { name: 'Chioma Eze', date: '2026-05-15', status: 'completed', earned: 2000 },
  { name: 'Musa Aliyu', date: '2026-05-10', status: 'completed', earned: 2000 },
  { name: 'Blessing Okeke', date: '2026-05-08', status: 'pending', earned: 0 },
  { name: 'Tunde Adeyemi', date: '2026-05-01', status: 'pending', earned: 0 },
];

const TIERS = [
  { label: 'Starter', range: '1–5 referrals', reward: '₦2,000', color: 'bg-gray-100 text-gray-700', icon: '🌱' },
  { label: 'Silver', range: '6–20 referrals', reward: '₦2,500', color: 'bg-gray-200 text-gray-800', icon: '🥈' },
  { label: 'Gold', range: '21–50 referrals', reward: '₦3,000', color: 'bg-amber-100 text-amber-800', icon: '🥇' },
  { label: 'Platinum', range: '50+ referrals', reward: '₦4,000', color: 'bg-purple-100 text-purple-800', icon: '💎' },
];

export default function ReferralPage() {
  const { user, isAuthenticated } = useAuth();
  const [copied, setCopied] = useState(false);
  const userId = user?.id || 'FL12345';
  const refLink = `https://farmlink.africa/join?ref=${userId}`;

  const copy = () => {
    navigator.clipboard.writeText(refLink).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const shareWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(`🌾 Join FarmLink — Africa's Agricultural Marketplace! Buy fresh produce, invest in farms, book transport and more. Use my link to get started: ${refLink}`)}`);
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm using FarmLink to buy fresh produce and invest in African farms. Join with my link and let's grow together! 🌾 ${refLink}`)}`);

  const stats = { referred: 5, successful: 3, earned: 6000, pending: 4000 };
  const currentTier = TIERS[0];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-3xl">

          {/* Hero */}
          <div className="bg-gradient-to-br from-brand-700 via-brand-600 to-emerald-500 rounded-3xl p-8 text-white mb-6 mt-4">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">💰 Referral Program</div>
                <h1 className="text-3xl font-black mb-2">Earn ₦2,000 for every<br />friend you refer</h1>
                <p className="text-white/70 text-sm max-w-md">When someone signs up with your link and completes their first order, you earn instantly. No cap on earnings.</p>
              </div>
              <div className="text-center bg-white/15 rounded-2xl p-5">
                <div className="text-4xl font-black">₦{stats.earned.toLocaleString()}</div>
                <div className="text-white/60 text-sm mt-1">Total Earned</div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[['Referred', stats.referred], ['Successful', stats.successful], ['Pending', `₦${stats.pending.toLocaleString()}`]].map(([l, v]) => (
                <div key={l as string} className="bg-white/15 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black">{v}</div>
                  <div className="text-xs text-white/60 mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Referral link */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 mb-5">
            <h2 className="font-black text-gray-900 mb-4">Your Referral Link</h2>
            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 truncate font-mono">{refLink}</div>
              <button onClick={copy} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${copied ? 'bg-green-600 text-white' : 'bg-brand-600 text-white hover:bg-brand-700'}`}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mb-4">Share this link with friends. They get ₦500 off their first order too!</p>
            <div className="flex gap-3">
              <button onClick={shareWhatsApp} className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                WhatsApp
              </button>
              <button onClick={shareTwitter} className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </button>
              <button onClick={copy} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm transition-colors">
                🔗 Copy Link
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {/* How it works */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
              <h2 className="font-black text-gray-900 mb-5">How It Works</h2>
              <div className="space-y-4">
                {[
                  { step: '1', icon: '🔗', title: 'Share your link', desc: 'Send your unique referral link to friends via WhatsApp, SMS, or social media' },
                  { step: '2', icon: '👤', title: 'Friend signs up', desc: 'They create a FarmLink account using your link' },
                  { step: '3', icon: '🛒', title: 'They complete an order', desc: 'Your friend places and completes their first order or investment' },
                  { step: '4', icon: '💸', title: 'You earn instantly', desc: 'Your ₦2,000+ reward is added to your FarmLink wallet immediately' },
                ].map(s => (
                  <div key={s.step} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-brand-600 text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0">{s.step}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{s.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reward tiers */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
              <h2 className="font-black text-gray-900 mb-1">Reward Tiers</h2>
              <p className="text-xs text-gray-400 mb-4">The more you refer, the more you earn per referral</p>
              <div className="space-y-3">
                {TIERS.map((t, i) => (
                  <div key={t.label} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'border-2 border-brand-300 bg-brand-50' : ''}`}>
                    <span className="text-2xl">{t.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{t.label}</span>
                        {i === 0 && <span className="text-xs bg-brand-600 text-white px-2 py-0.5 rounded-full font-bold">CURRENT</span>}
                      </div>
                      <p className="text-xs text-gray-500">{t.range}</p>
                    </div>
                    <span className={`font-black text-sm px-3 py-1.5 rounded-xl ${t.color}`}>{t.reward}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">Minimum withdrawal: ₦5,000 → paid to your FarmLink wallet</p>
            </div>
          </div>

          {/* Referral history */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-black text-gray-900">Referral History</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {HISTORY.map((h, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-9 h-9 bg-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-black text-sm flex-shrink-0">{h.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.date}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${h.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                      {h.status}
                    </span>
                    {h.earned > 0 && <p className="text-sm font-black text-green-600 mt-1">+₦{h.earned.toLocaleString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
