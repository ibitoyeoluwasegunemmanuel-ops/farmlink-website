'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

const ROLES = [
  {
    key: 'farmer',
    emoji: '🌾',
    title: 'Farmer',
    headline: 'Sell your harvest to 50,000+ buyers',
    color: 'from-brand-800 to-brand-600',
    border: 'border-brand-500',
    can: [
      'Post harvest listings (crops, produce, seeds)',
      'List land for lease or sale',
      'Receive secure escrow payments',
      'Access AI crop disease scanner',
      'View live market commodity prices',
      'Get farm advisory alerts',
    ],
  },
  {
    key: 'buyer',
    emoji: '🏪',
    title: 'Buyer / Trader',
    headline: 'Source fresh produce with escrow protection',
    color: 'from-blue-800 to-blue-600',
    border: 'border-blue-500',
    can: [
      'Browse thousands of farm listings',
      'Buy with full escrow protection',
      'Book integrated delivery',
      'Track orders in real-time',
      'Rate and review farmers',
      'Bulk order discounts',
    ],
  },
  {
    key: 'transporter',
    emoji: '🚛',
    title: 'Transporter',
    headline: 'Earn with your truck on your schedule',
    color: 'from-amber-700 to-amber-500',
    border: 'border-amber-500',
    can: [
      'Post your truck (type, capacity, routes)',
      'Get matched with delivery jobs near you',
      'Earn guaranteed payment on completion',
      'Build your delivery reputation score',
      'View route history and earnings',
      'Get paid same day after delivery',
    ],
  },
  {
    key: 'equipment',
    emoji: '🚜',
    title: 'Equipment Owner',
    headline: 'Monetise your idle tractors & machinery',
    color: 'from-violet-800 to-violet-600',
    border: 'border-violet-500',
    can: [
      'Post tractors, pumps, harvesters',
      'Set daily or weekly rental rates',
      'Manage booking calendar',
      'Get paid upfront for bookings',
      'Insurance verification support',
      'Track equipment usage history',
    ],
  },
  {
    key: 'investor',
    emoji: '💼',
    title: 'Investor',
    headline: 'Fund Nigerian farms, earn returns',
    color: 'from-rose-800 to-rose-600',
    border: 'border-rose-500',
    can: [
      'Browse verified farm investment opportunities',
      'Invest from ₦50,000 minimum',
      'Receive quarterly progress reports',
      'Track portfolio performance live',
      'Earn 15-35% annual returns',
      'Exit via buyback guarantee',
    ],
  },
];

function JoinContent() {
  const router = useRouter();
  const params = useSearchParams();
  const preSelected = params.get('role');

  const handleSelect = (roleKey: string) => {
    router.push(`/auth?role=${roleKey}`);
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="bg-brand-950 pt-16 pb-10">
        <div className="container-tight text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center"><span className="text-white font-black text-sm">FL</span></div>
            <span className="text-white font-bold text-lg">Farm<span className="text-brand-300">Link</span></span>
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">Who are you?</h1>
          <p className="text-brand-200/60 text-lg">Choose your role to set up the right account for you</p>
        </div>
      </div>

      <div className="container-tight py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ROLES.map(r => (
            <button
              key={r.key}
              onClick={() => handleSelect(r.key)}
              className={`group text-left bg-white rounded-2xl border-2 ${preSelected === r.key ? r.border + ' shadow-lg' : 'border-gray-100'} hover:border-opacity-100 hover:${r.border} hover:shadow-card-hover transition-all duration-300 overflow-hidden`}
            >
              {/* Card header */}
              <div className={`bg-gradient-to-br ${r.color} p-6 relative overflow-hidden`}>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 translate-y-8" />
                <span className="text-5xl block mb-3">{r.emoji}</span>
                <h3 className="text-white font-black text-xl">{r.title}</h3>
                <p className="text-white/70 text-sm mt-1">{r.headline}</p>
              </div>

              {/* What you can do */}
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">What you can do</p>
                <ul className="space-y-2">
                  {r.can.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-brand-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-gray-400">Free to join</span>
                  <span className={`text-sm font-bold text-white bg-gradient-to-r ${r.color} px-4 py-2 rounded-xl group-hover:opacity-90 transition-opacity`}>
                    Join as {r.title} →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account?{' '}
          <Link href="/auth" className="text-brand-600 font-semibold hover:text-brand-700">Sign in →</Link>
        </p>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <JoinContent />
    </Suspense>
  );
}
