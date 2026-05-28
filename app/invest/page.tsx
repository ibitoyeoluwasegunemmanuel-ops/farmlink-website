'use client';
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';

const OPPORTUNITIES = [
  {
    id: 'inv1', title: 'Maize Farm Expansion — 50 Hectares', farmer: 'Ibrahim Musa Farms', farmerInitials: 'IM', farmerBg: 'bg-brand-700',
    state: 'Kano', lga: 'Kumbotso', target: 2500000, raised: 1750000, returnPct: 18, durationMonths: 6,
    risk: 'Low', category: 'Grain Farming', minInvestment: 50000, investors: 12, verified: true,
    desc: 'Funding expansion of an existing maize farm from 20 to 50 hectares. Ibrahim has 8 years of experience and has successfully completed 3 previous investment cycles with 100% repayment.',
    tags: ['Maize', 'Expansion', 'Kano'],
    milestones: ['Land prepared and ready', 'Seeds purchased', 'Irrigation in place'],
    returns: [{ period: 'Month 3', event: 'Crop growth update + photos' }, { period: 'Month 6', event: 'Harvest + full payout' }],
  },
  {
    id: 'inv2', title: 'Integrated Poultry + Feed Mill', farmer: 'Bola Adeyemi Farms', farmerInitials: 'BA', farmerBg: 'bg-amber-700',
    state: 'Ogun', lga: 'Abeokuta South', target: 8000000, raised: 3200000, returnPct: 24, durationMonths: 12,
    risk: 'Medium', category: 'Livestock', minInvestment: 100000, investors: 8, verified: true,
    desc: 'Phase 2 of a poultry farm that already has 10,000 birds. This funding builds the on-site feed mill which will cut feed costs by 40% and supply neighboring farms.',
    tags: ['Poultry', 'Feed Mill', 'Ogun'],
    milestones: ['Phase 1 farm operational', 'Offtake agreement signed with Shoprite', 'Feed mill design complete'],
    returns: [{ period: 'Month 6', event: 'Interim progress report' }, { period: 'Month 12', event: 'Full harvest + payout' }],
  },
  {
    id: 'inv3', title: 'Tomato Greenhouse — 2 Hectares', farmer: 'Emeka Okafor', farmerInitials: 'EO', farmerBg: 'bg-red-700',
    state: 'Anambra', lga: 'Onitsha', target: 1500000, raised: 1500000, returnPct: 22, durationMonths: 4,
    risk: 'Low', category: 'Horticulture', minInvestment: 25000, investors: 31, verified: true,
    desc: 'Fully funded greenhouse tomato project. Investors in this round have been confirmed and are awaiting payout in Month 4.',
    tags: ['Tomatoes', 'Greenhouse', 'Anambra'],
    milestones: ['Greenhouse structure complete', 'Seedlings planted', 'Drip irrigation running'],
    returns: [{ period: 'Month 4', event: 'Harvest + full payout' }],
  },
  {
    id: 'inv4', title: 'Rice Paddy — 80 Hectares (Ebonyi)', farmer: 'Ifeanyi Rice Farms', farmerInitials: 'IR', farmerBg: 'bg-emerald-700',
    state: 'Ebonyi', lga: 'Abakaliki', target: 3000000, raised: 900000, returnPct: 20, durationMonths: 8,
    risk: 'Low', category: 'Grain Farming', minInvestment: 50000, investors: 6, verified: true,
    desc: 'Ebonyi is Nigeria\'s rice capital. Ifeanyi\'s farm has direct off-take agreements with two rice mills. The funding goes toward seed, fertilizer and labor for the upcoming season.',
    tags: ['Rice', 'Paddy', 'Ebonyi'],
    milestones: ['Land cleared', 'Off-take agreements signed'],
    returns: [{ period: 'Month 4', event: 'First harvest (50%)' }, { period: 'Month 8', event: 'Second harvest + full payout' }],
  },
  {
    id: 'inv5', title: 'Cocoa Export Farm — Ondo State', farmer: 'Ondo Premium Cocoa', farmerInitials: 'OP', farmerBg: 'bg-yellow-700',
    state: 'Ondo', lga: 'Owo', target: 6000000, raised: 4200000, returnPct: 28, durationMonths: 10,
    risk: 'Medium', category: 'Cash Crops', minInvestment: 75000, investors: 19, verified: true,
    desc: 'Premium cocoa beans for export to European chocolate manufacturers. Ondo Premium Cocoa has a confirmed purchase agreement with Olam International at $2,800/tonne.',
    tags: ['Cocoa', 'Export', 'Ondo'],
    milestones: ['Farm certified organic', 'Olam agreement signed', '60% funded'],
    returns: [{ period: 'Month 5', event: 'First sale to Olam' }, { period: 'Month 10', event: 'Final sale + full payout' }],
  },
  {
    id: 'inv6', title: 'Irrigation Infrastructure — Katsina', farmer: 'Yusuf Bello Farms', farmerInitials: 'YB', farmerBg: 'bg-teal-700',
    state: 'Katsina', lga: 'Daura', target: 5000000, raised: 800000, returnPct: 15, durationMonths: 8,
    risk: 'Low', category: 'Infrastructure', minInvestment: 100000, investors: 4, verified: false,
    desc: 'Borehole + irrigation canal to service 5 smallholder farms in Daura LGA. The infrastructure will be used for 3 growing seasons per year, generating rental income that pays investor returns.',
    tags: ['Irrigation', 'Infrastructure', 'Katsina'],
    milestones: ['Land survey complete', 'Government permit obtained'],
    returns: [{ period: 'Month 4', event: 'First season rental income' }, { period: 'Month 8', event: 'Returns distributed' }],
  },
];

const RISK_COLORS: Record<string, string> = {
  Low: 'bg-green-100 text-green-700 border-green-200',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200',
  High: 'bg-red-100 text-red-700 border-red-200',
};

const CATEGORIES = ['All', 'Grain Farming', 'Livestock', 'Horticulture', 'Cash Crops', 'Infrastructure'];

const INTL_OPPORTUNITIES = [
  {
    id: 'gh_inv1', title: 'Ghana Cocoa Farm — Ashanti Region', farmer: 'Kwame Asante Cooperative', farmerInitials: 'KA', farmerBg: 'bg-yellow-700',
    state: 'Ashanti, Ghana', lga: 'Kumasi', target: 3000000, raised: 1800000, returnPct: 35, durationMonths: 8,
    risk: 'Medium', category: 'Cash Crops', minInvestment: 50000, investors: 14, verified: true, country: 'GH',
    desc: 'Premium cocoa beans from Ghana\'s Ashanti region with confirmed EU export contracts. Ghana produces 20% of global cocoa supply. Returns in Nigerian Naira equivalent.',
    tags: ['Cocoa', 'Ghana', 'Export'], milestones: ['Farm certified', 'EU buyer confirmed'], returns: [{ period: 'Month 8', event: 'Harvest + payout in ₦ equivalent' }],
  },
  {
    id: 'ke_inv1', title: 'Kenya AA Coffee — Nyeri County', farmer: 'Wanjiku Coffee Cooperative', farmerInitials: 'WC', farmerBg: 'bg-brown-700',
    state: 'Nyeri, Kenya', lga: 'Nyeri Town', target: 5000000, raised: 2100000, returnPct: 42, durationMonths: 10,
    risk: 'Medium', category: 'Cash Crops', minInvestment: 75000, investors: 9, verified: true, country: 'KE',
    desc: 'Kenya AA is among the world\'s most sought-after coffee varieties. This cooperative of 45 smallholders has a confirmed purchase contract with Starbucks supplier.',
    tags: ['Coffee', 'Kenya', 'Export'], milestones: ['Cooperative formed', 'Starbucks agreement signed'], returns: [{ period: 'Month 10', event: 'Harvest + returns in ₦ equivalent' }],
  },
  {
    id: 'za_inv1', title: 'South Africa Avocado Farm — Limpopo', farmer: 'Green Valley SA', farmerInitials: 'GV', farmerBg: 'bg-green-700',
    state: 'Limpopo, South Africa', lga: 'Tzaneen', target: 8000000, raised: 3500000, returnPct: 38, durationMonths: 12,
    risk: 'Low', category: 'Horticulture', minInvestment: 100000, investors: 22, verified: true, country: 'ZA',
    desc: 'Avocado demand has surged 300% in Europe over 5 years. This established farm supplies Tesco and Walmart SA. Low risk due to existing trees (no planting needed).',
    tags: ['Avocado', 'South Africa', 'Export'], milestones: ['Trees mature', 'Tesco contract renewed'], returns: [{ period: 'Month 6', event: 'First harvest payout 50%' }, { period: 'Month 12', event: 'Second harvest + full payout' }],
  },
  {
    id: 'et_inv1', title: 'Ethiopia Sesame + Teff — Tigray', farmer: 'Nile Basin Farms', farmerInitials: 'NB', farmerBg: 'bg-orange-700',
    state: 'Tigray, Ethiopia', lga: 'Humera', target: 2500000, raised: 700000, returnPct: 30, durationMonths: 6,
    risk: 'Medium', category: 'Cash Crops', minInvestment: 50000, investors: 5, verified: true, country: 'ET',
    desc: 'Ethiopia produces 70% of global teff (now trendy in Europe as gluten-free grain). Sesame is a major export commodity. Returns payable in ₦ at prevailing exchange rates.',
    tags: ['Sesame', 'Teff', 'Ethiopia'], milestones: ['Land ready', 'EU organic certification pending'], returns: [{ period: 'Month 6', event: 'Full harvest + payout' }],
  },
];

const INVEST_COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹' },
];

export default function InvestPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [category, setCategory] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [selected, setSelected] = useState<typeof OPPORTUNITIES[0] | null>(null);
  const [investCountry, setInvestCountry] = useState('NG');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [invested, setInvested] = useState(false);

  const activePool = investCountry === 'NG'
    ? OPPORTUNITIES
    : INTL_OPPORTUNITIES.filter(o => o.country === investCountry);

  const filtered = activePool.filter(o => {
    if (category !== 'All' && o.category !== category) return false;
    if (riskFilter !== 'All' && o.risk !== riskFilter) return false;
    return true;
  });

  const totalFunded = OPPORTUNITIES.reduce((s, o) => s + o.raised, 0);
  const allOpen = [...OPPORTUNITIES, ...INTL_OPPORTUNITIES].filter(o => o.raised < o.target).length;

  const handleInvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/auth?redirect=/invest'); return; }
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setInvested(true);
    setSelected(null);
    setTimeout(() => setInvested(false), 5000);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar />

      {/* Hero */}
      <div className="bg-brand-950 pt-24 pb-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-600/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-amber-500/8 blur-3xl" />
        <div className="container-tight relative z-10 py-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/15 border border-brand-500/25 rounded-full px-4 py-1.5 text-sm text-brand-300 font-medium mb-5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {allOpen} opportunities open across Africa
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Fund African Farms.<br />
              <span className="text-brand-400">Earn Real Returns.</span>
            </h1>
            <p className="text-brand-200/70 text-lg mb-8 leading-relaxed">
              Invest in verified farms across Nigeria, Ghana, Kenya, South Africa and more. Earn 15–42% returns per harvest cycle. Every naira is protected by FarmLink escrow until you confirm returns received.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-xl">
              {[
                { num: '15–28%', label: 'Average Returns', sub: 'per harvest cycle' },
                { num: `₦${(totalFunded / 1000000).toFixed(0)}M+`, label: 'Deployed Capital', sub: 'across all farms' },
                { num: '100%', label: 'Repayment Rate', sub: 'on completed deals' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <p className="font-black text-brand-300 text-xl mb-0.5">{s.num}</p>
                  <p className="text-white text-xs font-semibold">{s.label}</p>
                  <p className="text-brand-400/60 text-[10px]">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How investment works bar */}
        <div className="border-t border-white/8 mt-8">
          <div className="container-tight py-4">
            <div className="flex items-center gap-6 overflow-x-auto">
              {[
                { icon: '🔍', step: 'Browse', desc: 'Find verified farm opportunities' },
                { icon: '💰', step: 'Invest', desc: 'Choose amount from ₦25,000+' },
                { icon: '🌾', step: 'Farm grows', desc: 'Track progress with updates' },
                { icon: '🔒', step: 'Harvest', desc: 'Escrow releases capital + returns' },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-brand-700/50 flex items-center justify-center text-lg">{s.icon}</div>
                  <div>
                    <p className="text-white text-xs font-bold">{s.step}</p>
                    <p className="text-brand-400/60 text-[10px]">{s.desc}</p>
                  </div>
                  {i < 3 && <span className="text-brand-600 mx-2 flex-shrink-0">→</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container-tight py-8">
        {invested && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 mb-6">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-black text-green-800">Investment request submitted!</p>
              <p className="text-green-600 text-sm">Our team will review and confirm your investment within 24 hours. You'll receive an SMS update.</p>
            </div>
          </div>
        )}

        {/* Country switcher */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase mb-3">Invest in farms from</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {INVEST_COUNTRIES.map(c => (
              <button
                key={c.code}
                onClick={() => { setInvestCountry(c.code); setCategory('All'); setRiskFilter('All'); }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border transition-all ${investCountry === c.code ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'}`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            ))}
          </div>
          {investCountry !== 'NG' && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-sm text-blue-700">
              <span className="text-xl flex-shrink-0">🌍</span>
              <div>
                <p className="font-bold mb-0.5">Cross-border investment — {INVEST_COUNTRIES.find(c => c.code === investCountry)?.name}</p>
                <p className="text-xs text-blue-600 leading-relaxed">Returns are calculated and paid in Nigerian Naira (₦) at the prevailing exchange rate on the payout date. FarmLink works with licensed money transfer operators to settle cross-border returns. Your investment is still protected by FarmLink escrow.</p>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${category === c ? 'bg-brand-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 ml-auto">
            {['All', 'Low', 'Medium'].map(r => (
              <button key={r} onClick={() => setRiskFilter(r)} className={`px-3 py-2 rounded-full text-xs font-bold transition-all ${riskFilter === r ? 'bg-ink text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                {r === 'All' ? 'All Risk' : `${r} Risk`}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {filtered.map(opp => {
            const pct = Math.round((opp.raised / opp.target) * 100);
            const full = opp.raised >= opp.target;
            return (
              <div key={opp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-card-hover transition-all overflow-hidden">
                {/* Top banner */}
                <div className="bg-gradient-to-br from-brand-950 to-brand-800 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${opp.farmerBg} flex items-center justify-center text-white font-black text-sm flex-shrink-0`}>{opp.farmerInitials}</div>
                    <div className="flex gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${RISK_COLORS[opp.risk]}`}>{opp.risk} Risk</span>
                      {opp.verified && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">✓ Verified</span>}
                    </div>
                  </div>
                  <h3 className="font-black text-white text-sm leading-snug mb-1">{opp.title}</h3>
                  <p className="text-brand-400 text-xs">by {opp.farmer} · {opp.lga}, {opp.state}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {opp.tags.map(t => <span key={t} className="text-[10px] bg-white/10 text-brand-300 px-1.5 py-0.5 rounded-full">{t}</span>)}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-gray-500 text-xs mb-3 leading-relaxed line-clamp-2">{opp.desc}</p>

                  {/* Key numbers */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="bg-green-50 rounded-xl py-2">
                      <p className="font-black text-green-700 text-base">{opp.returnPct}%</p>
                      <p className="text-[10px] text-gray-400">Returns</p>
                    </div>
                    <div className="bg-blue-50 rounded-xl py-2">
                      <p className="font-black text-blue-700 text-base">{opp.durationMonths}mo</p>
                      <p className="text-[10px] text-gray-400">Duration</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl py-2">
                      <p className="font-black text-amber-700 text-sm">₦{(opp.minInvestment / 1000).toFixed(0)}K</p>
                      <p className="text-[10px] text-gray-400">Min. invest</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>₦{(opp.raised / 1000000).toFixed(1)}M raised · {opp.investors} investors</span>
                      <span className="font-bold text-ink">{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all ${full ? 'bg-gray-400' : 'bg-brand-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">Target: ₦{(opp.target / 1000000).toFixed(1)}M</span>
                      {full ? <span className="text-gray-500 font-semibold">Fully funded</span> : <span className="text-brand-600 font-semibold">₦{((opp.target - opp.raised) / 1000000).toFixed(1)}M left</span>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setSelected(opp)} className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600 transition-all">
                      View Details
                    </button>
                    <button
                      onClick={() => !full && setSelected(opp)}
                      disabled={full}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${full ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-brand-700 hover:bg-brand-600 active:scale-95 text-white'}`}
                    >
                      {full ? '✓ Funded' : 'Invest Now →'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why invest section */}
        <div className="bg-brand-950 rounded-3xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white mb-2">Why Invest Through FarmLink?</h2>
            <p className="text-brand-300/70 text-sm max-w-lg mx-auto">We are the only agricultural investment platform that combines escrow protection, farmer verification, and real-time harvest tracking.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🔍', title: 'KYC-Verified Farmers', desc: 'Every farmer is identity-verified with NIN, BVN, and physical farm visit before listing' },
              { icon: '🔒', title: 'Escrow Protected', desc: 'Your investment is held in escrow until you confirm returns received — not before' },
              { icon: '📸', title: 'Progress Updates', desc: 'Receive photos and field agent reports at each growth milestone' },
              { icon: '⚖️', title: 'Dispute Resolution', desc: 'FarmLink mediates any dispute. If a crop fails due to fraud, we investigate and recover' },
            ].map(f => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <span className="text-3xl block mb-3">{f.icon}</span>
                <p className="font-bold text-white text-sm mb-1">{f.title}</p>
                <p className="text-brand-400/70 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compound calculator */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-black text-ink text-lg mb-1">Investment Return Calculator</h2>
          <p className="text-gray-400 text-sm mb-6">See how your investment grows when you reinvest returns each cycle (@ 18% per 6-month cycle)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-semibold text-gray-400">CYCLE</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-400">₦100K INVESTED</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-400">₦500K INVESTED</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-400">₦1M INVESTED</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-400">GAIN</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cycle: 'Month 0 (Start)', v100: 100000, v500: 500000, v1m: 1000000 },
                  { cycle: 'Month 6 (Cycle 1)', v100: 118000, v500: 590000, v1m: 1180000 },
                  { cycle: 'Month 12 (Cycle 2)', v100: 139240, v500: 696200, v1m: 1392400 },
                  { cycle: 'Month 18 (Cycle 3)', v100: 164303, v500: 821516, v1m: 1643032 },
                  { cycle: 'Month 24 (Cycle 4)', v100: 193877, v500: 969389, v1m: 1938779 },
                  { cycle: 'Year 3 (Cycle 6)', v100: 270267, v500: 1351335, v1m: 2702670 },
                ].map((r, i) => (
                  <tr key={r.cycle} className={`border-b border-gray-50 ${i === 5 ? 'bg-green-50' : ''}`}>
                    <td className={`py-3 text-sm ${i === 5 ? 'font-black text-green-700' : 'text-gray-600'}`}>{r.cycle}</td>
                    <td className={`py-3 text-right font-bold ${i === 5 ? 'text-green-700' : 'text-ink'}`}>₦{r.v100.toLocaleString()}</td>
                    <td className={`py-3 text-right font-bold ${i === 5 ? 'text-green-700' : 'text-ink'}`}>₦{r.v500.toLocaleString()}</td>
                    <td className={`py-3 text-right font-bold ${i === 5 ? 'text-green-700' : 'text-ink'}`}>₦{r.v1m.toLocaleString()}</td>
                    <td className={`py-3 text-right text-xs font-semibold ${i > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                      {i === 0 ? '—' : `+${Math.round(((r.v100 - 100000) / 100000) * 100)}%`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">⚠️ Returns are not guaranteed and depend on harvest outcomes. Past performance does not guarantee future results. Each investment is a separate fixed-term deal.</p>
        </div>
      </div>

      <Footer />

      {/* Investment modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-brand-950 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-brand-400 text-xs mb-1">{selected.category}</p>
                  <h3 className="font-black text-white text-base leading-snug">{selected.title}</h3>
                  <p className="text-brand-300/70 text-xs mt-0.5">by {selected.farmer} · {selected.state}</p>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white text-2xl leading-none ml-4">&times;</button>
              </div>
            </div>

            <div className="p-5">
              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">{selected.desc}</p>

              {/* Milestones */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">CURRENT STATUS</p>
                <div className="space-y-1.5">
                  {selected.milestones.map(m => (
                    <div key={m} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-green-500 text-white flex items-center justify-center text-[9px] font-black flex-shrink-0">✓</span>
                      {m}
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">RETURN SCHEDULE</p>
                <div className="space-y-1.5">
                  {selected.returns.map(r => (
                    <div key={r.period} className="flex items-center gap-2 text-xs">
                      <span className="bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">{r.period}</span>
                      <span className="text-gray-600">{r.event}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment form */}
              {selected.raised < selected.target ? (
                <form onSubmit={handleInvest} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Investment Amount (₦) *</label>
                    <input
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder={`Min ₦${selected.minInvestment.toLocaleString()}`}
                      required type="number" min={selected.minInvestment}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400/20"
                    />
                    {amount && Number(amount) >= selected.minInvestment && (
                      <p className="text-xs text-green-600 mt-1 font-semibold">
                        Expected return: ₦{Math.round(Number(amount) * (1 + selected.returnPct / 100)).toLocaleString()} in {selected.durationMonths} months
                      </p>
                    )}
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-700">
                    ⚠️ Agricultural investments carry risk. Returns depend on harvest success. FarmLink escrow protects your capital but cannot guarantee returns in cases of natural disaster or crop failure.
                  </div>
                  <button type="submit" disabled={submitting} className="w-full bg-brand-700 hover:bg-brand-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    {submitting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '💼'}
                    {submitting ? 'Processing...' : !isAuthenticated ? 'Sign In to Invest' : 'Confirm Investment'}
                  </button>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="font-bold text-gray-600 mb-1">✓ This opportunity is fully funded</p>
                  <p className="text-xs text-gray-400">Check back for new opportunities or browse others below.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
