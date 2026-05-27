'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';

const MOCK_TRANSACTIONS = [
  { id: 'TXN001', type: 'credit', description: 'Payment received — Tomatoes (5kg)', amount: 12500, date: '2026-05-25', from: 'Buyer: Adewale Bakare', status: 'completed', ref: 'FLW-REF-001' },
  { id: 'TXN002', type: 'debit', description: 'Withdrawal to GTBank ****7821', amount: 50000, date: '2026-05-22', from: 'Bank Transfer', status: 'completed', ref: 'WD-002' },
  { id: 'TXN003', type: 'credit', description: 'Investment return — Maize Farm Cycle 1', amount: 45000, date: '2026-05-20', from: 'FarmLink Investments', status: 'completed', ref: 'INV-003' },
  { id: 'TXN004', type: 'debit', description: 'Purchase — Catfish (10kg)', amount: 28000, date: '2026-05-18', from: 'Farmer: Emmanuel Okafor', status: 'completed', ref: 'ORD-004' },
  { id: 'TXN005', type: 'credit', description: 'Equipment hire refund — Tractor', amount: 15000, date: '2026-05-15', from: 'Equipment: Kola Adesanya', status: 'completed', ref: 'EQ-005' },
  { id: 'TXN006', type: 'debit', description: 'Transport booking — Lagos → Abuja', amount: 35000, date: '2026-05-12', from: 'Driver: Musa Sule', status: 'completed', ref: 'TRP-006' },
  { id: 'TXN007', type: 'credit', description: 'Payment received — Cassava (2 bags)', amount: 22000, date: '2026-05-10', from: 'Buyer: Fatima Usman', status: 'completed', ref: 'FLW-REF-007' },
  { id: 'TXN008', type: 'pending', description: 'Investment — Tomato Greenhouse Cycle', amount: 200000, date: '2026-05-08', from: 'FarmLink Investments', status: 'pending', ref: 'INV-008' },
];

export default function WalletPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<'overview' | 'history' | 'withdraw'>('overview');
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit' | 'pending'>('all');
  const [withdrawForm, setWithdrawForm] = useState({ bank: '', accountNumber: '', accountName: '', amount: '' });
  const [withdrawStep, setWithdrawStep] = useState<'form' | 'confirm' | 'done'>('form');

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">💳</div>
            <h2 className="text-2xl font-black text-ink mb-3">Sign in to access your wallet</h2>
            <p className="text-gray-500 mb-6">Your FarmLink wallet stores earnings, payments, and investment returns.</p>
            <button onClick={() => router.push('/auth')} className="btn-primary">Sign In</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const balance = 87500;
  const pending = 200000;
  const totalEarned = 384500;

  const filtered = MOCK_TRANSACTIONS.filter(t => filterType === 'all' || t.type === filterType || t.status === filterType);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawStep('confirm');
  };

  const confirmWithdraw = () => setWithdrawStep('done');

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container-tight max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-ink">My Wallet</h1>
            <p className="text-gray-500 text-sm">Manage your FarmLink balance and transactions</p>
          </div>

          {/* Balance cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 text-white rounded-3xl p-6 col-span-1">
              <div className="text-sm text-white/70 mb-1">Available Balance</div>
              <div className="text-4xl font-black mb-1">₦{balance.toLocaleString()}</div>
              <div className="text-xs text-white/60">Updated just now</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center text-lg">⏳</span>
                <span className="text-sm font-semibold text-gray-600">Pending</span>
              </div>
              <div className="text-2xl font-black text-ink">₦{pending.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">1 pending investment</div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-green-100 rounded-xl flex items-center justify-center text-lg">📈</span>
                <span className="text-sm font-semibold text-gray-600">Total Earned</span>
              </div>
              <div className="text-2xl font-black text-ink">₦{totalEarned.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">Lifetime earnings</div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-3 mb-8 flex-wrap">
            <button onClick={() => setTab('withdraw')} className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7l7-7 7 7" /></svg>
              Withdraw
            </button>
            <a href="/marketplace" className="px-5 py-2.5 border-2 border-brand-200 text-brand-600 rounded-xl font-semibold text-sm hover:bg-brand-50 flex items-center gap-2">
              <span>🛒</span> Fund via Purchase
            </a>
            <a href="/invest" className="px-5 py-2.5 border-2 border-brand-200 text-brand-600 rounded-xl font-semibold text-sm hover:bg-brand-50 flex items-center gap-2">
              <span>💼</span> Invest Funds
            </a>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
            {([['overview', 'Overview'], ['history', 'Transaction History'], ['withdraw', 'Withdraw']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Overview tab */}
          {tab === 'overview' && (
            <div className="space-y-6">
              {/* Income breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
                <h3 className="font-bold text-ink mb-4">Income Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Product Sales', amount: 212500, color: 'bg-green-500', pct: 55 },
                    { label: 'Investment Returns', amount: 90000, color: 'bg-blue-500', pct: 23 },
                    { label: 'Equipment Hire', amount: 52000, color: 'bg-purple-500', pct: 14 },
                    { label: 'Transport Earnings', amount: 30000, color: 'bg-orange-500', pct: 8 },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-bold text-ink">₦{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className={`h-2 ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent transactions */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-ink">Recent Transactions</h3>
                  <button onClick={() => setTab('history')} className="text-sm text-brand-600 font-semibold">View all</button>
                </div>
                <div className="space-y-3">
                  {MOCK_TRANSACTIONS.slice(0, 4).map(t => (
                    <div key={t.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${t.type === 'credit' ? 'bg-green-50' : t.type === 'pending' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                          {t.type === 'credit' ? '↓' : t.type === 'pending' ? '⏳' : '↑'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ink leading-snug">{t.description}</p>
                          <p className="text-xs text-gray-400">{t.date}</p>
                        </div>
                      </div>
                      <span className={`font-black text-sm ${t.type === 'credit' ? 'text-green-600' : t.type === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {t.type === 'credit' ? '+' : t.type === 'pending' ? '~' : '-'}₦{t.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* History tab */}
          {tab === 'history' && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-card overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex gap-2 flex-wrap">
                {(['all', 'credit', 'debit', 'pending'] as const).map(f => (
                  <button key={f} onClick={() => setFilterType(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filterType === f ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {f === 'all' ? 'All' : f === 'credit' ? 'Received' : f === 'debit' ? 'Sent' : 'Pending'}
                  </button>
                ))}
              </div>
              <div className="divide-y divide-gray-50">
                {filtered.map(t => (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${t.type === 'credit' ? 'bg-green-50' : t.type === 'pending' ? 'bg-yellow-50' : 'bg-red-50'}`}>
                      {t.type === 'credit' ? '📥' : t.type === 'pending' ? '⏳' : '📤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink text-sm truncate">{t.description}</p>
                      <p className="text-xs text-gray-400">{t.from} · {t.date}</p>
                      <p className="text-xs text-gray-300">Ref: {t.ref}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`font-black text-sm ${t.type === 'credit' ? 'text-green-600' : t.type === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {t.type === 'credit' ? '+' : t.type === 'pending' ? '~' : '-'}₦{t.amount.toLocaleString()}
                      </div>
                      <div className={`text-xs px-2 py-0.5 rounded-full inline-block font-semibold mt-1 ${t.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        {t.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Withdraw tab */}
          {tab === 'withdraw' && (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-card max-w-md">
              {withdrawStep === 'form' && (
                <>
                  <h3 className="font-black text-ink text-lg mb-1">Withdraw Funds</h3>
                  <p className="text-sm text-gray-500 mb-6">Available: <span className="font-bold text-brand-600">₦{balance.toLocaleString()}</span></p>
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Bank Name</label>
                      <select required value={withdrawForm.bank} onChange={e => setWithdrawForm(p => ({ ...p, bank: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm">
                        <option value="">Select bank...</option>
                        {['Access Bank', 'GTBank', 'First Bank', 'Zenith Bank', 'UBA', 'Opay', 'Palmpay', 'Kuda'].map(b => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Account Number</label>
                      <input type="text" required maxLength={10} value={withdrawForm.accountNumber}
                        onChange={e => setWithdrawForm(p => ({ ...p, accountNumber: e.target.value.replace(/\D/g, '') }))}
                        placeholder="0123456789" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Account Name</label>
                      <input type="text" required value={withdrawForm.accountName}
                        onChange={e => setWithdrawForm(p => ({ ...p, accountName: e.target.value }))}
                        placeholder="Full name on account" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase">Amount (₦)</label>
                      <input type="number" required min={1000} max={balance}
                        value={withdrawForm.amount}
                        onChange={e => setWithdrawForm(p => ({ ...p, amount: e.target.value }))}
                        placeholder="Min ₦1,000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                      <p className="text-xs text-gray-400 mt-1">Minimum ₦1,000 · Maximum ₦{balance.toLocaleString()}</p>
                    </div>
                    <button type="submit" className="w-full btn-primary py-3">Continue</button>
                  </form>
                </>
              )}

              {withdrawStep === 'confirm' && (
                <>
                  <h3 className="font-black text-ink text-lg mb-6">Confirm Withdrawal</h3>
                  <div className="space-y-3 mb-6">
                    {[
                      ['Bank', withdrawForm.bank],
                      ['Account', withdrawForm.accountNumber],
                      ['Name', withdrawForm.accountName],
                      ['Amount', `₦${Number(withdrawForm.amount).toLocaleString()}`],
                      ['Fee', '₦100 (bank charge)'],
                      ['You receive', `₦${(Number(withdrawForm.amount) - 100).toLocaleString()}`],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-3">
                        <span className="text-gray-500">{label}</span>
                        <span className="font-bold text-ink">{val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setWithdrawStep('form')} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold text-sm">Edit</button>
                    <button onClick={confirmWithdraw} className="flex-1 btn-primary py-3">Confirm</button>
                  </div>
                </>
              )}

              {withdrawStep === 'done' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="font-black text-ink text-xl mb-2">Withdrawal Submitted!</h3>
                  <p className="text-gray-500 text-sm mb-6">Your withdrawal of <span className="font-bold">₦{Number(withdrawForm.amount).toLocaleString()}</span> to {withdrawForm.bank} will arrive within 1-24 hours.</p>
                  <button onClick={() => { setWithdrawStep('form'); setTab('history'); setWithdrawForm({ bank: '', accountNumber: '', accountName: '', amount: '' }); }}
                    className="btn-primary">View Transactions</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
