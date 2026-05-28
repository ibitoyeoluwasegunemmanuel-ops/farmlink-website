'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type SupportTab = 'help' | 'chat' | 'tickets' | 'report';

interface FAQ {
  q: string;
  a: string;
  category: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  lastUpdate: string;
}

const FAQS: FAQ[] = [
  { category: 'Payments', q: 'How do I pay for an order?', a: 'FarmLink uses Flutterwave for secure payments. You can pay via card, bank transfer, USSD, or mobile money. All transactions are escrow-protected.' },
  { category: 'Payments', q: 'When does the farmer receive payment?', a: 'Farmers receive payment after you confirm delivery or after 48 hours auto-confirmation. FarmLink holds 2% platform fee.' },
  { category: 'Delivery', q: 'How does FarmLink delivery work?', a: 'You can use FarmLink Logistics (our vetted drivers) or arrange your own pickup. Track all shipments on the Logistics page.' },
  { category: 'Delivery', q: 'What if my goods arrive damaged?', a: 'Open a dispute within 24 hours of delivery. Go to Orders → your order → Report Issue. We investigate and refund if the claim is valid.' },
  { category: 'Account', q: 'How do I verify my identity (KYC)?', a: 'Go to Profile → Get Verified → complete the 6-step KYC. You\'ll need NIN/BVN, selfie, proof of address, and farm photos (for farmers).' },
  { category: 'Account', q: 'Can I use FarmLink outside Nigeria?', a: 'Yes! FarmLink supports Nigeria, Ghana, Kenya, South Africa, Ethiopia, and more. Switch country in Marketplace settings.' },
  { category: 'Selling', q: 'How do I list my produce for sale?', a: 'Go to Dashboard → Farmer → New Listing. Add photos, set price, quantity and delivery options. Your listing goes live immediately.' },
  { category: 'Selling', q: 'What is the FarmLink platform fee?', a: 'FarmLink charges 2% on completed transactions. Logistics costs 5% of order value. Farmers receive 93% net.' },
  { category: 'Invest', q: 'Is my investment in FarmLink safe?', a: 'FarmLink investment pools are insured up to ₦5M per investor. Returns are 15–42% depending on the pool and risk level.' },
];

const TICKETS: Ticket[] = [
  { id: 'TKT-10021', subject: 'Payment not received after delivery', status: 'in_progress', createdAt: 'May 25', lastUpdate: '2h ago' },
  { id: 'TKT-10018', subject: 'Wrong product delivered — need refund', status: 'resolved', createdAt: 'May 22', lastUpdate: 'May 24' },
  { id: 'TKT-10009', subject: 'Can\'t update my phone number', status: 'closed', createdAt: 'May 18', lastUpdate: 'May 19' },
];

const TICKET_COLOR = {
  open: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
};

const CATEGORIES = ['All', 'Payments', 'Delivery', 'Account', 'Selling', 'Invest'];

interface Message { role: 'user' | 'agent'; text: string; time: string; }

const BOT_RESPONSES: Record<string, string> = {
  payment: 'Payments are processed through Flutterwave escrow. Farmers receive funds 48 hours after confirmed delivery. Need help with a specific payment issue?',
  deliver: 'For delivery issues, go to Orders → [your order] → Report Issue within 24 hours. Our team investigates within 24 hours.',
  refund: 'Refund requests must be made within 24 hours of delivery. Go to Orders → your order → Report Issue and select "Request Refund". We aim to resolve in 3-5 days.',
  verify: 'KYC verification requires NIN/BVN, a selfie, proof of address, and farm photos (farmers). Go to Profile → Get Verified.',
  list: 'To list produce: Dashboard → Farmer Dashboard → New Listing. Add photos, description, price, quantity and delivery options.',
  default: 'Thanks for your message! Our support team typically responds within 2-4 hours. Is there anything specific I can help clarify right now?',
};

function getResponse(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('pay') || t.includes('money') || t.includes('transfer')) return BOT_RESPONSES.payment;
  if (t.includes('deliv') || t.includes('track') || t.includes('shipment')) return BOT_RESPONSES.deliver;
  if (t.includes('refund') || t.includes('return') || t.includes('damage')) return BOT_RESPONSES.refund;
  if (t.includes('verify') || t.includes('kyc') || t.includes('nin') || t.includes('bvn')) return BOT_RESPONSES.verify;
  if (t.includes('list') || t.includes('sell') || t.includes('post')) return BOT_RESPONSES.list;
  return BOT_RESPONSES.default;
}

export default function SupportPage() {
  const [tab, setTab] = useState<SupportTab>('help');
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'agent', text: 'Hi! 👋 I\'m the FarmLink support assistant. How can I help you today?', time: 'Just now' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sending, setSending] = useState(false);
  const [reportForm, setReportForm] = useState({ type: '', subject: '', desc: '' });
  const [reportDone, setReportDone] = useState(false);

  const filteredFAQs = FAQS.filter(f => {
    const matchCat = category === 'All' || f.category === category;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg: Message = { role: 'user', text: chatInput, time: 'Just now' };
    setMessages(ms => [...ms, userMsg]);
    setChatInput('');
    setSending(true);
    await new Promise(r => setTimeout(r, 1200));
    const response = getResponse(userMsg.text);
    setMessages(ms => [...ms, { role: 'agent', text: response, time: 'Just now' }]);
    setSending(false);
  };

  const submitReport = async () => {
    if (!reportForm.subject || !reportForm.desc) return;
    await new Promise(r => setTimeout(r, 1000));
    setReportDone(true);
  };

  const tabs: { key: SupportTab; icon: string; label: string }[] = [
    { key: 'help', icon: '❓', label: 'FAQ' },
    { key: 'chat', icon: '💬', label: 'Live Chat' },
    { key: 'tickets', icon: '🎫', label: 'My Tickets' },
    { key: 'report', icon: '📝', label: 'Report Issue' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-xl mx-auto px-3 pb-24">
        {/* Header */}
        <div className="pt-5 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">Help &amp; Support</h1>
          <p className="text-sm text-gray-500 mt-0.5">We&apos;re here to help — 24/7 support</p>
        </div>

        {/* Quick contact */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { icon: '💬', label: 'Live Chat', sub: 'Avg 2 min reply' },
            { icon: '📞', label: 'Call Us', sub: '0800-FARMLINK' },
            { icon: '📧', label: 'Email', sub: 'support@farmlink.ng' },
          ].map((c, i) => (
            <button key={i} onClick={() => i === 0 ? setTab('chat') : undefined}
              className="bg-white rounded-2xl p-3 text-center border border-gray-100 shadow-sm hover:border-brand-300 transition">
              <p className="text-2xl mb-1">{c.icon}</p>
              <p className="text-xs font-bold text-gray-800">{c.label}</p>
              <p className="text-xs text-gray-400">{c.sub}</p>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold transition ${tab === t.key ? 'bg-brand-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}>
              <span>{t.icon}</span><span className="hidden sm:block">{t.label}</span>
            </button>
          ))}
        </div>

        {/* FAQ */}
        {tab === 'help' && (
          <div className="space-y-4">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search for help..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
            <div className="flex gap-2 overflow-x-auto pb-1">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition ${category === c ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-300'}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredFAQs.map((f, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition">
                    <div className="flex items-start gap-3">
                      <span className="text-brand-500 flex-shrink-0 mt-0.5">❓</span>
                      <p className="text-sm font-semibold text-gray-900 pr-2">{f.q}</p>
                    </div>
                    <span className={`text-gray-400 flex-shrink-0 transition-transform ${openFAQ === i ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {openFAQ === i && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="bg-brand-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed border-l-4 border-brand-400">
                        {f.a}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {filteredFAQs.length === 0 && (
                <div className="text-center py-10 text-gray-400">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-sm">No results found. <button onClick={() => setTab('chat')} className="text-brand-600 underline">Ask our team →</button></p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Live Chat */}
        {tab === 'chat' && (
          <div className="flex flex-col" style={{ height: '60vh' }}>
            <div className="bg-brand-600 rounded-2xl p-3 mb-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
              <div className="flex-1">
                <p className="text-white text-sm font-bold">FarmLink Support</p>
                <p className="text-green-200 text-xs">Online · Avg response: 2 min</p>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 overflow-y-auto space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {m.role === 'agent' && (
                    <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🤖</div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-sm ${m.role === 'user' ? 'bg-brand-600 text-white rounded-tr-none' : 'bg-gray-50 text-gray-800 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-sm">🤖</div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-none px-3 py-2.5">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type your question..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
              <button onClick={sendMessage} disabled={!chatInput.trim() || sending}
                className="bg-brand-600 text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-brand-700 transition disabled:opacity-40">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Tickets */}
        {tab === 'tickets' && (
          <div className="space-y-4">
            <button onClick={() => setTab('report')} className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-brand-700 transition">
              + Open New Ticket
            </button>
            {TICKETS.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">{t.id}</p>
                    <p className="text-sm font-bold text-gray-900">{t.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">Created {t.createdAt} · Updated {t.lastUpdate}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${TICKET_COLOR[t.status]}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <button className="mt-3 text-xs text-brand-600 font-semibold hover:underline">
                  View Ticket →
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Report */}
        {tab === 'report' && (
          <div className="space-y-4">
            {reportDone ? (
              <div className="text-center py-14 px-4">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ticket Submitted!</h3>
                <p className="text-gray-500 text-sm mb-2">Your ticket ID: <strong className="text-brand-700">TKT-{Math.floor(Math.random() * 90000 + 10000)}</strong></p>
                <p className="text-xs text-gray-400 mb-6">We&apos;ll respond within 4 hours. Check My Tickets for updates.</p>
                <button onClick={() => { setReportDone(false); setReportForm({ type: '', subject: '', desc: '' }); setTab('tickets'); }}
                  className="bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-brand-700 transition">
                  View My Tickets
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900">Report an Issue</h3>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Issue Type *</label>
                  <select value={reportForm.type} onChange={e => setReportForm(f => ({ ...f, type: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300">
                    <option value="">Select issue type</option>
                    {['Payment Problem', 'Order Issue / Dispute', 'Delivery Problem', 'Account Problem', 'Fraud / Scam Report', 'Technical Bug', 'Other'].map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Subject *</label>
                  <input value={reportForm.subject} onChange={e => setReportForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="Brief title of your issue"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
                  <textarea value={reportForm.desc} onChange={e => setReportForm(f => ({ ...f, desc: e.target.value }))}
                    placeholder="Describe your issue in detail. Include order numbers, dates, amounts, etc."
                    rows={5}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-300 resize-none" />
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-brand-300 transition">
                  <p className="text-2xl mb-1">📎</p>
                  <p className="text-sm text-gray-500">Attach screenshot (optional)</p>
                </div>
                <button onClick={submitReport}
                  disabled={!reportForm.type || !reportForm.subject || !reportForm.desc}
                  className="w-full bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition disabled:opacity-40">
                  Submit Ticket
                </button>
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
