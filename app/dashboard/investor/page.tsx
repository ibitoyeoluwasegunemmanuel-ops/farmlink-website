'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../contexts/AuthContext';

const MOCK_OPPORTUNITIES = [
  { id: 'inv1', title: 'Maize Farm Expansion — Kano', farmer: 'Ibrahim Musa', target: 2500000, raised: 1750000, returns: '18% in 6 months', risk: 'Low', category: 'Crop Farming', state: 'Kano', minInvestment: 50000 },
  { id: 'inv2', title: 'Poultry Processing Plant', farmer: 'Bola Adeyemi', target: 8000000, raised: 3200000, returns: '24% in 12 months', risk: 'Medium', category: 'Livestock', state: 'Ogun', minInvestment: 100000 },
  { id: 'inv3', title: 'Tomato Greenhouse Project', farmer: 'Emeka Okafor', target: 1500000, raised: 1500000, returns: '22% in 4 months', risk: 'Low', category: 'Horticulture', state: 'Anambra', minInvestment: 25000 },
  { id: 'inv4', title: 'Irrigation Infrastructure', farmer: 'Yusuf Bello', target: 5000000, raised: 800000, returns: '15% in 8 months', risk: 'Low', category: 'Infrastructure', state: 'Katsina', minInvestment: 100000 },
];

const MOCK_PORTFOLIO = [
  { id: 'p1', title: 'Rice Farm — Ebonyi State', amount: 200000, returns: 36000, status: 'active', due: '2026-03-15' },
  { id: 'p2', title: 'Cassava Processing — Delta', amount: 500000, returns: 95000, status: 'completed', due: '2025-11-01' },
];

const RISK_COLORS: Record<string, string> = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-red-100 text-red-600',
};

export default function InvestorDashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'opportunities' | 'portfolio' | 'overview'>('overview');
  const [selected, setSelected] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [invested, setInvested] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace('/auth');
  }, [loading, isAuthenticated, router]);

  if (loading || !user) return (
    <div className="min-h-screen bg-canvas flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalInvested = MOCK_PORTFOLIO.reduce((s, p) => s + p.amount, 0);
  const totalReturns = MOCK_PORTFOLIO.reduce((s, p) => s + p.returns, 0);

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvesting(true);
    await new Promise(r => setTimeout(r, 1000));
    setInvesting(false);
    setInvested(selected?.id);
    setSelected(null);
    setAmount('');
    setTimeout(() => setInvested(null), 4000);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <div className="bg-brand-950 pt-16 pb-0">
        <div className="container-tight">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-brand-300 text-sm">Investor Dashboard</p>
              <h1 className="text-3xl font-black text-white">{user.fullName || 'Investor'} 💼</h1>
            </div>
            <button onClick={() => { logout(); router.push('/'); }} className="text-brand-400 hover:text-brand-200 text-sm font-medium transition-colors">Sign out</button>
          </div>

          <div className="flex gap-1 border-b border-white/10">
            {(['overview', 'opportunities', 'portfolio'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                  tab === t ? 'border-brand-400 text-brand-300' : 'border-transparent text-brand-500 hover:text-brand-300'
                }`}
              >
                {t === 'opportunities' ? `Opportunities (${MOCK_OPPORTUNITIES.filter(o => o.raised < o.target).length})` : t === 'portfolio' ? `My Portfolio (${MOCK_PORTFOLIO.length})` : 'Overview'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container-tight py-8 space-y-6">
        {invested && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 text-green-700 font-semibold text-sm">
            <span className="text-xl">🎉</span> Investment submitted! You will receive confirmation shortly.
          </div>
        )}

        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Invested', value: `₦${totalInvested.toLocaleString()}`, icon: '💼' },
                { label: 'Total Returns', value: `₦${totalReturns.toLocaleString()}`, icon: '📈' },
                { label: 'ROI', value: `${((totalReturns / totalInvested) * 100).toFixed(1)}%`, icon: '🎯' },
                { label: 'Active Deals', value: String(MOCK_PORTFOLIO.filter(p => p.status === 'active').length), icon: '⚡' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <span className="text-2xl block mb-2">{s.icon}</span>
                  <p className="font-black text-ink text-lg">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Payments & Withdrawal */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-black text-ink text-lg">Payments & Wallet</h2>
                <Link href="/wallet" className="text-sm text-brand-600 font-semibold">Full Wallet →</Link>
              </div>
              {/* Balance */}
              <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-5 text-white mb-4">
                <p className="text-white/70 text-sm">Available Balance</p>
                <p className="text-3xl font-black mt-1">₦87,500</p>
                <p className="text-white/50 text-xs mt-1">Updated just now</p>
              </div>
              {/* Quick withdraw */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Link href="/wallet" className="flex flex-col items-center gap-1.5 bg-green-50 rounded-2xl p-4 hover:bg-green-100 transition-colors">
                  <span className="text-2xl">💸</span>
                  <span className="text-xs font-bold text-green-800">Withdraw</span>
                </Link>
                <Link href="/wallet#history" className="flex flex-col items-center gap-1.5 bg-blue-50 rounded-2xl p-4 hover:bg-blue-100 transition-colors">
                  <span className="text-2xl">📋</span>
                  <span className="text-xs font-bold text-blue-800">History</span>
                </Link>
              </div>
              {/* Recent transactions */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Recent</p>
                {[
                  { label: 'Investment return — Rice Farm', amount: '+₦45,000', date: 'Today', color: 'text-green-600' },
                  { label: 'Withdrawal to GTBank', amount: '-₦30,000', date: 'Yesterday', color: 'text-red-500' },
                  { label: 'Investment return — Cassava', amount: '+₦28,000', date: '2 days ago', color: 'text-green-600' },
                ].map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.label}</p>
                      <p className="text-xs text-gray-400">{t.date}</p>
                    </div>
                    <span className={`font-black text-sm ${t.color}`}>{t.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-950 rounded-2xl p-6">
              <h2 className="font-black text-white text-lg mb-2">Why Invest in Agriculture?</h2>
              <p className="text-brand-300 text-sm mb-4">Nigeria's agricultural sector is the backbone of the economy. Invest in verified farmers and earn guaranteed returns while supporting food security.</p>
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                {[
                  { icon: '🔒', label: 'Secured Returns', desc: 'All investments protected by FarmLink escrow' },
                  { icon: '📊', label: '15–30% ROI', desc: 'Average returns higher than traditional savings' },
                  { icon: '🌾', label: 'Verified Farmers', desc: 'Only KYC-verified farmers get investment access' },
                ].map(f => (
                  <div key={f.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <span className="text-xl block mb-1">{f.icon}</span>
                    <p className="font-bold text-white text-sm">{f.label}</p>
                    <p className="text-brand-400 text-xs mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => setTab('opportunities')} className="btn-primary text-sm py-2.5 px-5">Browse Opportunities →</button>
            </div>
          </>
        )}

        {tab === 'opportunities' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {MOCK_OPPORTUNITIES.map(opp => {
              const pct = Math.round((opp.raised / opp.target) * 100);
              const full = opp.raised >= opp.target;
              return (
                <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-all p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-black text-ink text-base leading-tight">{opp.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">by {opp.farmer} · {opp.state}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${RISK_COLORS[opp.risk]}`}>{opp.risk} Risk</span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Target</span>
                      <span className="font-bold text-ink">₦{opp.target.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Raised</span>
                      <span className="font-bold text-brand-700">₦{opp.raised.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Returns</span>
                      <span className="font-bold text-green-700">{opp.returns}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Min. Investment</span>
                      <span className="font-bold text-ink">₦{opp.minInvestment.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                    <div className="bg-brand-500 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>

                  <button
                    onClick={() => !full && setSelected(opp)}
                    disabled={full}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                      full ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-500 active:scale-95 text-white'
                    }`}
                  >
                    {full ? '✓ Fully Funded' : 'Invest Now →'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'portfolio' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-black text-ink text-lg mb-4">My Investments</h2>
            {MOCK_PORTFOLIO.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">💼</p>
                <p className="text-gray-400 text-sm">No investments yet. Browse opportunities to get started.</p>
                <button onClick={() => setTab('opportunities')} className="btn-primary text-sm py-2 px-4 mt-4">Browse Opportunities</button>
              </div>
            ) : (
              <div className="space-y-3">
                {MOCK_PORTFOLIO.map(p => (
                  <div key={p.id} className="border border-gray-100 rounded-xl p-4 hover:border-brand-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-ink text-sm">{p.title}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Due {new Date(p.due).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                        {p.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div>
                        <p className="text-xs text-gray-400">Invested</p>
                        <p className="font-black text-ink text-sm">₦{p.amount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Expected Return</p>
                        <p className="font-black text-green-700 text-sm">+₦{p.returns.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Investment modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-ink text-lg">Invest in {selected.title}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <div className="bg-brand-50 rounded-xl p-3 mb-4 text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-gray-500">Expected returns</span>
                <span className="font-bold text-green-700">{selected.returns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Min. investment</span>
                <span className="font-bold text-ink">₦{selected.minInvestment.toLocaleString()}</span>
              </div>
            </div>
            <form onSubmit={handleInvest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Investment Amount (₦) *</label>
                <input
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={`Min ₦${selected.minInvestment.toLocaleString()}`}
                  required
                  type="number"
                  min={selected.minInvestment}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20"
                />
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                ⚠️ You will be redirected to complete payment via Flutterwave. Returns are not guaranteed and depend on harvest outcomes.
              </div>
              <button type="submit" disabled={investing} className="w-full bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                {investing ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                {investing ? 'Processing...' : '💼 Confirm Investment'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
